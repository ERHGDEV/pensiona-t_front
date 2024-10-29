import jsPDF from 'jspdf'
import 'jspdf-autotable'

const getFormattedDate = () => {
    const date = new Date()
    return date.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
  }

const generatePDF = ( results, SALARIO_MINIMO ) => {
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
    doc.setFillColor(fillColor)
    doc.rect(x, y, width, height, "F")

    doc.setTextColor(33, 53, 71)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)
    doc.text('Proyección de pensión', doc.internal.pageSize.width / 2, height + 10, { align: 'center' })

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    const currentDate = getFormattedDate()
    doc.text(`${currentDate}`, doc.internal.pageSize.width - 17, 15, { align: 'right' })
    doc.text(`Semanas cotizadas actuales: ${results.semanasCotizadas}`, 15, height + 20)
    doc.text(`Edad:  ${results.edad}`, 15, height + 25)

    const dataNuevaTabla =   [
      [ { content: 'Salario mínimo vigente:', styles: { fontStyle: 'normal', halign: 'right' }}, { content: '$' + SALARIO_MINIMO.toFixed(2), styles: { fontStyle: 'normal' }}, '', 'Cálculo Mensual' ],
      [ { content: 'Salario mensual promedio últimos 5 años:', colSpan: 3 }, `${'$' +   results.salarioPromedio.toFixed(2)}` ],
      [ { content: 'Porcentaje de Cuantía:', colSpan: 2}, `${results.porcentajeCuantia.toFixed(2)}%`, `${'$' +    results.cuantiaBasica.toFixed(2)}`],
      [ { content: 'Semanas Cotizadas', rowSpan: 3 }, 'Total:', `${results.semanasCotizadas}`, { content: '', rowSpan: 4 } ],
      [ 'Requisito:', '500' ],
      [ 'Excedentes:', `${results.semanasExcedentes}` ],
      [ { content: 'Incrementos por años excedentes:', colSpan: 2 }, `${results.aniosExcedentes}` ],
      [ { content: 'Porcentaje de incremento:', colSpan: 2 }, `${results.porcentajeIncremento.toFixed(2)}%`, `${'$' + results.incremento.toFixed(2)}` ],
      [ { content: 'Suma de cuantía e incrementos:', colSpan: 3, styles: { fillColor: [200, 200, 200] } }, { content: '$' + results.sumaCuantiaIncrementos.toFixed(2), styles: { fontStyle: 'bold', fillColor: [200, 200, 200] }} ],
      [ { content: 'Asignaciones familiares', rowSpan: 2 }, 'Esposa (o):', '15%', `${'$' + results.asignacionEsposa.toFixed(2)}` ],
      [ 'Hijos:', '10% c/u', `${'$' + results.asignacionHijos.toFixed(2)}` ],
      [ { content: 'Ayuda asistencial (15% a 20%):', colSpan: 2 }, '15%', `${'$' + results.ayudaAsistencial.toFixed(2)}` ],
      [ { content: 'Total de cuantía básica:', colSpan: 3, styles: { fillColor: [200, 200, 200] } }, { content: '$' + results.totalCuantiaBasica.toFixed(2), styles: { fontStyle: 'bold', fillColor: [200, 200, 200] }} ],
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

    const bottomRectHeight = lineHeight * 1
    const bottomRectY = doc.internal.pageSize.height - bottomRectHeight

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

    doc.setFillColor(fillColor)
    doc.rect(x, bottomRectY, width, bottomRectHeight, "F")

    doc.setTextColor(255, 255, 255)
    doc.text('Pensiona-T', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 3, { align: 'center' })

    doc.save('Proyección.pdf')
}

export default generatePDF