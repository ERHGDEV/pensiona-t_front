import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { MONTHS as months, PERCENTAGES as percentages } from '../constants/calculateData'
import { formatCurrency } from './formatCurrency'

const lineHeight = 10
const height = lineHeight * 1

const getFormattedDate = () => {
  const date = new Date()
  return date.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
}

const initializePDF = () => {
  return new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
    marginLeft: 15,
    marginRight: 15,
  })
}

const addHeader = (doc, title) => {
  const fillColor = '082f49'
  const width = doc.internal.pageSize.width
  const height = 10

  doc.setFillColor(fillColor)
  doc.rect(0, 0, width, height, "F")

  doc.setTextColor(33, 53, 71)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(16)
  doc.text(title, width / 2, height + 10, { align: 'center' })

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(getFormattedDate(), width - 17, 15, { align: 'right' })
}

const addFooter = (doc) => {
  const width = doc.internal.pageSize.width
  const height = 10
  const y = doc.internal.pageSize.height - height

  doc.setFillColor('082f49')
  doc.rect(0, y, width, height, "F")

  doc.setTextColor(255, 255, 255)
  doc.text('Pensiona-T', width / 2, doc.internal.pageSize.height - 4, { align: 'center' })
}

const generateFirstPage = (doc, results) => {
  addHeader(doc, 'Proyección de pensión')

  doc.text(`Semanas cotizadas actuales: ${results.weeksContributed}`, 15, height + 20)
  doc.text(`Edad:  ${results.age}`, 15, height + 25)

  const dataNuevaTabla = [
    [{ content: 'Salario mínimo vigente:', styles: { fontStyle: 'normal', halign: 'right' } }, { content: formatCurrency(results.salarioMinimo), styles: { fontStyle: 'normal' } }, '', 'Cálculo Mensual'],
    [{ content: 'Salario mensual promedio últimos 5 años:', colSpan: 3 }, `${formatCurrency((parseInt(results.averageSalary)))}`],
    [{ content: 'Porcentaje de Cuantía:', colSpan: 2 }, `${results.pensionResults.normalResults.porcentajeCuantia.toFixed(2)}%`, `${formatCurrency(results.pensionResults.normalResults.cuantiaBasica)}`],
    [{ content: 'Semanas Cotizadas', rowSpan: 3 }, 'Total:', `${results.pensionResults.normalResults.semanasTotales}`, { content: '', rowSpan: 4 }],
    ['Requisito:', '500'],
    ['Excedentes:', `${results.pensionResults.normalResults.semanasExcedentes}`],
    [{ content: 'Incrementos por años excedentes:', colSpan: 2 }, `${results.pensionResults.normalResults.aniosExcedentes}`],
    [{ content: 'Porcentaje de incremento:', colSpan: 2 }, `${results.pensionResults.normalResults.porcentajeIncremento.toFixed(2)}%`, `${formatCurrency(results.pensionResults.normalResults.incremento)}`],
    [{ content: 'Suma de cuantía e incrementos:', colSpan: 3, styles: { fillColor: [8, 47, 73], textColor: [255, 255, 255] } }, { content: formatCurrency(results.pensionResults.normalResults.sumaCuantiaIncrementos), styles: { fontStyle: 'bold', fillColor: [8, 47, 73], textColor: [255, 255, 255] } }],
    [{ content: 'Asignaciones familiares', rowSpan: 2 }, 'Esposa (o):', '15%', `${formatCurrency(results.pensionResults.normalResults.asignacionEsposa)}`],
    ['Hijos:', '10% c/u', `${formatCurrency(results.pensionResults.normalResults.asignacionHijos)}`],
    [{ content: 'Ayuda asistencial (15% a 20%):', colSpan: 2 }, '15%', `${formatCurrency(results.pensionResults.normalResults.ayudaAsistencial)}`],
    [{ content: 'Total de cuantía básica:', colSpan: 3, styles: { fillColor: [8, 47, 73], textColor: [255, 255, 255] } }, { content: formatCurrency(results.pensionResults.normalResults.totalCuantiaBasica), styles: { fontStyle: 'bold', fillColor: [8, 47, 73], textColor: [255, 255, 255] } }],
  ]

  doc.autoTable({
    head: [dataNuevaTabla[0]],
    body: dataNuevaTabla.slice(1),
    startY: 40,
    theme: 'grid',
    styles: {
      fontSize: 10,
      lineWidth: 0.2,
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
    columnStyles: {
      2: { 
        fillColor: [241, 240, 240] 
      }, 
    }
  })

  const resultTableData = [
    ['Edad de retiro', 'Porcentaje', 'Pensión Mensual'],
    ...results.pensionResults.normalResults.pensionPorEdad.map(r => [
      `${r.age} años`,
      `${r.percentage.toFixed(0)}%`,
      `${formatCurrency(r.pension)}`  
    ])
  ]
  
  doc.autoTable({
    head: [resultTableData[0]],
    body: resultTableData.slice(1),
    startY: doc.lastAutoTable.finalY + 7,
    theme: 'grid',
    styles: {
      fontSize: 10,
      lineWidth: 0.2,
      lineColor: [8, 47, 73],
      cellPadding: 3,
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
    columnStyles: {
      0: { 
        fillColor: [241, 240, 240] 
      },
      2: { 
        fontStyle: 'bold',
        fillColor: [241, 240, 240] 
      }, 
    }
  })

  const bottomRectY = doc.internal.pageSize.height - lineHeight

  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.text('Consideraciones:', 15, bottomRectY - 37)

  doc.setFont("helvetica", "normal")
  doc.text('• Este cálculo es solo una proyección. El IMSS determinará el monto final de la pensión al momento del trámite.', 15, bottomRectY - 30)
  doc.text('• Las asignaciones familiares y la ayuda asistencial se rigen por el Artículo 164 de la LSS 1973.', 15, bottomRectY - 25)
  doc.text('• La cuantía de las pensiones está establecida en el Artículo 167 de la LSS 1973.', 15, bottomRectY - 20)
  doc.text('• La pensión mínima está regulada por el Artículo 168 de la LSS 1973.', 15, bottomRectY - 15)
  doc.text('• El tope de pensión corresponde al salario promedio, según el Artículo 169 de la LSS 1973.', 15, bottomRectY - 10)
  doc.text('• El límite máximo de pensión es de 25 UMAs, conforme al Transitorio Cuarto, inciso II, de la LSS 1973.', 15, bottomRectY - 5)

  addFooter(doc)
}

const generateModalidad40Page = (doc, results) => {
  doc.addPage()
  addHeader(doc, 'Modalidad 40')

  const getMonthName = (monthNumber) => {
    return months[monthNumber - 1]
  }

  const column1X = 15 
  const column2X = doc.internal.pageSize.width / 2 
  const baseY = height + 20 
  const lineSpacing = 5 

  doc.text(`Salario a registrar: ${formatCurrency(parseInt(results.salaryModalidad40))}`, column1X, baseY)
  doc.setFont("helvetica", "bold") 
  doc.text(`Salario promedio final: ${formatCurrency(results.pensionResults.modalidad40Results.salarioPromedioModalidad40)}`, column1X, baseY + lineSpacing)
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
      `${formatCurrency(r.pension)}`,
      { content: formatCurrency(results.pensionResults.modalidad40Results.pensionModalidad40[index].pension), styles: { fontStyle: 'bold' } },
      `${formatCurrency(results.pensionResults.modalidad40Results.pensionModalidad40[index].pension - r.pension)}`
    ])
  ]

  doc.autoTable({
    head: [modalidad40TableData[0]],
    body: modalidad40TableData.slice(1),
    startY: 40,
    theme: 'grid',
    styles: {
      fontSize: 10,
      lineWidth: 0.2,
      lineColor: [8, 47, 73],
      cellPadding: 3,
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
    columnStyles: {
      2: { 
        fillColor: [241, 240, 240] 
      }, 
    }
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
      { content: `${formatCurrency(costoMensual)}`, styles: { fontStyle: 'bold' } }, 
      `${formatCurrency(gastoAnualizado)}`
    ])

    totalGastoAnualizado += gastoAnualizado
    remainingMonths -= meses
  }

  costsTableData.push([
    { content: '', styles: { fillColor: [8, 47, 73] } }, 
    { content: '', styles: { fillColor: [8, 47, 73] } }, 
    { content: '', styles: { fillColor: [8, 47, 73] } }, 
    { content: 'Inversión total', styles: { fontStyle: 'bold', fillColor: [8, 47, 73], textColor: [255, 255, 255] } }, 
    { content: `${formatCurrency(totalGastoAnualizado)}`, styles: { fontStyle: 'bold', fillColor: [8, 47, 73], textColor: [255, 255, 255] } }
  ])
  
  doc.autoTable({
    head: [costsTableData[0]],
    body: costsTableData.slice(1),
    startY: doc.lastAutoTable.finalY + 10,
    theme: 'grid',
    styles: {
      fontSize: 10,
      lineWidth: 0.2,
      lineColor: [8, 47, 73],
      cellPadding: 3,
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
    columnStyles: {
      3: { 
        fillColor: [241, 240, 240] 
      }, 
    }
  })

  const bottomRectY = doc.internal.pageSize.height - lineHeight

  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.text('Consideraciones:', 15, bottomRectY - 42)

  doc.setFont("helvetica", "normal")
  doc.text('• La Modalidad 40 permite continuar cotizando de manera voluntaria para incrementar las semanas cotizadas.', 15, bottomRectY - 35)
  doc.text('• Para acceder a la Modalidad 40, el asegurado debe estar dado de baja del régimen obligatorio.', 15, bottomRectY - 30)
  doc.text('• La decisión de inscribirse en la Modalidad 40 debe evaluarse cuidadosamente según cada caso particular.', 15, bottomRectY - 25)
  doc.text('• Los costos presentados son aproximados y pueden cambiar según las actualizaciones del IMSS.', 15, bottomRectY -20)
  doc.text('• El registro en la Modalidad 40 se realiza únicamente en ventanilla de la Subdelegación del IMSS.', 15, bottomRectY - 15)
  doc.text('• El pago mensual debe efectuarse en ventanilla bancaria con los datos proporcionados por el IMSS.', 15, bottomRectY - 10)
  doc.text('• La Modalidad 40 no otorga derecho a servicios médicos.', 15, bottomRectY - 5)

  addFooter(doc)
}

