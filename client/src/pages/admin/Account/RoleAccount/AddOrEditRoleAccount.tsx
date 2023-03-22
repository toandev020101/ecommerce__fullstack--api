import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Breadcrumbs, Checkbox, FormControlLabel, FormGroup, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiEdit as BiEditIcon } from 'react-icons/bi';
import { FiPlusSquare as FiPlusSquareIcon } from 'react-icons/fi';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import * as permissionApi from '../../../../apis/permissionApi';
import * as roleApi from '../../../../apis/roleApi';
import { useAppDispatch } from '../../../../app/hook';
import CheckBoxField from '../../../../components/CheckBoxField';
import InputField from '../../../../components/InputField';
import TitlePage from '../../../../components/TitlePage';
import ToastNotify from '../../../../components/ToastNotify';
import { BaseResponse } from '../../../../interfaces/BaseResponse';
import { FieldError } from '../../../../interfaces/FieldError';
import { RolePermissionInput } from '../../../../interfaces/RolePermissionInput';
import { Permission } from '../../../../models/Permission';
import { Role } from '../../../../models/Role';
import { showToast } from '../../../../slices/toastSlice';
import { Theme } from '../../../../theme';
import roleSchema from '../../../../validations/roleSchema';

const AddOrEditRoleAccount: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme: Theme = useTheme();
  const { id } = useParams();

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FieldError[]>([]);

  const [isCheckedAll, setIsCheckedAll] = useState<boolean>(false);
  const [isIndeterminate, setIsIndeterminate] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);

  const form = useForm<RolePermissionInput>({
    defaultValues: {
      name: '',
    },
    resolver: yupResolver(roleSchema),
  });

  useEffect(() => {
    const getAllPermission = async () => {
      try {
        const res = await permissionApi.getAll();
        const resData = res.data as Permission[];
        setPermissions(resData);

        // default data
        for (let i = 0; i < resData.length; i++) {
          form.setValue(`checkbox${resData[i].id}`, false);
        }
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getAllPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  useEffect(() => {
    // check mode add or edit
    const { pathname } = location;
    const slugArr = pathname.split('/');
    const mode = slugArr[slugArr.length - 2];

    const getOneAndPermissionById = async () => {
      try {
        const res = await roleApi.getOneAndPermissionById(parseInt(id as string));

        const resData = res.data as Role;
        form.setValue('name', resData.name);

        resData.rolePermissions?.map((rolePermission) => {
          form.setValue(`checkbox${rolePermission.permissionId}`, true);
          return null;
        });
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 404 || data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    if (mode === 'chinh-sua') {
      getOneAndPermissionById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, location, navigate, permissions]);

  useEffect(() => {
    // checked indeterminate
    let checkedNum = 0;
    for (let i = 0; i < permissions.length; i++) {
      if (form.getValues(`checkbox${permissions[i].id}`)) {
        checkedNum++;
      }
    }

    setIsIndeterminate(checkedNum > 0 && checkedNum < permissions.length);
    setIsCheckedAll(checkedNum === permissions.length);
  }, [reload, permissions, form]);

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      for (let i = 0; i < permissions.length; i++) {
        form.setValue(`checkbox${permissions[i].id}`, true);
      }
      setIsCheckedAll(true);

      return;
    }

    for (let i = 0; i < permissions.length; i++) {
      form.setValue(`checkbox${permissions[i].id}`, false);
    }
    setIsCheckedAll(false);
  };

  const handleCheckBoxClick = (id: number) => {
    form.setValue(`checkbox${id}`, !form.getValues(`checkbox${id}`));
    setReload(!reload);
  };

  const handleAddOrEditSubmit = async (values: RolePermissionInput) => {
    setIsLoading(true);
    setErrors([]);

    const newValues: RolePermissionInput = {
      name: values.name,
      permissionIds: [],
    };

    for (let i = 0; i < permissions.length; i++) {
      if (values[`checkbox${permissions[i].id}`]) {
        newValues.permissionIds.push(permissions[i].id);
      }
    }

    try {
      let res: BaseResponse;
      if (id) {
        res = await roleApi.updateOne(parseInt(id), newValues);
      } else {
        res = await roleApi.addOne(newValues);
      }
      setIsLoading(false);

      dispatch(
        showToast({
          page: 'roleAccount',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'roleAccountId' },
        }),
      );
      navigate('/quan-tri/tai-khoan/vai-tro');
    } catch (error: any) {
      setIsLoading(false);
      const { data } = error.response;

      if (data.code === 403 || data.code === 400) {
        setErrors(data.errors);
        dispatch(
          showToast({
            page: 'addOrEditRoleAccount',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'addOrEditRoleAccountId' },
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
      <TitlePage title={`${id ? 'Chỉnh sửa' : 'Thêm mới'} vai trò`} />
      <ToastNotify name="addOrEditRoleAccount" />
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: '20px' }}>
        <Link to="/quan-tri/tai-khoan/vai-tro">Danh sách</Link>
        <Typography color="text.primary">{id ? 'Chỉnh sửa' : 'Thêm mới'}</Typography>
      </Breadcrumbs>

      <Box display="flex" justifyContent="center" alignItems="center">
        <Box
          padding="20px"
          bgcolor={theme.palette.neutral[1000]}
          sx={{ boxShadow: 'rgba(58, 53, 65, 0.1) 0px 2px 10px 0px', borderRadius: '5px' }}
          component="form"
          onSubmit={form.handleSubmit(handleAddOrEditSubmit)}
          width="1200px"
        >
          <Box display="flex" justifyContent="center">
            <Box width="500px">
              <InputField form={form} errorServers={errors} name="name" label="Tên vai trò" required />
            </Box>
          </Box>
          <Typography variant="h4" margin="20px 0">
            Quyền của vai trò
          </Typography>

          <Box width="150px">
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isCheckedAll}
                    indeterminate={isIndeterminate}
                    onChange={handleSelectAllChange}
                    sx={{
                      color: theme.palette.primary[500],
                      '&.Mui-checked': {
                        color: theme.palette.primary[400],
                      },
                    }}
                  />
                }
                label="Chọn tất cả"
              />
            </FormGroup>
          </Box>

          <Box display="grid" gridTemplateColumns="repeat(4,1fr)" columnGap="10px" alignItems="center">
            {permissions.map((permission, index) => (
              <CheckBoxField
                key={`permission-${index}`}
                form={form}
                name={`checkbox${permission.id}`}
                label={permission.name}
                onClick={() => handleCheckBoxClick(permission.id)}
              />
            ))}
          </Box>
          <Box display="flex" justifyContent="center">
            <LoadingButton
              variant="contained"
              type="submit"
              loading={isLoading}
              startIcon={id ? <BiEditIcon /> : <FiPlusSquareIcon />}
              loadingPosition="start"
              sx={{
                backgroundColor: theme.palette.primary[500],
                color: theme.palette.neutral[1000],
                marginTop: '30px',
              }}
            >
              {id ? 'Cập nhật' : 'Thêm mới'}
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AddOrEditRoleAccount;
