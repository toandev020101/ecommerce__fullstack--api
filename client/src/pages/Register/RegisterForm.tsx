import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as authApi from '../../apis/authApi';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import InputField from '../../components/InputField';
import RadioGroupField from '../../components/RadioGroupField';
import { FieldError } from '../../interfaces/FieldError';
import { RegisterInput } from '../../interfaces/RegisterInput';
import { authFai, authPending, authSuccess, selectIsLoading } from '../../slices/authSlice';
import { showToast } from '../../slices/toastSlice';
import { Theme } from '../../theme';
import JWTManager from '../../utils/jwt';
import registerSchema from '../../validations/registerSchema';

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const theme: Theme = useTheme();

  const [errors, setErrors] = useState<FieldError[]>([]);

  interface Values extends RegisterInput {
    confirmPassword: string;
  }

  const form = useForm<Values>({
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      confirmPassword: '',
      gender: 0,
    },
    resolver: yupResolver(registerSchema),
  });

  const handleSubmit = async ({ confirmPassword, ...others }: Values) => {
    dispatch(authPending());
    try {
      const res = await authApi.register(others);

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
            page: 'register',
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
        <Box display="flex" gap="10px">
          <InputField form={form} errorServers={errors} name="firstName" label="Họ" required />
          <InputField form={form} errorServers={errors} name="lastName" label="Tên" required />
        </Box>

        <RadioGroupField
          form={form}
          title="Giới tính"
          name="gender"
          valueObjects={[
            { label: 'Nam', value: 0 },
            { label: 'Nữ', value: 1 },
          ]}
          row
          required
        />

        <InputField form={form} errorServers={errors} name="username" label="Tên đăng nhập" required />
        <InputField form={form} errorServers={errors} name="password" label="Mật khẩu" type="password" required />
        <InputField
          form={form}
          errorServers={errors}
          name="confirmPassword"
          label="Nhập lại mật khẩu"
          type="password"
          required
        />

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
          Đăng ký
        </LoadingButton>
      </Box>
    </>
  );
};

export default RegisterForm;
