import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { MONTHS as months } from '../constants/calculateData'
import { PERCENTAGES as percentages } from '../constants/calculateData'

const getFormattedDate = () => {
  const date = new Date()
  return date.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
}

const generatePDF = (results) => {
  if (!results) return

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
    marginLeft: 15,
    marginRight: 15,
  })

  const lineHeight = 10
  const x = 0
  const y = 0
  const width = doc.internal.pageSize.width
  const height = lineHeight * 1
  const fillColor = '082f49'

  const addHeader = (text) => {
    doc.setFillColor(fillColor)
    doc.rect(x, y, width, height, "F")

    doc.setTextColor(33, 53, 71)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)
    doc.text(text, doc.internal.pageSize.width / 2, height + 10, { align: 'center' })

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    const currentDate = getFormattedDate()
    doc.text(`${currentDate}`, doc.internal.pageSize.width - 17, 15, { align: 'right' })
  }

  const addFooter = () => {
    const bottomRectHeight = lineHeight * 1
    const bottomRectY = doc.internal.pageSize.height - bottomRectHeight

    doc.setFillColor(fillColor)
    doc.rect(x, bottomRectY, width, bottomRectHeight, "F")

    doc.setTextColor(255, 255, 255)
    doc.text('Pensiona-T', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 4, { align: 'center' })
  }

  addHeader('Proyección de pensión')

  doc.text(`Semanas cotizadas actuales: ${results.weeksContributed}`, 15, height + 20)
  doc.text(`Edad:  ${results.age}`, 15, height + 25)

  const dataNuevaTabla = [
    [{ content: 'Salario mínimo vigente:', styles: { fontStyle: 'normal', halign: 'right' } }, { content: '$' + results.salarioMinimo.toFixed(2), styles: { fontStyle: 'normal' } }, '', 'Cálculo Mensual'],
    [{ content: 'Salario mensual promedio últimos 5 años:', colSpan: 3 }, `${'$' + (parseInt(results.averageSalary)).toFixed(2)}`],
    [{ content: 'Porcentaje de Cuantía:', colSpan: 2 }, `${results.pensionResults.normalResults.porcentajeCuantia.toFixed(2)}%`, `${'$' + results.pensionResults.normalResults.cuantiaBasica.toFixed(2)}`],
    [{ content: 'Semanas Cotizadas', rowSpan: 3 }, 'Total:', `${results.pensionResults.normalResults.semanasTotales}`, { content: '', rowSpan: 4 }],
    ['Requisito:', '500'],
    ['Excedentes:', `${results.pensionResults.normalResults.semanasExcedentes}`],
    [{ content: 'Incrementos por años excedentes:', colSpan: 2 }, `${results.pensionResults.normalResults.aniosExcedentes}`],
    [{ content: 'Porcentaje de incremento:', colSpan: 2 }, `${results.pensionResults.normalResults.porcentajeIncremento.toFixed(2)}%`, `${'$' + results.pensionResults.normalResults.incremento.toFixed(2)}`],
    [{ content: 'Suma de cuantía e incrementos:', colSpan: 3, styles: { fillColor: [8, 47, 73], textColor: [255, 255, 255] } }, { content: '$' + results.pensionResults.normalResults.sumaCuantiaIncrementos.toFixed(2), styles: { fontStyle: 'bold', fillColor: [8, 47, 73], textColor: [255, 255, 255] } }],
    [{ content: 'Asignaciones familiares', rowSpan: 2 }, 'Esposa (o):', '15%', `${'$' + results.pensionResults.normalResults.asignacionEsposa.toFixed(2)}`],
    ['Hijos:', '10% c/u', `${'$' + results.pensionResults.normalResults.asignacionHijos.toFixed(2)}`],
    [{ content: 'Ayuda asistencial (15% a 20%):', colSpan: 2 }, '15%', `${'$' + results.pensionResults.normalResults.ayudaAsistencial.toFixed(2)}`],
    [{ content: 'Total de cuantía básica:', colSpan: 3, styles: { fillColor: [8, 47, 73], textColor: [255, 255, 255] } }, { content: '$' + results.pensionResults.normalResults.totalCuantiaBasica.toFixed(2), styles: { fontStyle: 'bold', fillColor: [8, 47, 73], textColor: [255, 255, 255] } }],
  ]

  const stylesPDF = {
    theme: 'grid',
    styles: {
      fontSize: 10,
      lineWidth: 0.1,
      lineColor: [8, 47, 73],
      cellPadding: 2,
      cellSpacing: 0,
      valign: 'middle',
      halign: 'center',
      fontStyle: 'normal',
      overflow: 'linebreak',
      fillColor: [255, 255, 255],
      textColor: [33, 53, 71],
      fillStyle: 'F',
    },
    headStyles: {
      fillColor: [8, 47, 73],
      fontStyle: 'bold',
      textColor: [255, 255, 255],
    },
  }

  doc.autoTable({
    head: [dataNuevaTabla[0]],
    body: dataNuevaTabla.slice(1),
    startY: 40,
    theme: stylesPDF.theme,
    styles: stylesPDF.styles,
    headStyles: stylesPDF.headStyles,
  })

  const resultTableData = [
    ['Edad de retiro', 'Porcentaje', 'Pensión Mensual'],
    ...results.pensionResults.normalResults.pensionPorEdad.map(r => [
      `${r.age} años`,
      `${r.percentage.toFixed(0)}%`,
      `$${r.pension.toFixed(2)}`  
    ])
  ]
  
  doc.autoTable({
    head: [resultTableData[0]],
    body: resultTableData.slice(1),
    startY: doc.lastAutoTable.finalY + 10,
    theme: stylesPDF.theme,
    styles: stylesPDF.styles,
    headStyles: stylesPDF.headStyles,
    columnStyles: {
      2: { fontStyle: 'bold' }  
    }
  })

  const bottomRectY = doc.internal.pageSize.height - lineHeight

  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.text('Consideraciones para la proyección', 15, bottomRectY - 37)

  doc.setFont("helvetica", "normal")
  doc.text('• Este cálculo únicamente es una proyección, el IMSS realizará el cálculo final al momento del trámite.', 15, bottomRectY - 30)
  doc.text('• Asignaciones familiares y ayuda asistencial, Artículo 164 LSS 1973.', 15, bottomRectY - 25)
  doc.text('• Cuantía de las pensiones, Artículo 167 LSS 1973.', 15, bottomRectY - 20)
  doc.text('• Pensión mínima, Artículo 168 LSS 1973.', 15, bottomRectY - 15)
  doc.text('• Tope de pensión es el salario promedio, Artículo 169 LSS 1973.', 15, bottomRectY - 10)
  doc.text('• Tope 25 umas, Transitorio Cuarto inciso II LSS 1973.', 15, bottomRectY - 5)

  addFooter()

  if (results.salaryModalidad40 && results.pensionResults.modalidad40Results.salarioPromedioModalidad40 && results.pensionResults.modalidad40Results.pensionModalidad40) {
    doc.addPage()
    addHeader('Modalidad 40')

    const getMonthName = (monthNumber) => {
      return months[monthNumber - 1]
    }

    const column1X = 15 
    const column2X = doc.internal.pageSize.width / 2 
    const baseY = height + 20 
    const lineSpacing = 5 

    doc.text(`Salario a registrar: $${(parseInt(results.salaryModalidad40)).toFixed(2)}`, column1X, baseY)
    doc.setFont("helvetica", "bold") 
    doc.text(`Salario promedio final: $${results.pensionResults.modalidad40Results.salarioPromedioModalidad40.toFixed(2)}`, column1X, baseY + lineSpacing)
    doc.setFont("helvetica", "normal") 

    const anosTexto = `Se pagará por: `
    const anosNegrita = `${results.yearsModalidad40} años`
    doc.text(anosTexto, column2X, baseY)
    doc.setFont("helvetica", "bold") 
    doc.text(anosNegrita, column2X + doc.getTextWidth(anosTexto), baseY) 
    doc.setFont("helvetica", "normal")

    const inicioTexto = `Inicio de pago: `
    const inicioNegrita = `${getMonthName(parseInt(results.startMonth))} del ${results.startYear}`
    doc.text(inicioTexto, column2X, baseY + lineSpacing)
    doc.setFont("helvetica", "bold") 
    doc.text(inicioNegrita, column2X + doc.getTextWidth(inicioTexto), baseY + lineSpacing) 
    doc.setFont("helvetica", "normal") 

    const modalidad40TableData = [
      ['Edad de retiro', 'Pensión Normal', 'Pensión Mod 40', 'Diferencia'],
      ...results.pensionResults.normalResults.pensionPorEdad.map((r, index) => [
        `${r.age} años`,
        `$${r.pension.toFixed(2)}`,
        { content: '$' + results.pensionResults.modalidad40Results.pensionModalidad40[index].pension.toFixed(2), styles: { fontStyle: 'bold' } },
        `$${(results.pensionResults.modalidad40Results.pensionModalidad40[index].pension - r.pension).toFixed(2)}`
      ])
    ]

    doc.autoTable({
      head: [modalidad40TableData[0]],
      body: modalidad40TableData.slice(1),
      startY: 40,
      theme: stylesPDF.theme,
      styles: stylesPDF.styles,
      headStyles: stylesPDF.headStyles,
    })

    const costsTableData = [
      ['Año', 'Costo', 'Meses', 'Pago Mensual', 'Costo Anualizado']
    ]

    let totalGastoAnualizado = 0
    const startYear = parseInt(results.startYear)
    const startMonth = parseInt(results.startMonth)
    const yearsToCalculate = parseInt(results.yearsModalidad40)
    let remainingMonths = yearsToCalculate * 12

    for (let i = 0; remainingMonths > 0; i++) {
      const year = startYear + i
      let percentage
      if (year < 2022) {
        percentage = percentages[2022]
      } else if (year > 2030) {
        percentage = percentages[2030]
      } else {
        percentage = percentages[year]
      }
      const costoMensual = results.salaryModalidad40 * (percentage / 100)
      const meses = i === 0 ? 13 - startMonth : (remainingMonths >= 12 ? 12 : remainingMonths)
      const gastoAnualizado = costoMensual * meses

      costsTableData.push([
        year.toString(),
        { content: `${percentage.toFixed(3)}%`, styles: { fontStyle: 'bold' } }, 
        meses.toString(),
        { content: `$${costoMensual.toFixed(2)}`, styles: { fontStyle: 'bold' } }, 
        `$${gastoAnualizado.toFixed(2)}`
      ])

      totalGastoAnualizado += gastoAnualizado
      remainingMonths -= meses
    }

    costsTableData.push([
      { content: '', styles: { fillColor: [8, 47, 73] } }, 
      { content: '', styles: { fillColor: [8, 47, 73] } }, 
      { content: '', styles: { fillColor: [8, 47, 73] } }, 
      { content: 'Inversión total', styles: { fontStyle: 'bold', fillColor: [8, 47, 73], textColor: [255, 255, 255] } }, 
      { content: `$${totalGastoAnualizado.toFixed(2)}`, styles: { fontStyle: 'bold', fillColor: [8, 47, 73], textColor: [255, 255, 255] } }
    ])
    
    doc.autoTable({
      head: [costsTableData[0]],
      body: costsTableData.slice(1),
      startY: doc.lastAutoTable.finalY + 10,
      theme: stylesPDF.theme,
      styles: stylesPDF.styles,
      headStyles: stylesPDF.headStyles,
    })

    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.text('Consideraciones adicionales para Modalidad 40', 15, bottomRectY - 42)

    doc.setFont("helvetica", "normal")
    doc.text('• La Modalidad 40 permite continuar cotizando voluntariamente para incrementar las semanas cotizadas.', 15, bottomRectY - 35)
    doc.text('• Es requisito que el asegurado se encuentre dado de baja del régimen obligatorio.', 15, bottomRectY - 30)
    doc.text('• La decisión de utilizar Modalidad 40 debe ser evaluada cuidadosamente según cada caso particular.', 15, bottomRectY - 25)
    doc.text('• Los costos mostrados son aproximados y pueden variar según las actualizaciones del IMSS.', 15, bottomRectY -20)
    doc.text('• El registro en la Modalidad 40 se realiza directamente en ventanilla de la Subdelegación del IMSS.', 15, bottomRectY - 15)
    doc.text('• El pago mensual se realiza en ventanilla bancaria con los datos porporcionados por el IMSS.', 15, bottomRectY - 10)
    doc.text('• La Modalidad 40 no genera el derecho a los servicios médicos.', 15, bottomRectY - 5)

    addFooter()
  }

  doc.save('Proyección.pdf')
}

export default generatePDF