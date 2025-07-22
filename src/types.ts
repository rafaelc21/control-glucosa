export interface MedicionGlucosa {
  id: string;
  valor: number;
  fecha: Date;
  hora: string;
  tipo: 'ayunas' | 'postprandial' | 'antes_comida' | 'despues_comida' | 'otro';
  notas?: string;
  medicamento?: string;
  ejercicio?: boolean;
  minutosEjercicio?: number; // Nuevo: minutos de ejercicio
  sintomas?: string[];
  // Nuevos campos para control integral
  peso?: number; // en kg
  presionSistolica?: number; // mmHg
  presionDiastolica?: number; // mmHg
  cintura?: number; // en cm
  cadera?: number; // en cm
}

export interface PerfilUsuario {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: Date;
  edad: number; // Calculada automáticamente
  correo: string;
  estatura: number; // en cm
  peso: number; // en kg
  tiempoDiagnostico: number; // años con diabetes
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface Estadisticas {
  promedio: number;
  maximo: number;
  minimo: number;
  totalMediciones: number;
  medicionesUltimos7Dias: number;
  medicionesUltimos30Dias: number;
  // Estadísticas para diabetes tipo 2
  promedioAyunas: number;
  promedioPostprandial: number;
  medicionesEnRango: number;
  medicionesFueraRango: number;
  porcentajeEnRango: number;
  tendencia: 'mejorando' | 'estable' | 'empeorando';
  // Estadísticas de peso y presión
  pesoPromedio?: number;
  pesoMaximo?: number;
  pesoMinimo?: number;
  presionPromedio?: { sistolica: number; diastolica: number };
  imcPromedio?: number;
  // Estadísticas de cintura y cadera
  cinturaPromedio?: number;
  caderaPromedio?: number;
  indiceCinturaCadera?: number;
  // Estadísticas de ejercicio
  promedioMinutosEjercicio?: number;
  totalMinutosEjercicio?: number;
  diasConEjercicio?: number;
}

export interface MetaGlucosa {
  ayunas: { min: number; max: number };
  postprandial: { min: number; max: number };
  general: { min: number; max: number };
}

export interface Recordatorio {
  id: string;
  tipo: 'medicamento' | 'medicion' | 'ejercicio' | 'cita_medica';
  titulo: string;
  descripcion: string;
  hora: string;
  dias: string[]; // ['lunes', 'martes', etc.]
  activo: boolean;
}

export type TipoMedicion = 'ayunas' | 'postprandial' | 'antes_comida' | 'despues_comida' | 'otro'; 