import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
  Chip,
  Alert,
  Stack,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  FitnessCenter as FitnessCenterIcon,
  Straighten as StraightenIcon
} from '@mui/icons-material';
import { MedicionGlucosa } from '../types';

interface FormularioMedicionProps {
  onSubmit: (medicion: Omit<MedicionGlucosa, 'id'>) => void;
  onCancel: () => void;
}

const FormularioMedicion: React.FC<FormularioMedicionProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    valor: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    tipo: 'ayunas' as const,
    notas: '',
    medicamento: '',
    ejercicio: false,
    minutosEjercicio: '',
    sintomas: [] as string[],
    peso: '',
    presionSistolica: '',
    presionDiastolica: '',
    cintura: '',
    cadera: ''
  });

  const [nuevoSintoma, setNuevoSintoma] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (e: any) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const agregarSintoma = () => {
    if (nuevoSintoma.trim() && !formData.sintomas.includes(nuevoSintoma.trim())) {
      setFormData(prev => ({
        ...prev,
        sintomas: [...prev.sintomas, nuevoSintoma.trim()]
      }));
      setNuevoSintoma('');
    }
  };

  const eliminarSintoma = (sintoma: string) => {
    setFormData(prev => ({
      ...prev,
      sintomas: prev.sintomas.filter(s => s !== sintoma)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.valor || !formData.fecha || !formData.hora) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    const medicion: Omit<MedicionGlucosa, 'id'> = {
      valor: parseFloat(formData.valor),
      fecha: new Date(formData.fecha),
      hora: formData.hora,
      tipo: formData.tipo,
      notas: formData.notas || undefined,
      medicamento: formData.medicamento || undefined,
      ejercicio: formData.ejercicio,
      minutosEjercicio: formData.minutosEjercicio ? parseInt(formData.minutosEjercicio) : undefined,
      sintomas: formData.sintomas,
      peso: formData.peso ? parseFloat(formData.peso) : undefined,
      presionSistolica: formData.presionSistolica ? parseInt(formData.presionSistolica) : undefined,
      presionDiastolica: formData.presionDiastolica ? parseInt(formData.presionDiastolica) : undefined,
      cintura: formData.cintura ? parseFloat(formData.cintura) : undefined,
      cadera: formData.cadera ? parseFloat(formData.cadera) : undefined
    };

    onSubmit(medicion);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Nueva Medición de Glucosa
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {/* Información básica */}
          <Stack spacing={3}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
                gap: 2
              }}
            >
              <TextField
                fullWidth
                label="Glucosa (mg/dL) *"
                name="valor"
                type="number"
                value={formData.valor}
                onChange={handleInputChange}
                required
                inputProps={{ min: 0, max: 1000 }}
              />

              <TextField
                fullWidth
                label="Fecha *"
                name="fecha"
                type="date"
                value={formData.fecha}
                onChange={handleInputChange}
                required
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                label="Hora *"
                name="hora"
                type="time"
                value={formData.hora}
                onChange={handleInputChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <FormControl fullWidth>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Tipo de Medición *
              </Typography>
              <Select
                name="tipo"
                value={formData.tipo}
                onChange={handleSelectChange}
                required
              >
                <MenuItem value="ayunas">En Ayunas</MenuItem>
                <MenuItem value="postprandial">Postprandial (2h después de comer)</MenuItem>
                <MenuItem value="antes_comida">Antes de Comer</MenuItem>
                <MenuItem value="despues_comida">Después de Comer</MenuItem>
                <MenuItem value="otro">Otro</MenuItem>
              </Select>
            </FormControl>

            {/* Información adicional */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 2
              }}
            >
              <TextField
                fullWidth
                label="Medicamento"
                name="medicamento"
                value={formData.medicamento}
                onChange={handleInputChange}
                placeholder="Ej: Metformina 500mg"
              />

              <TextField
                fullWidth
                label="Notas"
                name="notas"
                value={formData.notas}
                onChange={handleInputChange}
                placeholder="Observaciones adicionales"
              />
            </Box>

            {/* Ejercicio */}
            <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 2, p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <FitnessCenterIcon color="primary" />
                Actividad Física
              </Typography>
              
              <FormControlLabel
                control={
                  <Checkbox
                    name="ejercicio"
                    checked={formData.ejercicio}
                    onChange={handleInputChange}
                  />
                }
                label="¿Hiciste ejercicio hoy?"
              />

              {formData.ejercicio && (
                <TextField
                  fullWidth
                  label="Minutos de ejercicio"
                  name="minutosEjercicio"
                  type="number"
                  value={formData.minutosEjercicio}
                  onChange={handleInputChange}
                  sx={{ mt: 2 }}
                  inputProps={{ min: 0, max: 300 }}
                />
              )}
            </Box>

            {/* Medidas corporales */}
            <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 2, p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <StraightenIcon color="primary" />
                Medidas Corporales
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
                  label="Peso (kg)"
                  name="peso"
                  type="number"
                  value={formData.peso}
                  onChange={handleInputChange}
                  inputProps={{ min: 0, max: 300, step: 0.1 }}
                />

                <TextField
                  fullWidth
                  label="Presión Sistólica (mmHg)"
                  name="presionSistolica"
                  type="number"
                  value={formData.presionSistolica}
                  onChange={handleInputChange}
                  inputProps={{ min: 0, max: 300 }}
                />

                <TextField
                  fullWidth
                  label="Presión Diastólica (mmHg)"
                  name="presionDiastolica"
                  type="number"
                  value={formData.presionDiastolica}
                  onChange={handleInputChange}
                  inputProps={{ min: 0, max: 200 }}
                />

                <TextField
                  fullWidth
                  label="Cintura (cm)"
                  name="cintura"
                  type="number"
                  value={formData.cintura}
                  onChange={handleInputChange}
                  inputProps={{ min: 0, max: 200, step: 0.1 }}
                />

                <TextField
                  fullWidth
                  label="Cadera (cm)"
                  name="cadera"
                  type="number"
                  value={formData.cadera}
                  onChange={handleInputChange}
                  inputProps={{ min: 0, max: 200, step: 0.1 }}
                />
              </Box>
            </Box>

            {/* Síntomas */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Síntomas
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Agregar síntoma"
                  value={nuevoSintoma}
                  onChange={(e) => setNuevoSintoma(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarSintoma())}
                />
                <IconButton
                  onClick={agregarSintoma}
                  color="primary"
                  disabled={!nuevoSintoma.trim()}
                >
                  <AddIcon />
                </IconButton>
              </Box>

              {formData.sintomas.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.sintomas.map((sintoma, index) => (
                    <Chip
                      key={index}
                      label={sintoma}
                      onDelete={() => eliminarSintoma(sintoma)}
                      deleteIcon={<DeleteIcon />}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
            </Box>

            {/* Botones */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={onCancel}
                size="large"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
              >
                Registrar Medición
              </Button>
            </Box>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FormularioMedicion; 