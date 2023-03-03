import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as authApi from '../../apis/authApi';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import InputField from '../../components/InputField';
import { FieldError } from '../../interfaces/FieldError';
import { LoginInput } from '../../interfaces/LoginInput';
import { authFai, authPending, authSuccess, selectIsLoading } from '../../slices/authSlice';
import { showToast } from '../../slices/toastSlice';
import { Theme } from '../../theme';
import JWTManager from '../../utils/jwt';
import loginSchema from '../../validations/loginSchema';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const theme: Theme = useTheme();

  const [errors, setErrors] = useState<FieldError[]>([]);

  const form = useForm<LoginInput>({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: yupResolver(loginSchema),
  });

  const handleSubmit = async (values: LoginInput) => {
    dispatch(authPending());
    try {
      const res = await authApi.login(values);

      dispatch(authSuccess());
      JWTManager.setToken(res.accessToken as string);

      dispatch(
        showToast({
          page: 'home',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'homeId' },
        }),
      );
      navigate('/');
      form.reset();
    } catch (error: any) {
      const { data } = error.response;

      if (data.code === 400) {
        setErrors(data.errors);
        dispatch(
          showToast({
            page: 'login',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'homeId' },
          }),
        );
      } else {
        // lỗi 500
      }

      dispatch(authFai());
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={form.handleSubmit(handleSubmit)}
        display="flex"
        flexDirection="column"
        width="100%"
        marginTop="20px"
      >
        <InputField form={form} errorServers={errors} name="username" label="Tên đăng nhập" required />
        <InputField form={form} errorServers={errors} name="password" label="Mật khẩu" type="password" required />

        <LoadingButton
          variant="contained"
          loading={isLoading}
          loadingIndicator="Loading…"
          type="submit"
          sx={{
            backgroundColor: theme.palette.primary[500],
            color: theme.palette.neutral[1000],
            height: '40px',
            fontSize: '14px',
          }}
        >
          Đăng nhập
        </LoadingButton>
      </Box>
    </>
  );
};

export default LoginForm;
