import { Box } from '@mui/material';

const AppBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box
      sx={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1505480767689-438a5116e3a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDk4OTJ8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGluJTIwY2xvdWR8ZW58MHx8fHwxNzQ4MTM1NDY1fDA&ixlib=rb-4.1.0&q=80&w=1080)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </Box>
  );
};

export default AppBackground;