const generateSocialRightsPage = (doc) => {
  doc.addPage()
  addHeader(doc, 'Derechos de Seguridad Social')
  doc.text(`como trabajador`, doc.internal.pageSize.width / 2, 26, { align: 'center' })
  
  const socialRightsTable = [
    [' ', 'Derechos', 'LSS73', 'LSS97'],
    [{ content: 'Dinero', rowSpan: 13 }, 'Pensión por riesgos de trabajo', 'X', 'X'],
    ['Pensión por invalidez y vida', 'X', 'X'],
    ['Pensión por cesantía en edad avanzada', 'X', 'X'],
    ['Pensión por vejez', 'X', 'X'],
    ['Retiro anticipado', '', 'X'],
    ['Negativa de pensión', '', 'X'],
    ['Pensión garantizada', '', 'X'],
    ['Cuenta individual', 'X', 'X'],
    ['Ahorro voluntario', 'X', 'X'],
    ['Vivienda', 'X', 'X'],
    ['Ayuda por desempleo', 'X', 'X'],
    ['Ayuda para gastos de matrimonio', 'X', 'X'],
    ['Portabilidad', 'X', 'X'],
    [{ content: 'Especie', rowSpan: 5}, 'Asistencia médica', 'X', 'X'],
    ['Guarderías y prestaciones sociales', 'X', 'X'],
    ['Enfermedades y maternidad', 'X', 'X'],
    ['Ayuda para gastos de funeral', 'X', 'X'],
    ['Continuación voluntaria', 'X', 'X']
  ]
  
  doc.autoTable({
    head: [socialRightsTable[0]],
    body: socialRightsTable.slice(1),
    startY: 30,
    theme: 'grid',
    styles: {
      fontSize: 10,
      lineWidth: 0.2,
      lineColor: [8, 47, 73],
      cellPadding: 3, 
      valign: 'middle',
      halign: 'center',
      fontStyle: 'normal',
      textColor: [33, 53, 71],
      fillStyle: 'F',
      cellWidth: 'auto' 
    },
    headStyles: {
      fillColor: [8, 47, 73],
      fontStyle: 'bold',
      textColor: [255, 255, 255],
    },
    columnStyles: {
      0: { 
        halign: 'center', 
        fontStyle: 'bold', 
        fillColor: [241, 240, 240] 
      },
      1: { halign: 'center' }, 
      2: { 
        halign: 'center',
        fillColor: [241, 240, 240] 
      }, 
      3: { halign: 'center' }, 
    }
  })

  const bottomRectY = doc.internal.pageSize.height - lineHeight

  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120); 
  doc.text(
    '• LSS73: Ley del Seguro Social de 1973', 
    15, bottomRectY - 10
  )
  doc.text(
    '• LSS97: Ley del Seguro Social de 1997', 
    15, bottomRectY - 5
  )

  addFooter(doc)  
}

