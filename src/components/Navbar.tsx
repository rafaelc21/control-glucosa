import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Person as PersonIcon,
  MonitorHeart as MonitorHeartIcon
} from '@mui/icons-material';

interface NavbarProps {
  onRegistrarMedicion: () => void;
  onAbrirPerfil: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onRegistrarMedicion, onAbrirPerfil }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: '#4a5568',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <Toolbar>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          <MonitorHeartIcon sx={{ mr: 2, fontSize: 28 }} />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            Control de Glucemia
          </Typography>
        </Box>

        <Box display="flex" gap={1}>
          <Button
            color="inherit"
            onClick={onRegistrarMedicion}
            startIcon={<AddIcon />}
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: '0.8rem', sm: '0.875rem' }
            }}
          >
            {isMobile ? 'Medición' : 'Nueva Medición'}
          </Button>
          
          <Button
            color="inherit"
            onClick={onAbrirPerfil}
            startIcon={<PersonIcon />}
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: '0.8rem', sm: '0.875rem' }
            }}
          >
            {isMobile ? 'Perfil' : 'Mi Perfil'}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 