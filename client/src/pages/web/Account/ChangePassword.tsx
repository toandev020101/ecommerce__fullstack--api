import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Container, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiEdit as BiEditIcon } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import * as userApi from '../../../apis/userApi';
import { useAppDispatch, useAppSelector } from '../../../app/hook';
import InputField from '../../../components/InputField';
import TitlePage from '../../../components/TitlePage';
import ToastNotify from '../../../components/ToastNotify';
import { ChangePasswordInput } from '../../../interfaces/ChangePasswordInput';
import { FieldError } from '../../../interfaces/FieldError';
import { User } from '../../../models/User';
import { showToast } from '../../../slices/toastSlice';
import { Theme } from '../../../theme';
import JWTManager from '../../../utils/jwt';
import changePasswordSchema from '../../../validations/changePasswordSchema';
import Sidebar from './Sidebar';
import { selectIsReload } from '../../../slices/globalSlice';

const ChangePassword: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme: Theme = useTheme();
  const isReload = useAppSelector(selectIsReload);

  const [user, setUser] = useState<User>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FieldError[]>([]);

  const form = useForm<ChangePasswordInput>({
    defaultValues: {
      password: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    resolver: yupResolver(changePasswordSchema),
  });

  useEffect(() => {
    const getOneUser = async () => {
      try {
        const res = await userApi.getOneAndRoleByIdPublic(JWTManager.getUserId() as number);
        const resData = res.data as User;
        setUser(resData);
      } catch (error: any) {
        const { data } = error.response;

        if (data.code === 401) {
          dispatch(
            showToast({
              page: 'login',
              type: 'error',
              message: 'Vui lòng đăng nhập tài khoản của bạn',
              options: { theme: 'colored', toastId: 'loginId' },
            }),
          );
          navigate('/dang-nhap');
        } else if (data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getOneUser();
  }, [navigate, dispatch, isReload]);

  const handleChangePasswordSubmit = async (values: any) => {
    setIsLoading(true);

    try {
      const res = await userApi.changePassword(user?.id as number, values);

      dispatch(
        showToast({
          page: 'changePassword',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'changePasswordId' },
        }),
      );
      setIsLoading(false);
      form.reset();
    } catch (error: any) {
      setIsLoading(false);

      const { data } = error.response;
      if (data.code === 403 || data.code === 400) {
        setErrors(data.errors);
        dispatch(
          showToast({
            page: 'changePassword',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'changePasswordId' },
          }),
        );
      }

      if (data.code === 401 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  return (
    <>
      <TitlePage title="Thay đổi mật khẩu" />
      <ToastNotify name="changePassword" />
      <Box bgcolor={theme.palette.neutral[950]} padding="20px 0">
        <Container maxWidth="lg">
          <Box display="flex" gap="20px">
            <Sidebar user={user} />
            <Box
              padding="15px 30px"
              boxShadow="0 1px 2px 0 rgba(0,0,0,.13)"
              borderRadius="5px"
              bgcolor={theme.palette.common.white}
              flex={1}
              component="form"
              onSubmit={form.handleSubmit(handleChangePasswordSubmit)}
            >
              <Box paddingBottom="15px" borderBottom="1px solid #e0e0e0">
                <Typography fontSize="18px" sx={{ textTransform: 'capitalize', color: theme.palette.neutral[200] }}>
                  Đổi mật khẩu
                </Typography>
                <Typography sx={{ color: theme.palette.neutral[300] }}>
                  Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
                </Typography>
              </Box>

              <Box padding="15px" marginTop="15px" maxWidth="500px">
                <InputField
                  form={form}
                  errorServers={errors}
                  setErrorServers={setErrors}
                  name="password"
                  label="Mật khẩu hiện tại"
                  type="password"
                  required
                />

                <InputField
                  form={form}
                  errorServers={errors}
                  setErrorServers={setErrors}
                  name="newPassword"
                  label="Mật khẩu mới"
                  type="password"
                  required
                />

                <InputField
                  form={form}
                  errorServers={errors}
                  setErrorServers={setErrors}
                  name="confirmNewPassword"
                  label="Nhập lại mật khẩu mới"
                  type="password"
                  required
                />

                <LoadingButton
                  variant="contained"
                  loading={isLoading}
                  startIcon={<BiEditIcon />}
                  loadingPosition="start"
                  type="submit"
                  sx={{
                    backgroundColor: theme.palette.primary[500],
                    color: theme.palette.neutral[1000],
                    textTransform: 'none',
                  }}
                >
                  Lưu lại
                </LoadingButton>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ChangePassword;