const generateDiagnosticTablePage = (doc) => {
  doc.addPage()
  addHeader(doc, 'Diagnóstico de Datos Personales')

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(
    'Antes de iniciar cualquier trámite de pensión asegúrate que tus datos personales están escritos correctamente.', 
    15, 30
  )
  doc.text(
    'A continuación, encontrarás una guía de los datos y las instituciones que debes validar:', 
    15, 35
  )

  const personalDataTable = [
    ['Datos Personales', 'Estado de cuenta AFORE', 'IFE', 'Infonavit', 'Renapo', 'IMSS*'],
    ['Nombre\ncomo aparece en acta de nacimiento.', 'X', 'X', 'X', 'X', 'X'],
    ['Fecha de nacimiento\ncomo aparece en acta de nacimiento.', '', '', 'X', 'X', 'X'],
    ['Número de Seguro Social\ncomo aparece en hoja rosa, Afil-02 o credencial ADIMSS.', 'X', '', '', 'X', 'X'],
    ['CURP\n18 posiciones como aparece en la cédula.', 'X', 'X', '', '', 'X'],
    ['RFC\n13 posiciones con homoclave, como aparece en la cédula fiscal.', 'X', '', 'X', '', 'X'],
    ['Semanas cotizadas\nun año equivale a 52 semanas.', '', '', '', '', 'X'],
    ['Domicilio\ncomo aparece en el recibo de agua, luz, teléfono, predial, etc.', 'X', 'X', '', '', '']
  ]

  doc.autoTable({
    head: [personalDataTable[0]],
    body: personalDataTable.slice(1),
    startY: 40,
    theme: 'grid',
    styles: {
      fontSize: 10,
      lineWidth: 0.2, 
      lineColor: [8, 47, 73],
      cellPadding: 4, 
      halign: 'center',
      valign: 'middle',
      fontStyle: 'normal',
      textColor: [33, 53, 71],
      fillStyle: 'F',
      cellWidth: 'auto'
    },
    headStyles: {
      fillColor: [8, 47, 73],
      fontStyle: 'bold',
      textColor: [255, 255, 255],
    },
    columnStyles: {
      0: { halign: 'left', fontStyle: 'bold', cellWidth: 73 }, 
      1: { fillColor: [241, 240, 240] }, 
      2: { fillColor: [255, 255, 255] }, 
      3: { fillColor: [241, 240, 240] }, 
      4: { fillColor: [255, 255, 255] }, 
      5: { fillColor: [241, 240, 240] }, 
    }
  })  
  
  const bottomRectY = doc.internal.pageSize.height - lineHeight

  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120); 
  doc.text(
    '* Documento IMSS: Hoja rosa, Credencial ADIMSS o algún documento emitido por el IMSS.', 
    15, bottomRectY - 10
  )
  doc.text(
    '• En caso de presentarse algún error, deberás acudir a la Institución correspondiente y solicitar la corrección.', 
    15, bottomRectY - 5
  )
  
  addFooter(doc)
}

