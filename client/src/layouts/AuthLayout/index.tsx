import { Box } from '@mui/material';
import React from 'react';
import Content from './Content';
import Header from './Header';

interface Props {
  children: JSX.Element;
}

const AuthLayout: React.FC<Props> = ({ children }) => {
  return (
    <Box>
      <Header />
      <Content>{children}</Content>
    </Box>
  );
};

export default AuthLayout;
