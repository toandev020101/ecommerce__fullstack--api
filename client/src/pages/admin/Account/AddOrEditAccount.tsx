import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Avatar, Box, Breadcrumbs, Button, Grid, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiReset as BiResetIcon } from 'react-icons/bi';
import { FiPlusSquare as FiPlusSquareIcon } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import * as roleApi from '../../../apis/roleApi';
import * as userApi from '../../../apis/userApi';
import { useAppDispatch } from '../../../app/hook';
import InputField from '../../../components/InputField';
import RadioGroupField from '../../../components/RadioGroupField';
import SelectField from '../../../components/SelectField';
import TitlePage from '../../../components/TitlePage';
import ToastNotify from '../../../components/ToastNotify';
import { FieldError } from '../../../interfaces/FieldError';
import { UserInput } from '../../../interfaces/UserInput';
import { ValueObject } from '../../../interfaces/ValueObject';
import { Role } from '../../../models/Role';
import { showToast } from '../../../slices/toastSlice';
import { Theme } from '../../../theme';
import userSchema from '../../../validations/userSchema';

const AddOrEditAccount: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme: Theme = useTheme();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [roles, setRoles] = useState<ValueObject[]>([]);

  useEffect(() => {
    const getAllRole = async () => {
      try {
        const res = await roleApi.getAll();

        const roleData = res.data as Role[];
        let data: ValueObject[] = [];
        for (let i = 0; i < roleData.length; i++) {
          data.push({ label: roleData[i].name, value: roleData[i].id });
        }
        setRoles(data);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getAllRole();
  }, [navigate]);

  const form = useForm<UserInput>({
    defaultValues: {
      fullName: '',
      username: '',
      password: '',
      gender: 0,
      email: undefined,
      avatar: undefined,
      phoneNumber: undefined,
      isActive: 1,
      roleId: '',
    },
    resolver: yupResolver(userSchema),
  });

  const handleAddOrEditSubmit = async (values: UserInput) => {
    setIsLoading(true);

    try {
      const res = await userApi.addOne(values);
      dispatch(
        showToast({
          page: 'account',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'accountId' },
        }),
      );
      navigate('/quan-tri/tai-khoan/danh-sach');
    } catch (error: any) {
      setIsLoading(false);

      const { data } = error.response;
      if (data.code === 400) {
        setErrors(data.errors);
        dispatch(
          showToast({
            page: 'addOrEditAccount',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'addOrEditAccountId' },
          }),
        );
      }

      if (data.code === 401 || data.code === 403 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  return (
    <>
      <TitlePage title="Thêm mới tài khoản" />
      <ToastNotify name="addOrEditAccount" />
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: '20px' }}>
        <Link to="/quan-tri/tai-khoan/danh-sach">Danh sách</Link>
        <Typography color="text.primary">Thêm mới</Typography>
      </Breadcrumbs>

      <Grid container spacing={2} component="form" onSubmit={form.handleSubmit(handleAddOrEditSubmit)}>
        <Grid item md={5}>
          <Box
            padding="20px"
            marginBottom="20px"
            sx={{
              bgcolor: theme.palette.neutral[1000],
              boxShadow: `${theme.palette.neutral[700]} 0px 2px 10px 0px`,
              borderRadius: '5px',

              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary[500],
                  fontSize: '16px',
                },
              },
              '& label.Mui-focused': {
                color: theme.palette.primary[500],
                fontSize: '16px',
              },
            }}
          >
            <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" gap="20px">
              <Avatar src="" alt="no-avatar.png" sx={{ width: '150px', height: '150px' }} />
              <Box display="flex" gap="10px" marginBottom="30px">
                <Button
                  variant="contained"
                  sx={{ color: theme.palette.common.white, bgcolor: theme.palette.primary[500] }}
                  component="label"
                >
                  Thay đổi hình ảnh
                </Button>
                <Button variant="contained" color="secondary">
                  Làm lại
                </Button>
              </Box>
            </Box>

            <InputField form={form} errorServers={errors} name="fullName" label="Họ và tên" required />
            <InputField form={form} errorServers={errors} name="username" label="Tên đăng nhập" required />
            <InputField form={form} errorServers={errors} name="password" label="Mật khẩu" type="password" required />

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

            <Box display="flex" gap="10px" marginTop="30px">
              <LoadingButton
                variant="contained"
                loading={isLoading}
                startIcon={<FiPlusSquareIcon />}
                loadingPosition="start"
                type="submit"
                sx={{
                  backgroundColor: theme.palette.primary[500],
                  color: theme.palette.neutral[1000],
                }}
              >
                Thêm mới
              </LoadingButton>
              <Button variant="contained" startIcon={<BiResetIcon />} color="secondary" onClick={() => form.reset()}>
                Làm lại
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item md={7}>
          <Box
            padding="20px"
            marginBottom="20px"
            sx={{
              bgcolor: theme.palette.neutral[1000],
              boxShadow: `${theme.palette.neutral[700]} 0px 2px 10px 0px`,
              borderRadius: '5px',

              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary[500],
                  fontSize: '16px',
                },
              },
              '& label.Mui-focused': {
                color: theme.palette.primary[500],
                fontSize: '16px',
              },
            }}
          >
            <Box display="flex" gap="10px">
              <Box width="100%" marginBottom="10px">
                <InputField form={form} errorServers={errors} name="email" label="Email" />
                <Typography sx={{ color: theme.palette.neutral[400] }}>
                  Chúng tôi sẽ gửi email xác nhận đến địa chỉ email.
                </Typography>
              </Box>
              <InputField form={form} errorServers={errors} name="phoneNumber" label="Số điện thoại" />
            </Box>

            <Box display="flex" gap="10px">
              <SelectField
                form={form}
                errorServers={errors}
                name="roleId"
                label="Vai trò"
                valueObjects={roles}
                required
              />

              <SelectField
                form={form}
                errorServers={errors}
                name="isActive"
                label="Trạng thái"
                valueObjects={[
                  { label: 'Hoạt động', value: 1 },
                  { label: 'Khóa', value: 0 },
                ]}
                required
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default AddOrEditAccount;
