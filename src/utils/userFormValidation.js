import { SEMANAS_MINIMAS, SEMANAS_MAXIMAS, EDAD_MINIMA, EDAD_MAXIMA } from "../constants/calculateData"

export const validateInputs = (formData, setErrors, salarioMinimo, uma) => {
  const newErrors = {}
  const {
    averageSalary,
    weeksContributed,
    age,
    modalidad40,
    salaryModalidad40,
    yearsModalidad40,
  } = formData

  const salarioPromedio = parseFloat(averageSalary)
  const semanasCotizadas = parseInt(weeksContributed, 10)
  const edadActual = parseInt(age, 10)
  const maxSalario = 25 * uma * 30.4 // Salario máximo mensual basado en UMA
  const salarioMinimoMensual = salarioMinimo * 30.4

  // Validar salario promedio
  if (isNaN(salarioPromedio) || salarioPromedio < salarioMinimoMensual || salarioPromedio > maxSalario) {
    newErrors.averageSalary = `Debe estar entre $${salarioMinimoMensual.toFixed(2)} y $${maxSalario.toFixed(2)}`
  }

  // Calcular semanas requeridas en función de la edad
  let semanasRequeridas = semanasCotizadas
  if (edadActual < 60) {
    semanasRequeridas += (60 - edadActual) * 52
  }

  if (
    isNaN(semanasCotizadas) ||
    semanasRequeridas < SEMANAS_MINIMAS ||
    semanasRequeridas > SEMANAS_MAXIMAS
  ) {
    if (edadActual < 60) {
      newErrors.weeksContributed = `Necesitarías entre ${Math.max(
        SEMANAS_MINIMAS - (60 - edadActual) * 52,
        0
      )} y ${
        SEMANAS_MAXIMAS - (60 - edadActual) * 52
      } semanas cotizadas.`
    } else {
      newErrors.weeksContributed = `Debe estar entre ${SEMANAS_MINIMAS} y ${SEMANAS_MAXIMAS}.`
    }
  }

  // Validar edad
  if (isNaN(edadActual) || edadActual < EDAD_MINIMA || edadActual > EDAD_MAXIMA) {
    newErrors.age = `Debe estar entre ${EDAD_MINIMA} y ${EDAD_MAXIMA}.`
  }

  // Validar modalidad 40 si está seleccionada
  if (modalidad40) {
    const salarioM40 = parseFloat(salaryModalidad40)
    const añosM40 = parseInt(yearsModalidad40, 10)

    if (isNaN(salarioM40)) {
      newErrors.salaryModalidad40 = `Captura el salario de Modalidad 40.`
    } else if (salarioM40 < salarioPromedio) {
      newErrors.salaryModalidad40 = "Debe ser mayor o igual al último salario."
    } else if (salarioM40 > maxSalario) {
      newErrors.salaryModalidad40 = `No puede ser mayor a $${maxSalario.toFixed(2)}.`
    }

    if (isNaN(añosM40) || añosM40 < 1 || añosM40 > 5) {
      newErrors.yearsModalidad40 = `Los años de modalidad 40 deben estar entre 1 y 5.`
    }
  }

  // Establecer errores si hay alguno
  setErrors(newErrors)

  // Retornar true si no hay errores
  return Object.keys(newErrors).length === 0
}