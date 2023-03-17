import { Box } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import ToastNotify from '../../components/ToastNotify';

const Home: React.FC = () => {
  return (
    <>
      <ToastNotify name="home" />
      <Box display="flex" justifyContent="center" gap="20px">
        <Link to="/quan-tri">admin</Link>
        <Link to="/dang-nhap">login</Link>
        <Link to="/dang-ky">register</Link>
      </Box>
    </>
  );
};

export default Home;
