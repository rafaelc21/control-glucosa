import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Alert,
  Divider
} from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { MedicionGlucosa, PerfilUsuario } from '../types';
import { generarRecomendaciones } from '../utils/diabetesUtils';

interface RecomendacionesResumenProps {
  mediciones: MedicionGlucosa[];
  perfilUsuario?: PerfilUsuario | null;
}

const RecomendacionesResumen: React.FC<RecomendacionesResumenProps> = ({ mediciones, perfilUsuario }) => {
  const recomendaciones = generarRecomendaciones(mediciones, perfilUsuario || undefined);

  // Simular resumen de recomendaciones (en una implementación real, esto vendría de un análisis más complejo)
  const resumenRecomendaciones = {
    positivas: 0,
    atencion: 3,
    informativas: 3
  };

  const getRecomendacionIcon = (index: number) => {
    if (index === 0) return <TrendingUpIcon color="success" />;
    if (recomendaciones[index]?.includes('elevada') || recomendaciones[index]?.includes('alta')) {
      return <WarningIcon color="warning" />;
    }
    return <InfoIcon color="info" />;
  };

  const getRecomendacionColor = (index: number) => {
    if (index === 0) return 'success';
    if (recomendaciones[index]?.includes('elevada') || recomendaciones[index]?.includes('alta')) {
      return 'warning';
    }
    return 'info';
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Recomendaciones Personalizadas
        </Typography>

        {/* Resumen de Recomendaciones */}
        <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2, border: 'none' }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            Resumen de Recomendaciones
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              label={`${resumenRecomendaciones.positivas} positivas`}
              color="success"
              variant="outlined"
              size="small"
            />
            <Chip
              label={`${resumenRecomendaciones.atencion} de atención`}
              color="warning"
              variant="outlined"
              size="small"
            />
            <Chip
              label={`${resumenRecomendaciones.informativas} informativas`}
              color="info"
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>

        {/* Recomendación Principal */}
        {recomendaciones.length > 0 && (
          <Alert
            severity={getRecomendacionColor(0) as any}
            icon={<LightbulbIcon />}
            sx={{ mb: 3 }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Recomendación Principal:
            </Typography>
            <Typography variant="body2">
              {recomendaciones[0]}
            </Typography>
          </Alert>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Lista de Recomendaciones */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Todas las Recomendaciones
          </Typography>
          
          {recomendaciones.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 3,
                backgroundColor: '#f8fafc',
                borderRadius: 2,
                border: '2px dashed #cbd5e1'
              }}
            >
              <LightbulbIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No hay recomendaciones disponibles
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Registra más mediciones para recibir recomendaciones personalizadas
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recomendaciones.map((recomendacion, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    p: 2,
                    backgroundColor: index === 0 ? '#f0fdf4' : '#f8fafc',
                    borderRadius: 2,
                    border: index === 0 ? '2px solid #16a34a' : '1px solid #e2e8f0'
                  }}
                >
                  <Box sx={{ mt: 0.5 }}>
                    {getRecomendacionIcon(index)}
                  </Box>
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    {recomendacion}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Información adicional */}
        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f0f9ff', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            💡 Las recomendaciones se basan en tus datos de glucosa, peso, presión arterial y actividad física.
            Consulta siempre con tu médico antes de realizar cambios en tu tratamiento.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecomendacionesResumen; 