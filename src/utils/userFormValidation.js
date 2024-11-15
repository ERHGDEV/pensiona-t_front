import { SEMANAS_MINIMAS, SEMANAS_MAXIMAS, EDAD_MINIMA, EDAD_MAXIMA } from "../constants/calculateData";

export const validateInputs = ( formData, setErrors, SALARIO_MINIMO, UMA ) => {
    const newErrors = {}
    const { salarioPromedio, semanasCotizadas, edad } = formData
    const salarioMensual = parseFloat(salarioPromedio)
    const semanas = parseInt(semanasCotizadas)
    const edadActual = parseInt(edad)

    const SALARIO_MINIMO_MENSUAL = SALARIO_MINIMO * 30.4
    const SALARIO_MAXIMO_MENSUAL = UMA * 25 * 30.4

    if (isNaN(salarioMensual) || salarioMensual < SALARIO_MINIMO_MENSUAL || salarioMensual > SALARIO_MAXIMO_MENSUAL) {
      newErrors.salarioPromedio = `El salario mensual debe estar entre $${SALARIO_MINIMO_MENSUAL.toFixed(2)} y $${SALARIO_MAXIMO_MENSUAL.toFixed(2)} pesos.`
    }

    if (edadActual < EDAD_MINIMA || edadActual > EDAD_MAXIMA) {
      newErrors.edad = `La edad debe estar entre ${EDAD_MINIMA} y ${EDAD_MAXIMA} años.`
    }

    let semanasRequeridas = semanas
    if (edadActual < 60) {
      semanasRequeridas += (60 - edadActual) * 52
    }

    if (semanasRequeridas < SEMANAS_MINIMAS || semanasRequeridas > SEMANAS_MAXIMAS) {
      if (edadActual < 60) {
        newErrors.semanasCotizadas = `Con su edad actual, necesitaría entre ${Math.max(SEMANAS_MINIMAS - (60 - edadActual) * 52, 0)} y ${SEMANAS_MAXIMAS - (60 - edadActual) * 52} semanas cotizadas.`
      } else {
        newErrors.semanasCotizadas = `Las semanas cotizadas deben estar entre ${SEMANAS_MINIMAS} y ${SEMANAS_MAXIMAS}.`
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }