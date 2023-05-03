import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Breadcrumbs, Button, Typography, useTheme } from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiEdit as BiEditIcon, BiReset as BiResetIcon } from 'react-icons/bi';
import { IoMdImages as IoMdImagesIcon } from 'react-icons/io';
import { FiPlusSquare as FiPlusSquareIcon } from 'react-icons/fi';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import * as categoryApi from '../../../../apis/categoryApi';
import { useAppDispatch } from '../../../../app/hook';
import InputField from '../../../../components/InputField';
import MediaDialog from '../../../../components/MediaDialog';
import SelectField from '../../../../components/SelectField';
import TitlePage from '../../../../components/TitlePage';
import ToastNotify from '../../../../components/ToastNotify';
import { BaseResponse } from '../../../../interfaces/BaseResponse';
import { CategoryInput } from '../../../../interfaces/CategoryInput';
import { FieldError } from '../../../../interfaces/FieldError';
import { ValueObject } from '../../../../interfaces/ValueObject';
import { Category } from '../../../../models/Category';
import { showToast } from '../../../../slices/toastSlice';
import { Theme } from '../../../../theme';
import categorySchema from '../../../../validations/categorySchema';
import slugify from 'slugify';

const AddOrEditCategoryProduct: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme: Theme = useTheme();
  const { id } = useParams();

  const [imageUrl, setImageUrl] = useState<string>('');
  const [isOpenMediaDialog, setIsOpenMediaDialog] = useState<boolean>(false);
  const [parents, setParents] = useState<ValueObject[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FieldError[]>([]);

  const form = useForm<CategoryInput>({
    defaultValues: {
      imageUrl: '',
      name: '',
      slug: '',
      level: 1,
      parentId: '',
      isActive: 1,
    },
    resolver: yupResolver(categorySchema),
  });

  useEffect(() => {
    const getAllCategory = async () => {
      try {
        const res = await categoryApi.getAll();
        const resData = res.data as Category[];
        let data: ValueObject[] = [{ label: 'Chọn danh mục', value: '' }];

        for (let i = 0; i < resData.length; i++) {
          data.push({ label: resData[i].name, value: resData[i].id });
        }
        setParents(data);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getAllCategory();
  }, [navigate]);

  useEffect(() => {
    // check mode add or edit
    const { pathname } = location;
    const slugArr = pathname.split('/');
    const mode = slugArr[slugArr.length - 2];

    const getOneCategory = async () => {
      try {
        const res = await categoryApi.getOneAndParentById(parseInt(id as string));
        const resData = res.data as Category;

        setImageUrl(resData.imageUrl as string);

        setTimeout(() => {
          form.reset({
            imageUrl: resData ? resData.imageUrl : '',
            name: resData ? resData.name : '',
            slug: resData ? resData.slug : '',
            level: resData ? resData.level : '',
            parentId: resData.parentId ? resData.parentId : '',
            isActive: resData ? resData.isActive : 1,
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
      getOneCategory();
    }
  }, [dispatch, form, id, location, navigate]);

  const handleConfirmDialog = (newImageUrl: string) => {
    form.setValue('imageUrl', newImageUrl);
    setImageUrl(newImageUrl);
  };

  const handleDeleteImageUrl = () => {
    form.setValue('imageUrl', '');
    setImageUrl('');
  };

  const handleAddOrEditSubmit = async (values: any) => {
    setIsLoading(true);

    for (const key in values) {
      if (values.hasOwnProperty(key) && values[key] === '') {
        values[key] = null;
      }
    }

    try {
      let res: BaseResponse;
      if (id) {
        res = await categoryApi.updateOne(parseInt(id), values);
      } else {
        res = await categoryApi.addOne(values);
      }

      dispatch(
        showToast({
          page: 'categoryProduct',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'categoryProductId' },
        }),
      );
      setIsLoading(false);
      navigate('/quan-tri/san-pham/danh-muc');
    } catch (error: any) {
      setIsLoading(false);

      const { data } = error.response;
      if (data.code === 403 || data.code === 400) {
        setErrors(data.errors);
        dispatch(
          showToast({
            page: 'addOrEditCategoryProduct',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'addOrEditCategoryProductId' },
          }),
        );
      }

      if (data.code === 401 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  const handleCancelForm = () => {
    navigate('/quan-tri/san-pham/danh-muc');
  };

  return (
    <>
      <TitlePage title={`${id ? 'Chỉnh sửa' : 'Thêm mới'} danh mục`} />
      <ToastNotify name="addOrEditCategoryProduct" />
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: '20px' }}>
        <Link to="/quan-tri/san-pham/danh-muc">Danh sách</Link>
        <Typography color="text.primary">{id ? 'Chỉnh sửa' : 'Thêm mới'}</Typography>
      </Breadcrumbs>

      <Box display="flex" justifyContent="center" alignItems="center">
        <Box
          padding="20px"
          marginBottom="20px"
          sx={{
            bgcolor: theme.palette.neutral[1000],
            boxShadow: `${theme.palette.neutral[700]} 0px 2px 10px 0px`,
            borderRadius: '5px',
            width: '600px',

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
          component="form"
          onSubmit={form.handleSubmit(handleAddOrEditSubmit)}
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            gap="20px"
            marginBottom="20px"
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={form.getValues('name')}
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'cover',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                }}
              />
            ) : (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                  width: '150px',
                  height: '150px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  bgcolor: theme.palette.neutral[900],
                }}
              >
                <IoMdImagesIcon fontSize="60px" style={{ color: theme.palette.neutral[400] }} />
              </Box>
            )}

            <InputField
              form={form}
              errorServers={errors}
              setErrorServers={setErrors}
              name="imageUrl"
              label="Hình ảnh danh mục"
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

              <Button variant="contained" color="error" onClick={handleDeleteImageUrl}>
                Xóa hình ảnh
              </Button>
            </Box>
          </Box>

          <InputField
            form={form}
            errorServers={errors}
            setErrorServers={setErrors}
            name="name"
            label="Tên danh mục"
            onHandleChange={(e: ChangeEvent<HTMLInputElement>) =>
              form.setValue('slug', slugify(e.target.value, { lower: true, locale: 'vi', trim: true }))
            }
            required
          />
          <InputField
            form={form}
            errorServers={errors}
            setErrorServers={setErrors}
            name="slug"
            label="Đường dẫn"
            required
          />
          <Box display="flex" gap="10px">
            <InputField
              form={form}
              errorServers={errors}
              setErrorServers={setErrors}
              name="level"
              label="Vị trí"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{ min: 1, max: 99 }}
              required
            />

            <SelectField
              form={form}
              errorServers={errors}
              setErrorServers={setErrors}
              name="isActive"
              label="Trạng thái"
              valueObjects={[
                { label: 'Hiện', value: 1 },
                { label: 'Ẩn', value: 0 },
              ]}
              required
            />
          </Box>

          <SelectField
            form={form}
            errorServers={errors}
            setErrorServers={setErrors}
            name="parentId"
            label="Danh mục cha"
            valueObjects={parents}
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
            <Button variant="contained" startIcon={<BiResetIcon />} color="error" onClick={handleCancelForm}>
              Hủy
            </Button>
          </Box>
        </Box>
      </Box>

      <MediaDialog
        title="Hình ảnh danh mục"
        isOpen={isOpenMediaDialog}
        handleClose={() => setIsOpenMediaDialog(false)}
        handleConfirm={handleConfirmDialog}
      />
    </>
  );
};

export default AddOrEditCategoryProduct;
