import React from 'react';
import { Grid } from '@mui/material';
import { MedicionGlucosa, PerfilUsuario } from '../types';
import EstadisticasResumen from './EstadisticasResumen';
import RecomendacionesResumen from './RecomendacionesResumen';

interface ResumenGeneralProps {
  mediciones: MedicionGlucosa[];
  perfilUsuario?: PerfilUsuario | null;
}

const ResumenGeneral: React.FC<ResumenGeneralProps> = ({ mediciones, perfilUsuario }) => {
  return (
    <Grid container spacing={3}>
      {/* Resumen de Actividad - 60% */}
      <Grid item xs={12} lg={7}>
        <EstadisticasResumen
          mediciones={mediciones}
          perfilUsuario={perfilUsuario}
        />
      </Grid>

      {/* Recomendaciones - 40% */}
      <Grid item xs={12} lg={5}>
        <RecomendacionesResumen
          mediciones={mediciones}
          perfilUsuario={perfilUsuario}
        />
      </Grid>
    </Grid>
  );
};

export default ResumenGeneral; 