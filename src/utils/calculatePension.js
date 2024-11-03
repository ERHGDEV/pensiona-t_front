import { TABULADOR, SEMANAS_MINIMAS } from '../constants/calculateData'

export const calcularPension = (salarioPromedio, semanasCotizadas, edad, estadoCivil, hijos, SALARIO_MINIMO) => {
    const salarioMensual = parseFloat(salarioPromedio)
    let semanasTotales = semanasCotizadas
    if (edad < 60) {
      semanasTotales += (60 - edad) * 52
    }

    const salarioDiario = salarioMensual / 30
    const salarioEnVSM = salarioDiario / SALARIO_MINIMO
  
    const rango = TABULADOR.find(r => salarioEnVSM >= r.min && salarioEnVSM <= r.max)
    
    const cuantiaBasica = (rango.cuantiaBasica / 100) * salarioMensual
    const semanasExcedentes = Math.max(0, semanasTotales - SEMANAS_MINIMAS)
    const aniosExcedentes = Math.floor(semanasExcedentes / 52)
    const incrementoAnual = aniosExcedentes * (rango.incrementoAnual / 100) * salarioMensual
  
    let sumaCuantiaIncrementos = cuantiaBasica + incrementoAnual
  
    const asignacionEsposa = estadoCivil === 'casado' ? sumaCuantiaIncrementos * 0.15 : 0
    const asignacionHijos = hijos === '1' ? sumaCuantiaIncrementos * 0.10 : (hijos === '2' ? sumaCuantiaIncrementos * 0.20 : 0)
    const ayudaAsistencial = sumaCuantiaIncrementos * 0.15
  
    const totalCuantiaBasica = sumaCuantiaIncrementos + asignacionEsposa + asignacionHijos + ayudaAsistencial
  
    const porcentajes = [
      { edad: 60, porcentaje: 0.75 },
      { edad: 61, porcentaje: 0.80 },
      { edad: 62, porcentaje: 0.85 },
      { edad: 63, porcentaje: 0.90 },
      { edad: 64, porcentaje: 0.95 },
      { edad: 65, porcentaje: 1.00 }
    ]
  
    const pensionPorEdad = porcentajes.map(p => {
      let pension = totalCuantiaBasica * p.porcentaje
      pension = Math.max(pension, SALARIO_MINIMO * 30)
      pension = Math.min(pension, salarioMensual)
  
      return {
        edad: p.edad,
        porcentaje: p.porcentaje * 100,
        pension: pension
      }
    })
  
    return {
      salarioPromedio: salarioMensual,
      semanasCotizadas,
      semanasTotales,
      edad: parseInt(edad),
      salarioMinimo: SALARIO_MINIMO,
      porcentajeCuantia: rango.cuantiaBasica,
      cuantiaBasica,
      semanasExcedentes,
      aniosExcedentes,
      porcentajeIncremento: rango.incrementoAnual,
      incremento: incrementoAnual,
      sumaCuantiaIncrementos,
      asignacionEsposa,
      asignacionHijos,
      ayudaAsistencial,
      totalCuantiaBasica,
      pensionPorEdad
    }
  }