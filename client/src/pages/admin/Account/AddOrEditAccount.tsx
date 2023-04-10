import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Avatar, Box, Breadcrumbs, Button, Grid, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiEdit as BiEditIcon, BiReset as BiResetIcon } from 'react-icons/bi';
import { FiPlusSquare as FiPlusSquareIcon } from 'react-icons/fi';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import * as userApi from '../../../apis/userApi';
import * as roleApi from '../../../apis/roleApi';
import * as provinceApi from '../../../apis/provinceApi';
import * as districtApi from '../../../apis/districtApi';
import * as wardApi from '../../../apis/wardApi';
import { useAppDispatch } from '../../../app/hook';
import InputField from '../../../components/InputField';
import MediaDialog from '../../../components/MediaDialog';
import RadioGroupField from '../../../components/RadioGroupField';
import SelectField from '../../../components/SelectField';
import TitlePage from '../../../components/TitlePage';
import ToastNotify from '../../../components/ToastNotify';
import { FieldError } from '../../../interfaces/FieldError';
import { UserInput } from '../../../interfaces/UserInput';
import { Role } from '../../../models/Role';
import { User } from '../../../models/User';
import { showToast } from '../../../slices/toastSlice';
import { Theme } from '../../../theme';
import userSchema from '../../../validations/userSchema';
import { ValueObject } from '../../../interfaces/ValueObject';
import { BaseResponse } from '../../../interfaces/BaseResponse';

