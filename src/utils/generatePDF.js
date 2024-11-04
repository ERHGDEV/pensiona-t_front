import jsPDF from 'jspdf'
import 'jspdf-autotable'

const getFormattedDate = () => {
  const date = new Date()
  return date.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
}

const generatePDF = (results, SALARIO_MINIMO) => {
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
  const fillColor = 'c8c8c8'

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

  doc.text(`Semanas cotizadas actuales: ${results.semanasCotizadas}`, 15, height + 20)
  doc.text(`Edad:  ${results.edad}`, 15, height + 25)

  const dataNuevaTabla = [
    [{ content: 'Salario mínimo vigente:', styles: { fontStyle: 'normal', halign: 'right' } }, { content: '$' + SALARIO_MINIMO.toFixed(2), styles: { fontStyle: 'normal' } }, '', 'Cálculo Mensual'],
    [{ content: 'Salario mensual promedio últimos 5 años:', colSpan: 3 }, `${'$' + results.salarioPromedio.toFixed(2)}`],
    [{ content: 'Porcentaje de Cuantía:', colSpan: 2 }, `${results.porcentajeCuantia.toFixed(2)}%`, `${'$' + results.cuantiaBasica.toFixed(2)}`],
    [{ content: 'Semanas Cotizadas', rowSpan: 3 }, 'Total:', `${results.semanasTotales}`, { content: '', rowSpan: 4 }],
    ['Requisito:', '500'],
    ['Excedentes:', `${results.semanasExcedentes}`],
    [{ content: 'Incrementos por años excedentes:', colSpan: 2 }, `${results.aniosExcedentes}`],
    [{ content: 'Porcentaje de incremento:', colSpan: 2 }, `${results.porcentajeIncremento.toFixed(2)}%`, `${'$' + results.incremento.toFixed(2)}`],
    [{ content: 'Suma de cuantía e incrementos:', colSpan: 3, styles: { fillColor: [200, 200, 200] } }, { content: '$' + results.sumaCuantiaIncrementos.toFixed(2), styles: { fontStyle: 'bold', fillColor: [200, 200, 200] } }],
    [{ content: 'Asignaciones familiares', rowSpan: 2 }, 'Esposa (o):', '15%', `${'$' + results.asignacionEsposa.toFixed(2)}`],
    ['Hijos:', '10% c/u', `${'$' + results.asignacionHijos.toFixed(2)}`],
    [{ content: 'Ayuda asistencial (15% a 20%):', colSpan: 2 }, '15%', `${'$' + results.ayudaAsistencial.toFixed(2)}`],
    [{ content: 'Total de cuantía básica:', colSpan: 3, styles: { fillColor: [200, 200, 200] } }, { content: '$' + results.totalCuantiaBasica.toFixed(2), styles: { fontStyle: 'bold', fillColor: [200, 200, 200] } }],
  ]

  const stylesPDF = {
    theme: 'grid',
    styles: {
      fontSize: 10,
      lineWidth: 0.1,
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
      fillColor: [200, 200, 200],
      fontStyle: 'bold',
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
    ...results.pensionPorEdad.map(r => [
      `${r.edad} años`,
      `${r.porcentaje.toFixed(0)}%`,
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

  if (results.salarioRegistradoM40 && results.salarioPromedioModalidad40 && results.pensionModalidad40) {
    doc.addPage()
    addHeader('Modalidad 40')

    doc.text(`Salario a registrar: $${results.salarioRegistradoM40.toFixed(2)}`, 15, height + 20)
    doc.text(`Años que se pagará: ${results.anosModalidad40}`, 15, height + 25)
    doc.text(`Salario promedio después de Modalidad 40: $${results.salarioPromedioModalidad40.toFixed(2)}`, 15, height + 30)

    const modalidad40TableData = [
      ['Edad de retiro', 'Pensión Normal', 'Pensión Mod 40', 'Diferencia'],
      ...results.pensionPorEdad.map((r, index) => [
        `${r.edad} años`,
        `$${r.pension.toFixed(2)}`,
        `$${results.pensionModalidad40[index].pension.toFixed(2)}`,
        `$${(results.pensionModalidad40[index].pension - r.pension).toFixed(2)}`
      ])
    ]

    doc.autoTable({
      head: [modalidad40TableData[0]],
      body: modalidad40TableData.slice(1),
      startY: 45,
      theme: stylesPDF.theme,
      styles: stylesPDF.styles,
      headStyles: stylesPDF.headStyles,
    })

    
    const costsTableData = [
      ['Año', 'Costo', 'Pago Mensual', 'Costo Anualizado']
    ]

    const percentages = {
      2022: 10.075,
      2023: 11.166,
      2024: 12.256,
      2025: 13.347,
      2026: 14.438,
      2027: 15.528,
      2028: 16.619,
      2029: 17.709,
      2030: 18.800
    }

    for (let year = 2022; year <= 2030; year++) {
      const percentage = percentages[year]
      const pagoMensual = results.salarioRegistradoM40 * (percentage / 100)
      const pagoAnual = pagoMensual * 12

      costsTableData.push([
        year.toString(),
        `${percentage.toFixed(3)}%`,
        `$${pagoMensual.toFixed(2)}`,
        `$${pagoAnual.toFixed(2)}`
      ])
    }

    doc.autoTable({
      head: [costsTableData[0]],
      body: costsTableData.slice(1),
      startY: doc.lastAutoTable.finalY + 7,
      theme: stylesPDF.theme,
      styles: stylesPDF.styles,
      headStyles: stylesPDF.headStyles,
    })

    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.text('¿Cómo calcular el pago de la Modalidad 40?', 15, doc.lastAutoTable.finalY + 8)

    doc.setFont("helvetica", "normal")
    doc.text('• Ubica en la tabla el año en qué iniciaras los pagos.', 15, doc.lastAutoTable.finalY + 15)
    doc.text('• Multiplica el pago mensual por los meses restantes del año.', 15, doc.lastAutoTable.finalY + 20)
    doc.text('• Suma el pago mensual con el costo anualizado del siguiente año.', 15, doc.lastAutoTable.finalY + 25)
    doc.text('• Repite el proceso hasta el año en que completes los años de pago.', 15, doc.lastAutoTable.finalY + 30)

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