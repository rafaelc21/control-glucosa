import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { supabase } from './lib/supabase';
import { MedicionGlucosa, PerfilUsuario } from './types';
import { calcularEstadisticasDiabetesTipo2, generarRecomendaciones } from './utils/diabetesUtils';

// Componentes
import Navbar from './components/Navbar';
import ModalFormularioMedicion from './components/ModalFormularioMedicion';
import ModalPerfilUsuario from './components/ModalPerfilUsuario';
import ModalGrafico from './components/ModalGrafico';
import GraficoGlucosa from './components/GraficoGlucosa';
import ListaMediciones from './components/ListaMediciones';
import EstadisticasResumen from './components/EstadisticasResumen';
import RecomendacionesResumen from './components/RecomendacionesResumen';
import ResumenGeneral from './components/ResumenGeneral';

function App() {
  const [mediciones, setMediciones] = useState<MedicionGlucosa[]>([]);
  const [perfilUsuario, setPerfilUsuario] = useState<PerfilUsuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para modales
  const [modalMedicionOpen, setModalMedicionOpen] = useState(false);
  const [modalPerfilOpen, setModalPerfilOpen] = useState(false);
  const [modalGraficoOpen, setModalGraficoOpen] = useState(false);

  // Cargar datos al iniciar
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError('');

      // Cargar mediciones
      const { data: medicionesData, error: medicionesError } = await supabase
        .from('mediciones')
        .select('*')
        .order('fecha', { ascending: false });

      if (medicionesError) {
        throw medicionesError;
      }

      // Convertir datos de mediciones
      const medicionesConvertidas = medicionesData?.map(medicion => ({
        id: medicion.id,
        valor: medicion.valor,
        fecha: new Date(medicion.fecha),
        hora: medicion.hora,
        tipo: medicion.tipo,
        notas: medicion.notas,
        medicamento: medicion.medicamento,
        ejercicio: medicion.ejercicio,
        minutosEjercicio: medicion.minutos_ejercicio,
        sintomas: medicion.sintomas || [],
        peso: medicion.peso,
        presionSistolica: medicion.presion_sistolica,
        presionDiastolica: medicion.presion_diastolica,
        cintura: medicion.cintura,
        cadera: medicion.cadera
      })) || [];

      setMediciones(medicionesConvertidas);

      // Cargar perfil de usuario
      const { data: perfilData, error: perfilError } = await supabase
        .from('perfil_usuario')
        .select('*')
        .limit(1)
        .single();

      if (perfilError && perfilError.code !== 'PGRST116') {
        console.error('Error cargando perfil:', perfilError);
      } else if (perfilData) {
        const perfilConvertido: PerfilUsuario = {
          id: perfilData.id,
          nombre: perfilData.nombre,
          apellidoPaterno: perfilData.apellido_paterno,
          apellidoMaterno: perfilData.apellido_materno,
          fechaNacimiento: new Date(perfilData.fecha_nacimiento),
          edad: perfilData.edad,
          correo: perfilData.correo,
          estatura: perfilData.estatura,
          peso: perfilData.peso,
          tiempoDiagnostico: perfilData.tiempo_diagnostico,
          fechaCreacion: new Date(perfilData.fecha_creacion),
          fechaActualizacion: new Date(perfilData.fecha_actualizacion)
        };
        setPerfilUsuario(perfilConvertido);
      }

    } catch (error: any) {
      console.error('Error cargando datos:', error);
      setError(error.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const agregarMedicion = async (medicion: Omit<MedicionGlucosa, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('mediciones')
        .insert([{
          valor: medicion.valor,
          fecha: medicion.fecha.toISOString().split('T')[0],
          hora: medicion.hora,
          tipo: medicion.tipo,
          notas: medicion.notas,
          medicamento: medicion.medicamento,
          ejercicio: medicion.ejercicio,
          minutos_ejercicio: medicion.minutosEjercicio,
          sintomas: medicion.sintomas,
          peso: medicion.peso,
          presion_sistolica: medicion.presionSistolica,
          presion_diastolica: medicion.presionDiastolica,
          cintura: medicion.cintura,
          cadera: medicion.cadera
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Agregar la nueva medición al estado
      const nuevaMedicion: MedicionGlucosa = {
        id: data.id,
        valor: data.valor,
        fecha: new Date(data.fecha),
        hora: data.hora,
        tipo: data.tipo,
        notas: data.notas,
        medicamento: data.medicamento,
        ejercicio: data.ejercicio,
        minutosEjercicio: data.minutos_ejercicio,
        sintomas: data.sintomas || [],
        peso: data.peso,
        presionSistolica: data.presion_sistolica,
        presionDiastolica: data.presion_diastolica,
        cintura: data.cintura,
        cadera: data.cadera
      };

      setMediciones(prev => [nuevaMedicion, ...prev]);
      setModalMedicionOpen(false);

    } catch (error: any) {
      console.error('Error agregando medición:', error);
      alert('Error al agregar la medición: ' + error.message);
    }
  };

  const handlePerfilActualizado = (perfil: PerfilUsuario) => {
    setPerfilUsuario(perfil);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Navbar
        onRegistrarMedicion={() => setModalMedicionOpen(true)}
        onAbrirPerfil={() => setModalPerfilOpen(true)}
      />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Layout principal - 2 columnas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Columna izquierda - Resumen General */}
          <Grid item xs={12} lg={6}>
            <ResumenGeneral
              mediciones={mediciones}
              perfilUsuario={perfilUsuario}
            />
          </Grid>

          {/* Columna derecha - Gráfico */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ height: 'fit-content' }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                  Evolución de Glucosa - Últimos 30 días
                </Typography>
                <GraficoGlucosa
                  mediciones={mediciones}
                  onAmpliar={() => setModalGraficoOpen(true)}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Historial - Ancho completo */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ListaMediciones mediciones={mediciones} />
          </Grid>
        </Grid>
      </Container>

      {/* Modales */}
      <ModalFormularioMedicion
        isOpen={modalMedicionOpen}
        onClose={() => setModalMedicionOpen(false)}
        onSubmit={agregarMedicion}
      />

      <ModalPerfilUsuario
        isOpen={modalPerfilOpen}
        onClose={() => setModalPerfilOpen(false)}
        onPerfilActualizado={handlePerfilActualizado}
      />

      <ModalGrafico
        isOpen={modalGraficoOpen}
        onClose={() => setModalGraficoOpen(false)}
        mediciones={mediciones}
      />
    </Box>
  );
}

export default App; 