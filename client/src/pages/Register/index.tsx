import { Box, Button, Typography, useTheme } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { Theme } from '../../theme';
import RegisterForm from './RegisterForm';
import { BsFacebook as BsFacebookIcon, BsGoogle as BsGoogleIcon, BsApple as BsAppleIcon } from 'react-icons/bs';

const Register: React.FC = () => {
  const theme: Theme = useTheme();

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 80px)">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap="10px"
        bgcolor={theme.palette.background.default}
        color={theme.palette.neutral[0]}
        minWidth="400px"
        padding="20px 30px"
        borderRadius="5px"
        boxShadow="0 3px 10px 0 #00000023"
      >
        <Typography variant="h3">Đăng ký</Typography>
        <RegisterForm />

        <Box position="relative" width="100%" margin="10px 0">
          <Box height="1px" width="100%" bgcolor={theme.palette.neutral[700]}></Box>
          <Typography
            component="span"
            bgcolor={theme.palette.background.default}
            color={theme.palette.neutral[300]}
            padding="3px 5px"
            position="absolute"
            top="50%"
            left="50%"
            sx={{
              transform: 'translateX(-50%) translateY(-50%)',
            }}
          >
            Hoặc
          </Typography>
        </Box>

        <Box display="flex" gap="10px">
          <Button variant="outlined" startIcon={<BsFacebookIcon />} color="info">
            Facebook
          </Button>
          <Button variant="outlined" startIcon={<BsGoogleIcon />} color="error">
            Google
          </Button>
          <Button variant="outlined" startIcon={<BsAppleIcon />} color="inherit">
            Apple
          </Button>
        </Box>

        <Box marginTop="15px">
          <Typography component="span" color={theme.palette.neutral[500]}>
            Bạn đã có tài khoản?{' '}
            <Link to="/login">
              <Typography component="span" color={theme.palette.primary[500]}>
                Đăng nhập
              </Typography>
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
