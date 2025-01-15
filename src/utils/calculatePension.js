import { TABULADOR, SEMANAS_MINIMAS, PERCENTAGES_PENSION } from "../constants/calculateData"

const calculateWeeksWithModalidad40 = (startMonth, startYear, modalidad40Years) => {
  const currentDate = new Date();
  const monthsUntilStart = (startYear - currentDate.getFullYear()) * 12 + (startMonth - (currentDate.getMonth() + 1));
  const weeksUntilStart = Math.max(0, Math.round(monthsUntilStart * 52 / 12));
  return weeksUntilStart + modalidad40Years * 52;
}

const calculatePension = (
  averageSalary,
  totalWeeks,
  maritalStatus,
  children,
  salarioMinimo
) => {
  const monthlySalary = parseFloat(averageSalary)
  const dailySalary = monthlySalary / 30.4
  const salaryInVSM = dailySalary / salarioMinimo

  const range = TABULADOR.find(
    (r) => salaryInVSM >= r.min && salaryInVSM <= r.max
  )

  const basicAmount = (range.cuantiaBasica / 100) * monthlySalary
  const exceedingWeeks = Math.max(0, totalWeeks - SEMANAS_MINIMAS)
  const exceedingYears = Math.floor(exceedingWeeks / 52)
  const annualIncrement =
    exceedingYears * (range.incrementoAnual / 100) * monthlySalary

  const totalBasicAmount = basicAmount + annualIncrement

  const spouseAllowance =
    maritalStatus === "married" ? totalBasicAmount * 0.15 : 0
  const childrenAllowance =
    children === "1"
      ? totalBasicAmount * 0.10
      : children === "2"
      ? totalBasicAmount * 0.20
      : 0
  const assistanceAllowance = totalBasicAmount * 0.15

  const totalPensionableAmount =
    totalBasicAmount + spouseAllowance + childrenAllowance + assistanceAllowance

  const pensionByAge = PERCENTAGES_PENSION.map((p) => {
    let pension = totalPensionableAmount * p.percentage
    pension = Math.max(pension, salarioMinimo * 30.4)
    pension = Math.min(pension, monthlySalary)

    return {
      age: p.age,
      percentage: p.percentage * 100,
      pension: pension,
    }
  })

  return {
    salarioPromedio: monthlySalary,
    semanasTotales: totalWeeks,
    porcentajeCuantia: range.cuantiaBasica,
    cuantiaBasica: basicAmount,
    semanasExcedentes: exceedingWeeks,
    aniosExcedentes: exceedingYears,
    porcentajeIncremento: range.incrementoAnual,
    incremento: annualIncrement,
    sumaCuantiaIncrementos: totalBasicAmount,
    asignacionEsposa: spouseAllowance,
    asignacionHijos: childrenAllowance,
    ayudaAsistencial: assistanceAllowance,
    totalCuantiaBasica: totalPensionableAmount,
    pensionPorEdad: pensionByAge,
  }
}

export const calculateAll = (data, salarioMinimo) => {
  const {
    averageSalary,
    weeksContributed,
    age,
    maritalStatus,
    children,
    modalidad40,
    salaryModalidad40,
    startMonth,
    startYear,
    yearsModalidad40,
  } = data;

  const baseWeeks = parseInt(weeksContributed, 10)
  const currentAge = parseInt(age, 10)

  // Cálculo normal
  let totalWeeksNormal = baseWeeks
  if (currentAge < 60) {
    totalWeeksNormal += (60 - currentAge) * 52
  }
  const resultsNormal = calculatePension(
    averageSalary,
    totalWeeksNormal,
    maritalStatus,
    children,
    salarioMinimo
  )

  const normalResults = { ...resultsNormal }

  // Si no aplica Modalidad 40, retornar solo el cálculo normal
  if (!modalidad40) {
    return { normalResults }
  }

  // Cálculo con Modalidad 40
  const modalidad40Weeks = calculateWeeksWithModalidad40(
    parseInt(startMonth, 10),
    parseInt(startYear, 10),
    parseInt(yearsModalidad40, 10)
  )
  const totalWeeksModalidad40 = baseWeeks + modalidad40Weeks

  const averageSalaryModalidad40 =
    (parseFloat(averageSalary) * (5 - yearsModalidad40) +
      parseFloat(salaryModalidad40) * yearsModalidad40) /
    5

  const resultsModalidad40 = calculatePension(
    averageSalaryModalidad40,
    totalWeeksModalidad40,
    maritalStatus,
    children,
    salarioMinimo
  )

  const modalidad40Results = { 
    pensionModalidad40 : {...resultsModalidad40.pensionPorEdad}
  }
  modalidad40Results.salarioPromedioModalidad40 = averageSalaryModalidad40
  
  return {normalResults, modalidad40Results}
}