const generateRequirementsPage = (doc) => {
  doc.addPage()
  addHeader(doc, 'Requisitos (1 de 2)')

  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text('Requisitos para la pensión bajo la LSS 1973:', 15, 30)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)

  const requirements = [
    '• Tener al menos 60 años (cesantía) o 65 años (vejez).',
    '• Haber estado asegurado antes del 30 de junio de 1997.',
    '• Contar con al menos 500 semanas cotizadas.',
    '• No estar trabajando al momento de la solicitud.',
    '• Estar vigente en derechos o dentro del periodo de conservación.'
  ]

  let y = 37
  requirements.forEach(req => {
    doc.text(req, 15, y)
    y += 6
  })

  y += 5

  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text('Checklist de documentos:', 15, y)

  const documents = [
    [{ content: 'Copia simple para integrar el expediente y el original o copia certificada para su cotejo', colSpan: 2, styles: { fillColor: [8, 47, 73], textColor: [255, 255, 255] } }],
    ['Identificación oficial:', 'INE, Pasaporte, Cartilla, Credencial ADIMSS.'],
    ['Comprobante de domicilio:', 'Predial, Teléfono, Agua, Luz, Gas.'],
    ['Documento bancario:', 'Estado de cuenta con número de cuenta y CLABE para pago de pensión.'],
    [{ content: 'Original o copia certificada que permanecerá en el expediente.', colSpan: 2, styles: { fillColor: [8, 47, 73], textColor: [255, 255, 255] } }],
    ['Acta de nacimiento:', 'Certificada o impresa en línea del Registro Civil.']
  ]

  doc.autoTable({
    head: [['Documento', 'Ejemplos']],
    body: documents,
    startY: y + 5,
    theme: 'grid',
    
    styles: {
      cellPadding: 4,
      valign: 'middle',
      fontSize: 10,
      textColor: [33, 53, 71],
      fillColor: [255, 255, 255]
    },
    headStyles: {
      fillColor: [241, 240, 240],
      textColor: [33, 53, 71],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { fontStyle: 'bold', fillColor: [241, 240, 240] }
    }
  })

  const bottomRectY = doc.internal.pageSize.height - lineHeight

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10)
  doc.setTextColor(120, 120, 120); 
  doc.text(
    '* El trámite podrán presentarse en la ventanilla del Control de Prestaciones Económicas en la Unidad de Medicina ', 
    15, bottomRectY - 10
  )
  doc.text(
    '  Familiar de adscripción que le corresponda dentro del horario de 8:00 a 15:00 horas.', 
    15, bottomRectY - 5
  )

  addFooter(doc)
}

const generateFamilyAllowancesPage = (doc) => {
  doc.addPage()
  addHeader(doc, 'Requisitos (2 de 2)')

  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text('Asignaciones Familiares:', 15, 30)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(
    'Consisten en una ayuda por concepto de carga familiar, que se concede a los beneficiarios del pensionado.',
    15, 37, { maxWidth: 180 }
  )
  doc.text(
    'El solicitante de la pensión indicará si tiene beneficiarios para el otorgamiento de asignaciones familiares',
    15, 42, { maxWidth: 180 }
  )

  const beneficiaries = [
    [{ content: 'Copia simple para integrar el expediente y el original o copia certificada para su cotejo', colSpan: 2, styles: { fillColor: [8, 47, 73], textColor: [255, 255, 255] } }],
    ['Identificación oficial:', 'INE, Pasaporte, Cartilla, Credencial ADIMSS. En menores de edad: Credencial ADIMSS, Certificado o Constancia de estudios con fotografía.'],
    ['Comprobante de domicilio:', 'Predial, Teléfono, Agua, Luz, Gas.'],
    [{ content: 'Original o copia certificada que permanecerá en el expediente.', colSpan: 2, styles: { fillColor: [8, 47, 73], textColor: [255, 255, 255] } }],
    ['Acta de nacimiento:', 'Certificada o impresa en línea del Registro Civil.'],
    [{ content: 'Documentos adicionales en original o copia certificada que permanecerá en el expediente.', colSpan: 2, styles: { fillColor: [8, 47, 73], textColor: [255, 255, 255] } }],
    ['Esposa(o):', 'Acta de matrimonio.'],
    ['Concubina(rio):', 'Resolución de acreditación de concubinato (mínimo 5 años o hijos en común).'],
    ['Hijo menor de 16 años:', 'No se requiere documento adicional.'],
    ['Hijo de 16 a 25 años estudiante:', 'Constancia de estudios.'],
    ['Hijo mayor de 16 años incapacitado:', 'Dictamen ST-6 del IMSS.'],
    ['Ascendiente:', 'Resolución que acredite dependencia económica.']
  ]

  doc.autoTable({
    head: [['Documento', 'Ejemplos']],
    body: beneficiaries,
    startY: 47,
    theme: 'grid',
    styles: {
      cellPadding: 3,
      valign: 'middle',
      fontSize: 10,
      textColor: [33, 53, 71],
      fillColor: [255, 255, 255]
    },
    headStyles: {
      fillColor: [241, 240, 240],
      textColor: [33, 53, 71],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { fontStyle: 'bold', fillColor: [241, 240, 240] }
    }
  })

  addFooter(doc)
}

const generatePDF = (results) => {
  if (!results) return

  const doc = initializePDF()
  generateFirstPage(doc, results)

  if (results.salaryModalidad40) {
    generateModalidad40Page(doc, results)
  }

  generateSocialRightsPage(doc)
  generateDiagnosticTablePage(doc)
  generateRequirementsPage(doc)
  generateFamilyAllowancesPage(doc)
  
  doc.save('proyeccion_pension.pdf')
}

export default generatePDF