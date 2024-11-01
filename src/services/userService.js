import axiosInstance from "./axiosConfig"

export const getValues = async () => {
    try {
      const response = await axiosInstance.get("/values")
      if (!response.data.salarioMinimo || !response.data.uma) {
        throw new Error('No se pudieron obtener los valores actualizados de salario mínimo y UMA')
      }
      return {
        SALARIO_MINIMO: response.data.salarioMinimo,
        UMA: response.data.uma
      }
    } catch (error) {
      console.error('Error:', error)
      throw new Error('Error al obtener los valores actualizados')
    }
  }