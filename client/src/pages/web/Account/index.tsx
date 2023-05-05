import { Avatar, Box, Button, Container, Typography, useTheme } from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { BiEdit as BiEditIcon } from 'react-icons/bi';
import TitlePage from '../../../components/TitlePage';
import ToastNotify from '../../../components/ToastNotify';
import { Theme } from '../../../theme';
import Sidebar from './Sidebar';
import { User } from '../../../models/User';
import { useNavigate } from 'react-router-dom';
import JWTManager from '../../../utils/jwt';
import * as userApi from '../../../apis/userApi';
import * as provinceApi from '../../../apis/provinceApi';
import * as districtApi from '../../../apis/districtApi';
import * as wardApi from '../../../apis/wardApi';
import * as mediaApi from '../../../apis/mediaApi';
import { showToast } from '../../../slices/toastSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hook';
import InputField from '../../../components/InputField';
import { UserInput } from '../../../interfaces/UserInput';
import { FieldError } from '../../../interfaces/FieldError';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import userSchema from '../../../validations/userSchema';
import RadioGroupField from '../../../components/RadioGroupField';
import SearchField from '../../../components/SearchField';
import { ValueObject } from '../../../interfaces/ValueObject';
import { Province } from '../../../models/Province';
import { District } from '../../../models/District';
import { Ward } from '../../../models/Ward';
import { LoadingButton } from '@mui/lab';
import { selectIsReload, setIsReload } from '../../../slices/globalSlice';

const AccountProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme: Theme = useTheme();
  const isReload = useAppSelector(selectIsReload);

  const [user, setUser] = useState<User>();
  const [avatar, setAvatar] = useState<string>('');

  const [provinceOptions, setProvinceOptions] = useState<ValueObject[]>([]);
  const [districtOptions, setDistrictOptions] = useState<ValueObject[]>([]);
  const [wardOptions, setWardOptions] = useState<ValueObject[]>([]);

  const [provinceSearchValue, setProvinceSearchValue] = useState<ValueObject>();
  const [districtSearchValue, setDistrictSearchValue] = useState<ValueObject>();
  const [wardSearchValue, setWardSearchValue] = useState<ValueObject>();

  const [provinceSearchTerm, setProvinceSearchTerm] = useState<string>('');
  const [districtSearchTerm, setDistrictSearchTerm] = useState<string>('');
  const [wardSearchTerm, setWardSearchTerm] = useState<string>('');

  const [provinceId, setProvinceId] = useState<number>(-1);
  const [districtId, setDistrictId] = useState<number>(-1);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FieldError[]>([]);

  const form = useForm<UserInput>({
    defaultValues: {
      fullName: '',
      username: '',
      gender: 0,
      email: '',
      avatar: '',
      phoneNumber: '',
      street: '',
      provinceId: '',
      districtId: '',
      wardId: '',
    },
    resolver: yupResolver(userSchema),
  });

  useEffect(() => {
    const getOneUser = async () => {
      try {
        const res = await userApi.getOneAndRoleByIdPublic(JWTManager.getUserId() as number);
        const resData = res.data as User;
        setUser(resData);

        setAvatar(resData.avatar as string);

        setProvinceId(resData.provinceId ? resData.provinceId : -1);
        setDistrictId(resData.districtId ? resData.districtId : -1);

        setProvinceSearchValue({ label: resData.province?.name as string, value: resData.provinceId as number });
        setDistrictSearchValue({ label: resData.district?.name as string, value: resData.districtId as number });
        setWardSearchValue({ label: resData.ward?.name as string, value: resData.wardId as number });

        form.reset({
          fullName: resData.fullName,
          username: resData.username,
          gender: resData.gender,
          email: resData.email ? resData.email : '',
          avatar: resData.avatar ? resData.avatar : '',
          phoneNumber: resData.phoneNumber ? resData.phoneNumber : '',
          street: resData.street ? resData.street : '',
          provinceId: resData.provinceId ? resData.provinceId : '',
          districtId: resData.districtId ? resData.districtId : '',
          wardId: resData.wardId ? resData.wardId : '',
          roleId: resData.roleId,
          isActive: resData.isActive,
        });
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
  }, [navigate, dispatch, form, isReload]);

  useEffect(() => {
    const getListProvinceBySearchTerm = async () => {
      try {
        const res = await provinceApi.getListBySearchTerm(provinceSearchTerm);
        const resData = res.data as Province[];
        let data: ValueObject[] = [];

        for (let i = 0; i < resData.length; i++) {
          data.push({ label: resData[i].name, value: resData[i].id });
        }
        setProvinceOptions(data);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getListProvinceBySearchTerm();
  }, [provinceSearchTerm, navigate]);

  useEffect(() => {
    const getListDistrictByProvinceIdAndSearchTerm = async () => {
      try {
        const res = await districtApi.getListByProvinceIdAndSearchTerm(provinceId, districtSearchTerm);
        const resData = res.data as District[];
        let data: ValueObject[] = [];

        for (let i = 0; i < resData.length; i++) {
          data.push({ label: resData[i].name, value: resData[i].id });
        }
        setDistrictOptions(data);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };
    getListDistrictByProvinceIdAndSearchTerm();
  }, [districtSearchTerm, navigate, provinceId]);

  useEffect(() => {
    const getListWardByDistrictIdAndSearchTerm = async () => {
      try {
        const res = await wardApi.getListByDistrictIdAndSearchTerm(districtId, wardSearchTerm);
        const resData = res.data as Ward[];
        let data: ValueObject[] = [];

        for (let i = 0; i < resData.length; i++) {
          data.push({ label: resData[i].name, value: resData[i].id });
        }
        setWardOptions(data);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getListWardByDistrictIdAndSearchTerm();
  }, [wardSearchTerm, navigate, districtId]);

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const file = files[0];

      // upload file
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await mediaApi.addOne(formData);
        setAvatar(res.data as string);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    }
  };

  const handleProfileSubmit = async (values: any) => {
    setIsLoading(true);

    values.avatar = avatar;

    for (const key in values) {
      if (values.hasOwnProperty(key) && values[key] === '') {
        values[key] = null;
      }
    }

    try {
      const res = await userApi.updateOne(user?.id as number, values);

      dispatch(
        showToast({
          page: 'accountProfile',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'accountProfileId' },
        }),
      );
      setIsLoading(false);
      dispatch(setIsReload());
    } catch (error: any) {
      setIsLoading(false);

      const { data } = error.response;
      if (data.code === 403 || data.code === 400) {
        setErrors(data.errors);
        dispatch(
          showToast({
            page: 'accountProfile',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'accountProfileId' },
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
      <TitlePage title="Hồ sơ tài khoản" />
      <ToastNotify name="accountProfile" />
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
              onSubmit={form.handleSubmit(handleProfileSubmit)}
            >
              <Box paddingBottom="15px" borderBottom="1px solid #e0e0e0">
                <Typography fontSize="18px" sx={{ textTransform: 'capitalize', color: theme.palette.neutral[200] }}>
                  Hồ sơ của tôi
                </Typography>
                <Typography sx={{ color: theme.palette.neutral[300] }}>
                  Quản lý thông tin hồ sơ để bảo mật tài khoản
                </Typography>
              </Box>

              <Box padding="15px" marginTop="15px" display="flex">
                <Box flex={1}>
                  <Box display="flex" gap="10px">
                    <InputField
                      form={form}
                      errorServers={errors}
                      setErrorServers={setErrors}
                      name="username"
                      label="Tên đăng nhập"
                      disabled
                      required
                    />
                    <InputField
                      form={form}
                      errorServers={errors}
                      setErrorServers={setErrors}
                      name="fullName"
                      label="Họ và tên"
                      required
                    />
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

                  <Box display="flex" gap="10px" marginBottom="10px">
                    <Box width="100%">
                      <InputField
                        form={form}
                        errorServers={errors}
                        setErrorServers={setErrors}
                        name="email"
                        label="Email"
                      />
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

                  <Box display="flex" gap="10px">
                    <SearchField
                      form={form}
                      name="provinceId"
                      options={provinceOptions}
                      searchValue={provinceSearchValue}
                      label="Tìm kiếm tỉnh, thành phố"
                      onHandleChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setProvinceSearchTerm(e.target.value);
                        setDistrictSearchValue(undefined);
                        setWardSearchValue(undefined);
                      }}
                      onHandleOptionChange={(option: ValueObject) => {
                        setProvinceId(option.value as number);
                        setProvinceSearchValue(option);
                        setDistrictId(-1);
                        setDistrictSearchValue(undefined);
                        setWardSearchValue(undefined);
                      }}
                    />

                    <SearchField
                      form={form}
                      name="districtId"
                      options={districtOptions}
                      searchValue={districtSearchValue}
                      label="Tìm kiếm quận, huyện"
                      onHandleChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setDistrictSearchTerm(e.target.value);
                        setWardSearchValue(undefined);
                      }}
                      onHandleOptionChange={(option: ValueObject) => {
                        setDistrictId(option.value as number);
                        setDistrictSearchValue(option);
                        setWardSearchValue(undefined);
                      }}
                      disabled={provinceId === -1}
                    />
                  </Box>

                  <Box display="flex" gap="10px" marginBottom="10px">
                    <SearchField
                      form={form}
                      name="wardId"
                      options={wardOptions}
                      searchValue={wardSearchValue}
                      label="Tìm kiếm phường, xã"
                      onHandleChange={(e: ChangeEvent<HTMLInputElement>) => setWardSearchTerm(e.target.value)}
                      onHandleOptionChange={(option: ValueObject) => {
                        setWardSearchValue(option);
                      }}
                      disabled={districtId === -1}
                    />

                    <InputField
                      form={form}
                      errorServers={errors}
                      setErrorServers={setErrors}
                      name="street"
                      label="Số nhà, đường"
                    />
                  </Box>

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

                <Box width="300px" display="flex" flexDirection="column" alignItems="center" gap="20px">
                  <Avatar src={avatar} alt={user?.username} sx={{ width: '100px', height: '100px' }} />

                  <Button variant="contained" component="label" sx={{ textTransform: 'none' }}>
                    Chọn ảnh
                    <input accept="image/*" type="file" hidden onChange={handleAvatarChange} />
                  </Button>
                  <Box color={theme.palette.neutral[300]}>
                    <Typography>Dụng lượng file tối đa 1 MB</Typography>
                    <Typography>Định dạng:.JPEG, .PNG</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default AccountProfile;
