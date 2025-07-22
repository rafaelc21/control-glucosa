import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Remove as RemoveIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MedicionGlucosa } from '../types';
import { evaluarGlucosaDiabetesTipo2 } from '../utils/diabetesUtils';

interface ListaMedicionesProps {
  mediciones: MedicionGlucosa[];
}

const ListaMediciones: React.FC<ListaMedicionesProps> = ({ mediciones }) => {
  const getTipoLabel = (tipo: string) => {
    const tipos = {
      ayunas: 'En Ayunas',
      postprandial: 'Postprandial',
      antes_comida: 'Antes de Comer',
      despues_comida: 'Después de Comer',
      otro: 'Otro'
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
  };

  const getTipoColor = (tipo: string) => {
    const colores = {
      ayunas: 'primary',
      postprandial: 'secondary',
      antes_comida: 'info',
      despues_comida: 'warning',
      otro: 'default'
    };
    return colores[tipo as keyof typeof colores] || 'default';
  };

  if (mediciones.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Historial de Mediciones - Diabetes Tipo 2
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: 4,
              backgroundColor: '#f8fafc',
              borderRadius: 2,
              border: '2px dashed #cbd5e1'
            }}
          >
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No hay mediciones registradas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Registra tu primera medición para ver el historial
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Historial de Mediciones - Diabetes Tipo 2
        </Typography>
        
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Hora</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Glucosa (mg/dL)</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Peso (kg)</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Presión (mmHg)</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Ejercicio</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Notas</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mediciones.map((medicion) => {
                const evaluacion = evaluarGlucosaDiabetesTipo2(medicion.valor, medicion.tipo);
                const presionText = medicion.presionSistolica && medicion.presionDiastolica
                  ? `${medicion.presionSistolica}/${medicion.presionDiastolica}`
                  : '-';
                const ejercicioText = medicion.ejercicio
                  ? `${medicion.minutosEjercicio || 0} min`
                  : 'No';

                return (
                  <TableRow key={medicion.id} hover>
                    <TableCell>
                      {format(medicion.fecha, 'dd/MM/yyyy', { locale: es })}
                    </TableCell>
                    <TableCell>{medicion.hora}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: evaluacion.color }}
                        >
                          {medicion.valor}
                        </Typography>
                        {medicion.valor > 180 && (
                          <Tooltip title="Valor elevado">
                            <TrendingUpIcon sx={{ fontSize: 16, color: '#e74c3c' }} />
                          </Tooltip>
                        )}
                        {medicion.valor < 70 && (
                          <Tooltip title="Valor bajo">
                            <TrendingDownIcon sx={{ fontSize: 16, color: '#e74c3c' }} />
                          </Tooltip>
                        )}
                        {medicion.valor >= 70 && medicion.valor <= 180 && (
                          <Tooltip title="Valor en rango">
                            <RemoveIcon sx={{ fontSize: 16, color: '#27ae60' }} />
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getTipoLabel(medicion.tipo)}
                        color={getTipoColor(medicion.tipo) as any}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={evaluacion.nivel}
                        sx={{
                          backgroundColor: evaluacion.color,
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {medicion.peso ? `${medicion.peso} kg` : '-'}
                    </TableCell>
                    <TableCell>{presionText}</TableCell>
                    <TableCell>
                      <Chip
                        label={ejercicioText}
                        color={medicion.ejercicio ? 'success' : 'default'}
                        size="small"
                        variant={medicion.ejercicio ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200 }}>
                        {medicion.notas || '-'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default ListaMediciones; 