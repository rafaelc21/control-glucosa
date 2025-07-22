import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import FormularioMedicion from './FormularioMedicion';
import { MedicionGlucosa } from '../types';

interface ModalFormularioMedicionProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (medicion: Omit<MedicionGlucosa, 'id'>) => void;
}

const ModalFormularioMedicion: React.FC<ModalFormularioMedicionProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
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
          Registrar Nueva Medición
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        <FormularioMedicion onSubmit={onSubmit} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default ModalFormularioMedicion; 