import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Help as HelpIcon,
  MonitorHeart as MonitorHeartIcon,
  FitnessCenter as FitnessCenterIcon,
  Straighten as StraightenIcon
} from '@mui/icons-material';
import { MedicionGlucosa, PerfilUsuario } from '../types';
import { calcularEstadisticasDiabetesTipo2, METAS_DIABETES_TIPO2 } from '../utils/diabetesUtils';

interface EstadisticasResumenProps {
  mediciones: MedicionGlucosa[];
  perfilUsuario?: PerfilUsuario | null;
}

const TitleWithTooltip: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
    <Typography variant="h6" sx={{ fontWeight: 600 }}>
      {title}
    </Typography>
    <Tooltip title={description} arrow>
      <IconButton size="small" sx={{ p: 0 }}>
        <HelpIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
      </IconButton>
    </Tooltip>
  </Box>
);

const EstadisticasResumen: React.FC<EstadisticasResumenProps> = ({ mediciones, perfilUsuario }) => {
  const estadisticas = calcularEstadisticasDiabetesTipo2(mediciones, perfilUsuario || undefined);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Resumen de Actividad
        </Typography>

        {/* Metas de Control y Tendencia */}
        <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2, border: 'none' }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            Metas de Control - Diabetes Tipo 2
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              label={`En ayunas: ${METAS_DIABETES_TIPO2.ayunas.min}-${METAS_DIABETES_TIPO2.ayunas.max} mg/dL`}
              color="primary"
              variant="outlined"
              size="small"
            />
            <Chip
              label={`Postprandial: ${METAS_DIABETES_TIPO2.postprandial.min}-${METAS_DIABETES_TIPO2.postprandial.max} mg/dL`}
              color="secondary"
              variant="outlined"
              size="small"
            />
          </Box>
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Tendencia: Estable
          </Typography>
        </Box>

        {/* Control de Glucosa */}
        <Box sx={{ mb: 3 }}>
          <TitleWithTooltip
            title="Control de Glucosa"
            description="Estadísticas de tus niveles de glucosa en sangre. Los rangos objetivo son 80-130 mg/dL en ayunas y 80-180 mg/dL postprandial."
          />
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f0f9ff', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#0369a1' }}>
                  {estadisticas.promedio}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Promedio General
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f0fdf4', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#16a34a' }}>
                  {estadisticas.promedioAyunas}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  En Ayunas
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fef3c7', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#d97706' }}>
                  {estadisticas.promedioPostprandial}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Postprandial
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fef2f2', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#dc2626' }}>
                  {estadisticas.porcentajeEnRango}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  En Rango
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Peso, Presión Arterial y Ejercicio */}
        <Box sx={{ mb: 3 }}>
          <TitleWithTooltip
            title="Peso, Presión Arterial y Ejercicio"
            description="Estadísticas de peso, presión arterial y actividad física. El ejercicio regular ayuda a controlar la glucosa."
          />
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f0f9ff', borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#0369a1' }}>
                  {estadisticas.pesoPromedio || '-'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Peso Promedio (kg)
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f0fdf4', borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#16a34a' }}>
                  {estadisticas.presionPromedio?.sistolica || '-'}/{estadisticas.presionPromedio?.diastolica || '-'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Presión Promedio (mmHg)
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fef3c7', borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#d97706' }}>
                  {estadisticas.promedioMinutosEjercicio || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Min. Ejercicio Promedio
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Medidas Corporales */}
        <Box sx={{ mb: 3 }}>
          <TitleWithTooltip
            title="Medidas Corporales"
            description="Medidas de cintura, cadera e índice cintura-cadera. El ICC ayuda a evaluar la distribución de grasa corporal."
          />
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f0f9ff', borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#0369a1' }}>
                  {estadisticas.cinturaPromedio || '-'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cintura Promedio (cm)
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f0fdf4', borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#16a34a' }}>
                  {estadisticas.caderaPromedio || '-'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cadera Promedio (cm)
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fef3c7', borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#d97706' }}>
                  {estadisticas.indiceCinturaCadera || '-'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Índice Cintura-Cadera
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Frecuencia de Mediciones */}
        <Box sx={{ mb: 3 }}>
          <TitleWithTooltip
            title="Frecuencia de Mediciones"
            description="Número de mediciones registradas en diferentes períodos de tiempo."
          />
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f0f9ff', borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#0369a1' }}>
                  {estadisticas.totalMediciones}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Mediciones
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f0fdf4', borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#16a34a' }}>
                  {estadisticas.medicionesUltimos7Dias}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Últimos 7 días
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fef3c7', borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#d97706' }}>
                  {estadisticas.medicionesUltimos30Dias}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Últimos 30 días
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fef2f2', borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#dc2626' }}>
                  {estadisticas.diasConEjercicio}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Días con Ejercicio
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EstadisticasResumen; 