import { Backdrop, CircularProgress, useTheme } from '@mui/material';
import React from 'react';
import { Theme } from '../theme';

const LoadingPage: React.FC = () => {
  const theme: Theme = useTheme();

  return (
    <Backdrop sx={{ color: theme.palette.primary.main, zIndex: 999 }} open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default LoadingPage;
