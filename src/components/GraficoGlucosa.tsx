import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Button,
  Box,
  Typography
} from '@mui/material';
import { ZoomIn as ZoomInIcon } from '@mui/icons-material';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { MedicionGlucosa } from '../types';

interface GraficoGlucosaProps {
  mediciones: MedicionGlucosa[];
  onAmpliar?: () => void;
  fullHeight?: boolean;
}

const GraficoGlucosa: React.FC<GraficoGlucosaProps> = ({
  mediciones,
  onAmpliar,
  fullHeight = false
}) => {
  // Filtrar mediciones de los últimos 30 días
  const hace30Dias = subDays(new Date(), 30);
  const medicionesFiltradas = mediciones
    .filter(m => m.fecha >= hace30Dias)
    .sort((a, b) => a.fecha.getTime() - b.fecha.getTime());

  // Preparar datos para el gráfico
  const datosGrafico = medicionesFiltradas.map(medicion => ({
    fecha: format(medicion.fecha, 'dd/MM', { locale: es }),
    valor: medicion.valor,
    tipo: medicion.tipo,
    hora: medicion.hora
  }));

  // Personalizar tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e2e8f0',
            borderRadius: 2,
            p: 2,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
          <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
            {data.valor} mg/dL
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {data.tipo} - {data.hora}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  if (medicionesFiltradas.length === 0) {
    return (
      <Box
        sx={{
          height: fullHeight ? '100%' : 300,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f8fafc',
          borderRadius: 2,
          border: '2px dashed #cbd5e1'
        }}
      >
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          No hay datos para mostrar
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Registra tu primera medición para ver la evolución
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <ResponsiveContainer width="100%" height={fullHeight ? 400 : 300}>
        <LineChart data={datosGrafico} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="fecha"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={['dataMin - 20', 'dataMax + 20']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="valor"
            stroke="#667eea"
            strokeWidth={3}
            dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#667eea', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {onAmpliar && (
        <Button
          variant="outlined"
          size="small"
          startIcon={<ZoomInIcon />}
          onClick={onAmpliar}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)'
            }
          }}
        >
          Ampliar
        </Button>
      )}
    </Box>
  );
};

export default GraficoGlucosa; 