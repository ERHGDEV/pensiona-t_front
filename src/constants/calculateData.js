const SEMANAS_MINIMAS = 500
const SEMANAS_MAXIMAS = 2600
const EDAD_MINIMA = 43
const EDAD_MAXIMA = 75

const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
]

const PERCENTAGES = {
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

const PERCENTAGES_PENSION = [
  { age: 60, percentage: 0.75 },
  { age: 61, percentage: 0.80 },
  { age: 62, percentage: 0.85 },
  { age: 63, percentage: 0.90 },
  { age: 64, percentage: 0.95 },
  { age: 65, percentage: 1.00 },
]

const TABULADOR = [
  { min: 1.00, max: 1.25, cuantiaBasica: 80.000, incrementoAnual: 0.563 },
  { min: 1.26, max: 1.5, cuantiaBasica: 77.110, incrementoAnual: 0.814 },
  { min: 1.51, max: 1.75, cuantiaBasica: 58.180, incrementoAnual: 1.178 },
  { min: 1.76, max: 2, cuantiaBasica: 49.230, incrementoAnual: 1.430 },
  { min: 2.01, max: 2.25, cuantiaBasica: 42.670, incrementoAnual: 1.615 },
  { min: 2.26, max: 2.5, cuantiaBasica: 37.650, incrementoAnual: 1.756 },
  { min: 2.51, max: 2.75, cuantiaBasica: 33.680, incrementoAnual: 1.868 },
  { min: 2.76, max: 3, cuantiaBasica: 30.480, incrementoAnual: 1.958 },
  { min: 3.01, max: 3.25, cuantiaBasica: 27.830, incrementoAnual: 2.033 },
  { min: 3.26, max: 3.5, cuantiaBasica: 25.600, incrementoAnual: 2.096 },
  { min: 3.51, max: 3.75, cuantiaBasica: 23.700, incrementoAnual: 2.149 },
  { min: 3.75, max: 4, cuantiaBasica: 22.070, incrementoAnual: 2.195 },
  { min: 4.01, max: 4.25, cuantiaBasica: 20.650, incrementoAnual: 2.235 },
  { min: 4.26, max: 4.5, cuantiaBasica: 19.390, incrementoAnual: 2.271 },
  { min: 4.51, max: 4.75, cuantiaBasica: 18.290, incrementoAnual: 2.302 },
  { min: 4.76, max: 5, cuantiaBasica: 17.300, incrementoAnual: 2.330 },
  { min: 5.01, max: 5.25, cuantiaBasica: 16.410, incrementoAnual: 2.355 },
  { min: 5.26, max: 5.5, cuantiaBasica: 15.610, incrementoAnual: 2.377 },
  { min: 5.51, max: 5.75, cuantiaBasica: 14.880, incrementoAnual: 2.398 },
  { min: 5.76, max: 6, cuantiaBasica: 14.220, incrementoAnual: 2.416 },
  { min: 6.01, max: 6.01, cuantiaBasica: 13.620, incrementoAnual: 2.433 },
  { min: 6.02, max: Infinity, cuantiaBasica: 13.000, incrementoAnual: 2.450 }
]

export {
    SEMANAS_MINIMAS,
    SEMANAS_MAXIMAS,
    EDAD_MINIMA,
    EDAD_MAXIMA,
    MONTHS,
    PERCENTAGES,
    PERCENTAGES_PENSION,
    TABULADOR
}
    