import { MedicionGlucosa, Estadisticas, PerfilUsuario } from '../types';
import { subDays } from 'date-fns';

// Metas de control para diabetes tipo 2 (ADA Guidelines)
export const METAS_DIABETES_TIPO2 = {
  ayunas: { min: 80, max: 130 },
  postprandial: { min: 80, max: 180 },
  general: { min: 80, max: 180 }
};

// Evaluar nivel de glucosa para diabetes tipo 2
export const evaluarGlucosaDiabetesTipo2 = (valor: number, tipo: string) => {
  let metas = METAS_DIABETES_TIPO2.general;
  
  if (tipo === 'ayunas') {
    metas = METAS_DIABETES_TIPO2.ayunas;
  } else if (tipo === 'postprandial') {
    metas = METAS_DIABETES_TIPO2.postprandial;
  }

  if (valor < 70) {
    return { nivel: 'Baja', color: '#e74c3c', descripcion: 'Hipoglucemia - Requiere atención inmediata' };
  } else if (valor >= metas.min && valor <= metas.max) {
    return { nivel: 'En Rango', color: '#27ae60', descripcion: 'Valor dentro del rango objetivo' };
  } else if (valor > metas.max && valor <= 250) {
    return { nivel: 'Elevada', color: '#f39c12', descripcion: 'Valor por encima del objetivo' };
  } else {
    return { nivel: 'Muy Elevada', color: '#e74c3c', descripcion: 'Valor muy alto - Consultar médico' };
  }
};

// Calcular IMC
export const calcularIMC = (peso: number, estatura: number): number => {
  const estaturaMetros = estatura / 100;
  return peso / (estaturaMetros * estaturaMetros);
};

// Evaluar IMC
export const evaluarIMC = (imc: number) => {
  if (imc < 18.5) {
    return { categoria: 'Bajo Peso', color: '#3498db' };
  } else if (imc >= 18.5 && imc < 25) {
    return { categoria: 'Normal', color: '#27ae60' };
  } else if (imc >= 25 && imc < 30) {
    return { categoria: 'Sobrepeso', color: '#f39c12' };
  } else {
    return { categoria: 'Obesidad', color: '#e74c3c' };
  }
};

// Evaluar presión arterial
export const evaluarPresion = (sistolica: number, diastolica: number) => {
  if (sistolica < 120 && diastolica < 80) {
    return { categoria: 'Normal', color: '#27ae60' };
  } else if (sistolica >= 120 && sistolica < 130 && diastolica < 80) {
    return { categoria: 'Elevada', color: '#f39c12' };
  } else if (sistolica >= 130 && sistolica < 140 || diastolica >= 80 && diastolica < 90) {
    return { categoria: 'Hipertensión Grado 1', color: '#e67e22' };
  } else if (sistolica >= 140 || diastolica >= 90) {
    return { categoria: 'Hipertensión Grado 2', color: '#e74c3c' };
  } else {
    return { categoria: 'Crisis Hipertensiva', color: '#c0392b' };
  }
};

