export const formatFeature = (feature, planTitle) => {
    let formattedFeature = feature
  
    // Negrita para "Análisis de semanas cotizadas:" en Pro y Unlimited
    if (planTitle === 'Pro' || planTitle === 'Unlimited') {
      formattedFeature = formattedFeature.replace(/(Análisis de semanas cotizadas:)/g, (match) => `<strong>${match}</strong>`)
    }
  
    // Negrita para "Ilimitado" y "Consulta masiva de Afore:" en Unlimited
    if (planTitle === 'Unlimited' || planTitle === 'Free' || planTitle === 'Pro') {
      formattedFeature = formattedFeature.replace(/(Ilimitado|Consulta masiva de Afore:)/g, (match) => `<strong>${match}</strong>`)
    }
  
    // Negrita para "1/día", "5/día", "10/día" en Free y Pro
    if (planTitle === 'Free' || planTitle === 'Pro') {
      formattedFeature = formattedFeature.replace(/(\d+\/día)/g, (match) => `<strong>${match}</strong>`)
    }
  
    return formattedFeature
}  