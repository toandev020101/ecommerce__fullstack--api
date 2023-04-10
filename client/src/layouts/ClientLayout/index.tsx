import React from 'react';
import Header from './Header';
import Navbar from './Navbar';
import { Box, Container, useTheme } from '@mui/material';
import Footer from './Footer';
import { Theme } from '../../theme';

interface Props {
  children: JSX.Element;
}

const ClientLayout: React.FC<Props> = ({ children }) => {
  const theme: Theme = useTheme();

  return (
    <>
      <Box
        sx={{
          backgroundImage: `linear-gradient(-180deg, ${theme.palette.primary[300]},${theme.palette.primary[500]})`,
          color: theme.palette.common.white,
        }}
      >
        <Container>
          <Header />
          <Navbar />
        </Container>
      </Box>

      {children}

      <Box bgcolor={theme.palette.neutral[1000]} padding="20px 0">
        <Container>
          <Footer />
        </Container>
      </Box>
    </>
  );
};

export default ClientLayout;
