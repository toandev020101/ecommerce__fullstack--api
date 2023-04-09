import React from 'react';
import Header from './Header';
import Navbar from './Navbar';
import { Box } from '@mui/material';
import Footer from './Footer';

interface Props {
  children: JSX.Element;
}

const ClientLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      <Navbar />
      <Box>{children}</Box>
      <Footer />
    </>
  );
};

export default ClientLayout;
