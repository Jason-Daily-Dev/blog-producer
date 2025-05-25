import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, Button, Typography } from '@mui/material';

const TopRightUserInfo: React.FC = () => {
  const { user, logout } = useAuth0();
  const firstName = user?.name?.split(' ')[0] || ''; // Extract first name and handle undefined

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        backgroundColor: 'transparent', // Remove underlying box
      }}
    >
      <Typography
        sx={{
          color: '#22C55E', // Highlight green for username
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
        }}
      >
        {firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()} {/* Convert to Title Case */}
      </Typography>
      <Button
        variant="contained"
        size="small"
        onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
        sx={{
          textTransform: 'none',
          fontWeight: 'bold',
          backgroundColor: '#FACC15', // Yellow background color for the button
          color: '#6B21A8', // Purple font color for the button text
          '&:hover': {
            backgroundColor: '#EAB308', // Slightly darker yellow on hover
          },
        }}
      >
        Log Out
      </Button>
    </Box>
  );
};

export default TopRightUserInfo;