// Calcular estadísticas para diabetes tipo 2
export const calcularEstadisticasDiabetesTipo2 = (
  mediciones: MedicionGlucosa[], 
  perfilUsuario?: PerfilUsuario
): Estadisticas => {
  if (mediciones.length === 0) {
    return {
      promedio: 0,
      maximo: 0,
      minimo: 0,
      totalMediciones: 0,
      medicionesUltimos7Dias: 0,
      medicionesUltimos30Dias: 0,
      promedioAyunas: 0,
      promedioPostprandial: 0,
      medicionesEnRango: 0,
      medicionesFueraRango: 0,
      porcentajeEnRango: 0,
      tendencia: 'estable',
      promedioMinutosEjercicio: 0,
      totalMinutosEjercicio: 0,
      diasConEjercicio: 0,
      pesoPromedio: 0,
      imcPromedio: 0,
      presionPromedio: { sistolica: 0, diastolica: 0 },
      cinturaPromedio: 0,
      caderaPromedio: 0,
      indiceCinturaCadera: 0
    };
  }

  const valores = mediciones.map(m => m.valor);
  const promedio = valores.reduce((sum, valor) => sum + valor, 0) / valores.length;
  const maximo = Math.max(...valores);
  const minimo = Math.min(...valores);

  const hoy = new Date();
  const hace7Dias = subDays(hoy, 7);
  const hace30Dias = subDays(hoy, 30);

  const medicionesUltimos7Dias = mediciones.filter(m => m.fecha >= hace7Dias).length;
  const medicionesUltimos30Dias = mediciones.filter(m => m.fecha >= hace30Dias).length;

  // Calcular promedios por tipo
  const medicionesAyunas = mediciones.filter(m => m.tipo === 'ayunas');
  const medicionesPostprandial = mediciones.filter(m => m.tipo === 'postprandial');
  
  const promedioAyunas = medicionesAyunas.length > 0 
    ? medicionesAyunas.reduce((sum, m) => sum + m.valor, 0) / medicionesAyunas.length 
    : 0;
  
  const promedioPostprandial = medicionesPostprandial.length > 0 
    ? medicionesPostprandial.reduce((sum, m) => sum + m.valor, 0) / medicionesPostprandial.length 
    : 0;

  // Calcular mediciones en rango (80-180 mg/dL para diabetes tipo 2)
  const medicionesEnRango = mediciones.filter(m => m.valor >= 80 && m.valor <= 180).length;
  const medicionesFueraRango = mediciones.length - medicionesEnRango;
  const porcentajeEnRango = mediciones.length > 0 ? (medicionesEnRango / mediciones.length) * 100 : 0;

  // Calcular tendencia (simplificado)
  const tendencia = 'estable';

  // Calcular estadísticas de ejercicio
  const medicionesConEjercicio = mediciones.filter(m => m.ejercicio);
  const promedioMinutosEjercicio = medicionesConEjercicio.length > 0 
    ? medicionesConEjercicio.reduce((sum, m) => sum + (m.minutosEjercicio || 0), 0) / medicionesConEjercicio.length 
    : 0;
  const totalMinutosEjercicio = medicionesConEjercicio.reduce((sum, m) => sum + (m.minutosEjercicio || 0), 0);
  const diasConEjercicio = medicionesConEjercicio.length;

  // Calcular promedios de peso, IMC, presión arterial
  const medicionesConPeso = mediciones.filter(m => m.peso);
  const pesoPromedio = medicionesConPeso.length > 0 
    ? medicionesConPeso.reduce((sum, m) => sum + (m.peso || 0), 0) / medicionesConPeso.length 
    : 0;

  const medicionesConPresion = mediciones.filter(m => m.presionSistolica && m.presionDiastolica);
  const presionSistolicaPromedio = medicionesConPresion.length > 0 
    ? medicionesConPresion.reduce((sum, m) => sum + (m.presionSistolica || 0), 0) / medicionesConPresion.length 
    : 0;
  const presionDiastolicaPromedio = medicionesConPresion.length > 0 
    ? medicionesConPresion.reduce((sum, m) => sum + (m.presionDiastolica || 0), 0) / medicionesConPresion.length 
    : 0;

  // IMC promedio (requiere estatura del usuario)
  let imcPromedio = 0;
  if (perfilUsuario && perfilUsuario.estatura && pesoPromedio > 0) {
    imcPromedio = calcularIMC(pesoPromedio, perfilUsuario.estatura);
  }

  // Medidas corporales
  const medicionesConCintura = mediciones.filter(m => m.cintura);
  const cinturaPromedio = medicionesConCintura.length > 0 
    ? medicionesConCintura.reduce((sum, m) => sum + (m.cintura || 0), 0) / medicionesConCintura.length 
    : 0;

  const medicionesConCadera = mediciones.filter(m => m.cadera);
  const caderaPromedio = medicionesConCadera.length > 0 
    ? medicionesConCadera.reduce((sum, m) => sum + (m.cadera || 0), 0) / medicionesConCadera.length 
    : 0;

  const indiceCinturaCadera = caderaPromedio > 0 ? cinturaPromedio / caderaPromedio : 0;

  return {
    promedio: Math.round(promedio * 10) / 10,
    maximo,
    minimo,
    totalMediciones: mediciones.length,
    medicionesUltimos7Dias,
    medicionesUltimos30Dias,
    promedioAyunas: Math.round(promedioAyunas * 10) / 10,
    promedioPostprandial: Math.round(promedioPostprandial * 10) / 10,
    medicionesEnRango,
    medicionesFueraRango,
    porcentajeEnRango: Math.round(porcentajeEnRango * 10) / 10,
    tendencia,
    promedioMinutosEjercicio: Math.round(promedioMinutosEjercicio * 10) / 10,
    totalMinutosEjercicio,
    diasConEjercicio,
    pesoPromedio: Math.round(pesoPromedio * 10) / 10,
    imcPromedio: Math.round(imcPromedio * 10) / 10,
    presionPromedio: { 
      sistolica: Math.round(presionSistolicaPromedio), 
      diastolica: Math.round(presionDiastolicaPromedio) 
    },
    cinturaPromedio: Math.round(cinturaPromedio * 10) / 10,
    caderaPromedio: Math.round(caderaPromedio * 10) / 10,
    indiceCinturaCadera: Math.round(indiceCinturaCadera * 100) / 100
  };
};

// Generar recomendaciones personalizadas
export const generarRecomendaciones = (
  mediciones: MedicionGlucosa[], 
  perfilUsuario?: PerfilUsuario
): string[] => {
  const recomendaciones: string[] = [];
  const estadisticas = calcularEstadisticasDiabetesTipo2(mediciones, perfilUsuario);

  // Recomendaciones basadas en glucosa
  if (estadisticas.promedioAyunas > METAS_DIABETES_TIPO2.ayunas.max) {
    recomendaciones.push('Tu glucosa en ayunas está elevada. Considera ajustar tu medicación o dieta.');
  }

  if (estadisticas.promedioPostprandial > METAS_DIABETES_TIPO2.postprandial.max) {
    recomendaciones.push('Tu glucosa postprandial está alta. Revisa tu alimentación y horarios de comida.');
  }

  if (estadisticas.porcentajeEnRango < 70) {
    recomendaciones.push('Menos del 70% de tus mediciones están en rango. Consulta con tu médico.');
  }

  // Recomendaciones basadas en ejercicio
  if (estadisticas.promedioMinutosEjercicio < 30) {
    recomendaciones.push('Aumenta tu actividad física. Intenta hacer al menos 30 minutos de ejercicio diario.');
  }

  // Recomendaciones basadas en peso
  if (estadisticas.imcPromedio > 25) {
    recomendaciones.push('Tu IMC indica sobrepeso. Considera trabajar con un nutricionista para mejorar tu dieta.');
  }

  // Recomendaciones basadas en presión arterial
  if (estadisticas.presionPromedio && estadisticas.presionPromedio.sistolica > 130) {
    recomendaciones.push('Tu presión arterial sistólica está elevada. Reduce el consumo de sal y consulta a tu médico.');
  }

  // Recomendación general si no hay otras específicas
  if (recomendaciones.length === 0) {
    recomendaciones.push('¡Excelente! Tu control está en buen rango. Mantén tus hábitos saludables.');
  }

  return recomendaciones;
}; 