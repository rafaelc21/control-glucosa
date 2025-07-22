import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
  Alert
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { PerfilUsuario } from '../types';
import { supabase } from '../lib/supabase';

interface ModalPerfilUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
  onPerfilActualizado: (perfil: PerfilUsuario) => void;
}

const ModalPerfilUsuario: React.FC<ModalPerfilUsuarioProps> = ({
  isOpen,
  onClose,
  onPerfilActualizado
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    correo: '',
    estatura: '',
    peso: '',
    tiempoDiagnostico: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      cargarPerfil();
    }
  }, [isOpen]);

  const cargarPerfil = async () => {
    try {
      const { data, error } = await supabase
        .from('perfil_usuario')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error cargando perfil:', error);
        return;
      }

      if (data) {
        setFormData({
          nombre: data.nombre || '',
          apellidoPaterno: data.apellido_paterno || '',
          apellidoMaterno: data.apellido_materno || '',
          fechaNacimiento: data.fecha_nacimiento ? new Date(data.fecha_nacimiento).toISOString().split('T')[0] : '',
          correo: data.correo || '',
          estatura: data.estatura?.toString() || '',
          peso: data.peso?.toString() || '',
          tiempoDiagnostico: data.tiempo_diagnostico?.toString() || ''
        });
      }
    } catch (error) {
      console.error('Error cargando perfil:', error);
    }
  };

  const calcularEdad = (fechaNacimiento: string): number => {
    if (!fechaNacimiento) return 0;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const edad = calcularEdad(formData.fechaNacimiento);
      
      const perfilData = {
        nombre: formData.nombre,
        apellido_paterno: formData.apellidoPaterno,
        apellido_materno: formData.apellidoMaterno,
        fecha_nacimiento: formData.fechaNacimiento,
        edad: edad,
        correo: formData.correo,
        estatura: formData.estatura ? parseFloat(formData.estatura) : null,
        peso: formData.peso ? parseFloat(formData.peso) : null,
        tiempo_diagnostico: formData.tiempoDiagnostico ? parseFloat(formData.tiempoDiagnostico) : null
      };

      // Verificar si ya existe un perfil
      const { data: existingProfile } = await supabase
        .from('perfil_usuario')
        .select('id')
        .limit(1)
        .single();

      let result;
      if (existingProfile) {
        // Actualizar perfil existente
        result = await supabase
          .from('perfil_usuario')
          .update(perfilData)
          .eq('id', existingProfile.id)
          .select()
          .single();
      } else {
        // Crear nuevo perfil
        result = await supabase
          .from('perfil_usuario')
          .insert([perfilData])
          .select()
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      setSuccess('Perfil guardado exitosamente');
      
      // Convertir a formato de interfaz
      const perfil: PerfilUsuario = {
        id: result.data.id,
        nombre: result.data.nombre,
        apellidoPaterno: result.data.apellido_paterno,
        apellidoMaterno: result.data.apellido_materno,
        fechaNacimiento: new Date(result.data.fecha_nacimiento),
        edad: result.data.edad,
        correo: result.data.correo,
        estatura: result.data.estatura,
        peso: result.data.peso,
        tiempoDiagnostico: result.data.tiempo_diagnostico,
        fechaCreacion: new Date(result.data.fecha_creacion),
        fechaActualizacion: new Date(result.data.fecha_actualizacion)
      };

      onPerfilActualizado(perfil);
      
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error: any) {
      console.error('Error guardando perfil:', error);
      setError(error.message || 'Error al guardar el perfil');
    } finally {
      setLoading(false);
    }
  };

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
          Mi Perfil - Diabetes Tipo 2
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            {/* Información personal */}
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Información Personal
            </Typography>
            
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 2
              }}
            >
              <TextField
                fullWidth
                label="Nombre *"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />

              <TextField
                fullWidth
                label="Apellido Paterno *"
                name="apellidoPaterno"
                value={formData.apellidoPaterno}
                onChange={handleInputChange}
                required
              />

              <TextField
                fullWidth
                label="Apellido Materno"
                name="apellidoMaterno"
                value={formData.apellidoMaterno}
                onChange={handleInputChange}
              />

              <TextField
                fullWidth
                label="Fecha de Nacimiento *"
                name="fechaNacimiento"
                type="date"
                value={formData.fechaNacimiento}
                onChange={handleInputChange}
                required
                InputLabelProps={{ shrink: true }}
                helperText={`Edad calculada: ${calcularEdad(formData.fechaNacimiento)} años`}
              />

              <TextField
                fullWidth
                label="Correo Electrónico"
                name="correo"
                type="email"
                value={formData.correo}
                onChange={handleInputChange}
              />
            </Box>

            {/* Información médica */}
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Información Médica
            </Typography>
            
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
                gap: 2
              }}
            >
              <TextField
                fullWidth
                label="Estatura (cm) *"
                name="estatura"
                type="number"
                value={formData.estatura}
                onChange={handleInputChange}
                required
                inputProps={{ min: 100, max: 250 }}
                helperText="Ej: 170"
              />

              <TextField
                fullWidth
                label="Peso Actual (kg)"
                name="peso"
                type="number"
                value={formData.peso}
                onChange={handleInputChange}
                inputProps={{ min: 30, max: 300, step: 0.1 }}
                helperText="Ej: 75.5"
              />

              <TextField
                fullWidth
                label="Años con Diabetes"
                name="tiempoDiagnostico"
                type="number"
                value={formData.tiempoDiagnostico}
                onChange={handleInputChange}
                inputProps={{ min: 0, max: 50, step: 0.5 }}
                helperText="Ej: 5.5"
              />
            </Box>

            {/* Botones */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={onClose}
                size="large"
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Perfil'}
              </Button>
            </Box>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ModalPerfilUsuario; 