const AddOrEditAccount: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme: Theme = useTheme();
  const { id } = useParams();

  const [avatar, setAvatar] = useState<string>('');
  const [isOpenMediaDialog, setIsOpenMediaDialog] = useState<boolean>(false);

  const [roles, setRoles] = useState<ValueObject[]>([]);
  const [provinces, setProvinces] = useState<ValueObject[]>([]);
  const [wards, setWards] = useState<ValueObject[]>([]);
  const [districts, setDistricts] = useState<ValueObject[]>([]);

  const [provinceId, setProvinceId] = useState<number | null>(null);
  const [districtId, setDistrictId] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FieldError[]>([]);

  const form = useForm<UserInput>({
    defaultValues: {
      fullName: '',
      username: '',
      password: '',
      gender: 0,
      email: '',
      avatar: '',
      phoneNumber: '',
      street: '',
      provinceId: '',
      districtId: '',
      wardId: '',
      isActive: 1,
      roleId: '',
    },
    resolver: yupResolver(userSchema),
  });

  useEffect(() => {
    const getAllRole = async () => {
      try {
        const res = await roleApi.getAll();
        const resData = res.data as Role[];
        let data: ValueObject[] = [];

        for (let i = 0; i < resData.length; i++) {
          data.push({ label: resData[i].name, value: resData[i].id });
          if (resData[i].name === 'Khách hàng') {
            form.setValue('roleId', resData[i].id);
          }
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
  }, [form, navigate]);

  useEffect(() => {
    const getAllProvince = async () => {
      try {
        const res = await provinceApi.getAll();
        const resData = res.data as Role[];
        let data: ValueObject[] = [{ label: 'Chọn tỉnh, thành phố', value: '' }];

        for (let i = 0; i < resData.length; i++) {
          data.push({ label: resData[i].name, value: resData[i].id });
        }
        setProvinces(data);

        form.setValue('districtId', '');
        form.setValue('wardId', '');
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getAllProvince();
  }, [form, navigate]);

  useEffect(() => {
    const getListDistrict = async () => {
      try {
        const res = await districtApi.getListByProvinceId(provinceId as number);
        const resData = res.data as Role[];
        let data: ValueObject[] = [{ label: 'Chọn quận, huyện', value: '' }];

        for (let i = 0; i < resData.length; i++) {
          data.push({ label: resData[i].name, value: resData[i].id });
        }
        setDistricts(data);
        form.setValue('wardId', '');
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getListDistrict();
  }, [form, provinceId, navigate]);

  useEffect(() => {
    const getListWard = async () => {
      try {
        const res = await wardApi.getListByDistrictId(districtId as number);
        const resData = res.data as Role[];
        let data: ValueObject[] = [{ label: 'Chọn phường, xã', value: '' }];

        for (let i = 0; i < resData.length; i++) {
          data.push({ label: resData[i].name, value: resData[i].id });
        }
        setWards(data);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getListWard();
  }, [districtId, navigate]);

  useEffect(() => {
    // check mode add or edit
    const { pathname } = location;
    const slugArr = pathname.split('/');
    const mode = slugArr[slugArr.length - 2];

    const getOneUser = async () => {
      try {
        const res = await userApi.getOneAndRoleById(parseInt(id as string));
        const resData = res.data as User;

        setAvatar(resData.avatar as string);
        setProvinceId(resData.provinceId as number);
        setDistrictId(resData.districtId as number);

        setTimeout(() => {
          form.reset({
            fullName: resData ? resData.fullName : '',
            username: resData ? resData.username : '',
            gender: resData ? resData.gender : 0,
            email: resData.email ? resData.email : '',
            avatar: resData.avatar ? resData.avatar : '',
            phoneNumber: resData.phoneNumber ? resData.phoneNumber : '',
            street: resData.street ? resData.street : '',
            provinceId: resData.provinceId ? resData.provinceId : '',
            districtId: resData.districtId ? resData.districtId : '',
            wardId: resData.wardId ? resData.wardId : '',
            isActive: resData ? resData.isActive : 1,
            roleId: resData ? resData.roleId?.toString() : (form.getValues('roleId') as string),
          });
        }, 500);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 404 || data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    if (mode === 'chinh-sua') {
      getOneUser();
    }
  }, [dispatch, form, id, location, navigate]);

  const handleConfirmDialog = (newAvatar: string) => {
    form.setValue('avatar', newAvatar);
    setAvatar(newAvatar);
  };

  const handleDeleteAvatar = () => {
    form.setValue('avatar', '');
    setAvatar('');
  };

  const handleAddOrEditSubmit = async (values: any) => {
    setIsLoading(true);

    for (const key in values) {
      if (values.hasOwnProperty(key) && values[key] === '') {
        values[key] = undefined;
      }
    }

    try {
      let res: BaseResponse;
      if (id) {
        res = await userApi.updateOne(parseInt(id), values);
      } else {
        res = await userApi.addOne(values);
      }

      dispatch(
        showToast({
          page: 'account',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'accountId' },
        }),
      );
      setIsLoading(false);
      navigate('/quan-tri/tai-khoan/danh-sach');
    } catch (error: any) {
      setIsLoading(false);

      const { data } = error.response;
      if (data.code === 403 || data.code === 400) {
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

      if (data.code === 401 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  const handleResetForm = () => {
    form.reset();
    setAvatar(form.getValues('avatar') as string);
  };

  return (
    <>
      <TitlePage title={`${id ? 'Chỉnh sửa' : 'Thêm mới'} tài khoản`} />
      <ToastNotify name="addOrEditAccount" />
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: '20px' }}>
        <Link to="/quan-tri/tai-khoan/danh-sach">Danh sách</Link>
        <Typography color="text.primary">{id ? 'Chỉnh sửa' : 'Thêm mới'}</Typography>
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
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              gap="20px"
              marginBottom="20px"
            >
              <Avatar
                src={avatar}
                alt={form.getValues('username')}
                sx={{ width: '150px', height: '150px', border: '1px solid #ccc' }}
              />

              <InputField
                form={form}
                errorServers={errors}
                setErrorServers={setErrors}
                name="avatar"
                label="Ảnh đại diện"
                required
                hidden
              />

              <Box display="flex" gap="20px">
                <Button
                  variant="contained"
                  sx={{ color: theme.palette.common.white, bgcolor: theme.palette.primary[500] }}
                  onClick={() => setIsOpenMediaDialog(true)}
                >
                  Thay đổi hình ảnh
                </Button>

                <Button variant="contained" color="error" onClick={handleDeleteAvatar}>
                  Xóa hình ảnh
                </Button>
              </Box>
            </Box>

            <InputField
              form={form}
              errorServers={errors}
              setErrorServers={setErrors}
              name="fullName"
              label="Họ và tên"
              required
            />
            <InputField
              form={form}
              errorServers={errors}
              setErrorServers={setErrors}
              name="username"
              label="Tên đăng nhập"
              disabled={!!id}
              required
            />

            {!id && (
              <InputField
                form={form}
                errorServers={errors}
                setErrorServers={setErrors}
                name="password"
                label="Mật khẩu"
                type="password"
                required
              />
            )}

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
                startIcon={id ? <BiEditIcon /> : <FiPlusSquareIcon />}
                loadingPosition="start"
                type="submit"
                sx={{
                  backgroundColor: theme.palette.primary[500],
                  color: theme.palette.neutral[1000],
                }}
              >
                {id ? 'Cập nhật' : 'Thêm mới'}
              </LoadingButton>
              <Button variant="contained" startIcon={<BiResetIcon />} color="secondary" onClick={handleResetForm}>
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
            <Box display="flex" gap="10px" marginBottom="10px">
              <Box width="100%">
                <InputField form={form} errorServers={errors} setErrorServers={setErrors} name="email" label="Email" />
                <Typography sx={{ color: theme.palette.neutral[400] }}>
                  Chúng tôi sẽ gửi email xác nhận đến địa chỉ email.
                </Typography>
              </Box>
              <InputField
                form={form}
                errorServers={errors}
                setErrorServers={setErrors}
                name="phoneNumber"
                label="Số điện thoại"
              />
            </Box>

            <Box display="flex" gap="10px" marginBottom="10px">
              <SelectField
                form={form}
                errorServers={errors}
                setErrorServers={setErrors}
                name="roleId"
                label="Vai trò"
                valueObjects={roles}
                required
              />

              <SelectField
                form={form}
                errorServers={errors}
                setErrorServers={setErrors}
                name="isActive"
                label="Trạng thái"
                valueObjects={[
                  { label: 'Hoạt động', value: 1 },
                  { label: 'Khóa', value: 0 },
                ]}
                required
              />
            </Box>

            <Box display="flex" gap="10px" marginBottom="10px">
              <SelectField
                form={form}
                errorServers={errors}
                setErrorServers={setErrors}
                name="provinceId"
                label="Tỉnh/thành phố"
                valueObjects={provinces}
                onHandleChange={(e: any) => setProvinceId(parseInt(e.target.value))}
                search
              />

              <SelectField
                form={form}
                errorServers={errors}
                setErrorServers={setErrors}
                name="districtId"
                label="Quận/huyện"
                valueObjects={districts}
                disabled={form.getValues('provinceId') === ''}
                onHandleChange={(e: any) => setDistrictId(parseInt(e.target.value))}
                search
              />
            </Box>

            <Box display="flex" gap="10px" marginBottom="10px">
              <SelectField
                form={form}
                errorServers={errors}
                setErrorServers={setErrors}
                name="wardId"
                label="Phường/xã"
                valueObjects={wards}
                disabled={form.getValues('districtId') === ''}
                search
              />

              <InputField
                form={form}
                errorServers={errors}
                setErrorServers={setErrors}
                name="street"
                label="Đường,số nhà"
              />
            </Box>
          </Box>
        </Grid>
      </Grid>

      <MediaDialog
        title="Ảnh đại diện"
        isOpen={isOpenMediaDialog}
        handleClose={() => setIsOpenMediaDialog(false)}
        handleConfirm={handleConfirmDialog}
      />
    </>
  );
};

export default AddOrEditAccount;
