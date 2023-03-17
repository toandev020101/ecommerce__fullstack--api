import { Box, Button, Typography, useTheme } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { Theme } from '../../theme';
import RegisterForm from './RegisterForm';
import { BsFacebook as BsFacebookIcon, BsGoogle as BsGoogleIcon, BsApple as BsAppleIcon } from 'react-icons/bs';
import TitlePage from '../../components/TitlePage';
import ToastNotify from '../../components/ToastNotify';

const Register: React.FC = () => {
  const theme: Theme = useTheme();

  return (
    <>
      <TitlePage title="Đăng ký tài khoản" />
      <ToastNotify name="register" />

      <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 80px)">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap="10px"
          bgcolor={theme.palette.neutral[950]}
          color={theme.palette.neutral[50]}
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
              bgcolor={theme.palette.neutral[950]}
              color={theme.palette.neutral[500]}
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

          {/* button media */}
          <Box display="flex" gap="10px">
            <Button
              variant="outlined"
              startIcon={<BsFacebookIcon />}
              sx={{ color: theme.palette.info.main, borderColor: theme.palette.info.main }}
            >
              Facebook
            </Button>
            <Button
              variant="outlined"
              startIcon={<BsGoogleIcon />}
              sx={{ color: theme.palette.error.main, borderColor: theme.palette.error.main }}
            >
              Google
            </Button>
            <Button
              variant="outlined"
              startIcon={<BsAppleIcon />}
              sx={{ color: theme.palette.neutral[50], borderColor: theme.palette.neutral[50] }}
            >
              Apple
            </Button>
          </Box>

          <Box marginTop="15px">
            <Typography component="span" color={theme.palette.neutral[500]}>
              Bạn đã có tài khoản?{' '}
              <Link to="/dang-nhap">
                <Typography component="span" color={theme.palette.primary[500]}>
                  Đăng nhập
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Box>
        {/* button media */}
      </Box>
    </>
  );
};

export default Register;
