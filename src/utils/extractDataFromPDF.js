import * as pdfjsLib from 'pdfjs-dist'

const extractDataFromPDF = async (pdfData) => {
    const loadingTask = pdfjsLib.getDocument({ data: pdfData })
    const pdf = await loadingTask.promise
  
    let totalSemanas = null
    let curp = null
    const movimientos = []
  
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      
      const pageText = textContent.items.map((item) => item.str).join(' ').replace(/\s+/g, ' ').trim()
  
      const semanasMatch = pageText.match(/(\d+)\s+(?=NSS)/i)
        if (semanasMatch) {
        totalSemanas = semanasMatch[1]
        }

      const curpMatch = pageText.match(/[A-Z]{4}\d{6}[A-Z]{6}\d{2}/i);
        if (curpMatch) {
          curp = curpMatch[0];
      }

      const movimientoRegex = /(\d{2}\/\d{2}\/\d{4})\s+([A-Z\s]+)\s+\$\s*([\d,.]+)/g
      let match
      while ((match = movimientoRegex.exec(pageText)) !== null) {
        movimientos.push({
          fecha: match[1],
          tipoMovimiento: match[2].trim(),
          salarioBase: parseFloat(match[3].replace(/,/g, ''))
        })
      }
    }

    if (movimientos.length === 0) {
      throw new Error("Se requiere el reporte detallado")
    }      
  
    movimientos.sort((a, b) => new Date(a.fecha.split('/').reverse().join('-')) - new Date(b.fecha.split('/').reverse().join('-')))
  
    const movimientosConDias = movimientos.map((movimiento, index) => {
      const fechaActual = new Date(movimiento.fecha.split('/').reverse().join('-'))
      if (index === movimientos.length - 1) {
        const hoy = new Date()
        const dias = Math.floor((hoy - fechaActual) / (1000 * 60 * 60 * 24))
        return { ...movimiento, dias }
      }
  
      const fechaSiguiente = new Date(movimientos[index + 1].fecha.split('/').reverse().join('-'))
      const dias = Math.floor((fechaSiguiente - fechaActual) / (1000 * 60 * 60 * 24))
      return { ...movimiento, dias }
    })
  
    let diasAcumulados = 0
    let sumaSalariosPonderados = 0
  
    for (let i = movimientosConDias.length - 1; i >= 0; i--) {
      const movimiento = movimientosConDias[i]
      if (!movimiento.dias || movimiento.dias <= 0) continue
  
      const diasUsados = Math.min(1825 - diasAcumulados, movimiento.dias)
      sumaSalariosPonderados += movimiento.salarioBase * diasUsados
      diasAcumulados += diasUsados
  
      if (diasAcumulados >= 1825) break
    }
  
    const salarioPromedioDiario = diasAcumulados > 0 ? sumaSalariosPonderados / diasAcumulados : 0
    const salarioPromedio = (salarioPromedioDiario * 30.4).toFixed(2)
  
    const fechaMasAntigua = new Date(movimientos[0].fecha.split('/').reverse().join('-'))
    const fechaLey97 = new Date('1997-07-01')
    const ley = fechaMasAntigua < fechaLey97 ? 'Trabajador Ley 73' : 'Trabajador Ley 97'
  
    let edad = null;
    if (curp) {
        const anioCurp = parseInt(curp.substring(4, 6), 10); // Extraer los dos dígitos del año
        const anioNacimiento = anioCurp <= 22 ? 2000 + anioCurp : 1900 + anioCurp; // Ajustar el siglo
        const mesNacimiento = parseInt(curp.substring(6, 8), 10) - 1; // Meses en JavaScript van de 0 a 11
        const diaNacimiento = parseInt(curp.substring(8, 10), 10);
      
        const fechaNacimiento = new Date(anioNacimiento, mesNacimiento, diaNacimiento);
        const hoy = new Date();
      
        // Calcular la edad considerando si ya cumplió años este año
        edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        if (
          hoy.getMonth() < fechaNacimiento.getMonth() ||
          (hoy.getMonth() === fechaNacimiento.getMonth() && hoy.getDate() < fechaNacimiento.getDate())
        ) {
          edad--;
        }
      }

  return { totalSemanas, salarioPromedio, ley, edad };
} 

export default extractDataFromPDF