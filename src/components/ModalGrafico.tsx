import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import GraficoGlucosa from './GraficoGlucosa';
import { MedicionGlucosa } from '../types';

interface ModalGraficoProps {
  isOpen: boolean;
  onClose: () => void;
  mediciones: MedicionGlucosa[];
}

const ModalGrafico: React.FC<ModalGraficoProps> = ({
  isOpen,
  onClose,
  mediciones
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '90vh',
          borderRadius: 3
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h6" component="span">
          Evolución de Glucosa - Vista Ampliada
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ height: '60vh', width: '100%' }}>
          <GraficoGlucosa
            mediciones={mediciones}
            onAmpliar={() => {}} // No hacer nada en modal
            fullHeight
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ModalGrafico; 