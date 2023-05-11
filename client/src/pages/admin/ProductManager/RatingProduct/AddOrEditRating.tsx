import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Breadcrumbs,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Radio,
  Rating,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  BiCamera as BiCameraIcon,
  BiEdit as BiEditIcon,
  BiReset as BiResetIcon,
  BiStar as BiStarIcon,
  BiXCircle as BiXCircleIcon,
} from 'react-icons/bi';
import { FiPlusSquare as FiPlusSquareIcon } from 'react-icons/fi';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import * as reviewApi from '../../../../apis/reviewApi';
import * as orderLineApi from '../../../../apis/orderLineApi';
import { useAppDispatch } from '../../../../app/hook';
import InputField from '../../../../components/InputField';
import MediaDialog from '../../../../components/MediaDialog';
import TitlePage from '../../../../components/TitlePage';
import ToastNotify from '../../../../components/ToastNotify';
import { BaseResponse } from '../../../../interfaces/BaseResponse';
import { FieldError } from '../../../../interfaces/FieldError';
import { ReviewInput } from '../../../../interfaces/ReviewInput';
import { ProductItem } from '../../../../models/Product';
import { Review } from '../../../../models/Review';
import { showToast } from '../../../../slices/toastSlice';
import { Theme } from '../../../../theme';
import reviewSchema from '../../../../validations/reviewSchema';
import { ValueObject } from '../../../../interfaces/ValueObject';
import { OrderLine } from '../../../../models/Order';

const AddOrEditRating: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme: Theme = useTheme();
  const { id } = useParams();

  const [productItem, setProductItem] = useState<ProductItem>();
  const [orderLineValue, setOrderLineValue] = useState<OrderLine>();
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);
  const [productOptions, setProductOptions] = useState<ValueObject[]>([]);
  const [productSearchTerm, setProductSearchTerm] = useState<string>('');

  const [orderLineActives, setOrderLineActives] = useState<OrderLine[]>([]);
  const [isOpenProductDialog, setIsOpenProductDialog] = useState<boolean>(false);

  const [ratingNumber, setRatingNumber] = useState<number | null>(3);
  const [ratingHover, setRatingHover] = useState<number>(-1);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isOpenMediaDialog, setIsOpenMediaDialog] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FieldError[]>([]);

  const form = useForm<ReviewInput>({
    defaultValues: {
      ratingValue: 3,
      orderLinedId: 1,
      comment: '',
      images: [],
      type: 0,
    },
    resolver: yupResolver(reviewSchema),
  });

  useEffect(() => {
    // check mode add or edit
    const { pathname } = location;
    const slugArr = pathname.split('/');
    const mode = slugArr[slugArr.length - 2];

    const getOneReview = async () => {
      try {
        const res = await reviewApi.getOneById(parseInt(id as string));
        const resData = res.data as Review;
        setProductItem(resData.orderLine.productItem as ProductItem);

        setRatingNumber(resData.ratingValue);

        const newImageUrls = resData.reviewImages.map((reviewImage) => reviewImage.imageUrl);
        setImageUrls(newImageUrls);

        form.reset({
          ratingValue: resData.ratingValue,
          orderLinedId: resData.orderLinedId,
          comment: resData.comment,
          images: newImageUrls,
        });
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 404 || data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    if (mode === 'chinh-sua') {
      getOneReview();
    }
  }, [dispatch, form, id, location, navigate]);

  const handleProductSearchTermChange = async (searchTerm: string) => {
    try {
      const res = await orderLineApi.getListBySearchTerm(searchTerm);
      const resData = res.data as OrderLine[];
      setOrderLines(resData);
      let data: ValueObject[] = [];

      for (let i = 0; i < resData.length; i++) {
        const optionIndex = data.findIndex((option) => option.value === resData[i].productItem.product.id);
        if (optionIndex === -1) {
          data.push({ label: resData[i].productItem.product.name, value: resData[i].productItem.product.id });
        }
      }
      setProductOptions(data);
    } catch (error: any) {
      const { data } = error.response;
      if (data.code === 401 || data.code === 403 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  const handleProductDialogClose = () => {
    setIsOpenProductDialog(false);
  };

  const labels: { [index: string]: string } = {
    1: 'Rất tệ',
    2: 'Tệ',
    3: 'Bình thường',
    4: 'Tốt',
    5: 'Rất tốt',
  };

  const getLabelText = (value: number) => {
    return `${labels[value]}`;
  };

  const handleConfirmDialog = (newImageUrls: string[]) => {
    form.setValue('images', newImageUrls);
    setImageUrls(newImageUrls);
  };

  const handleRemoveImage = (index: number) => {
    const newImageUrls = [...imageUrls];
    newImageUrls.splice(index, 1);
    setImageUrls(newImageUrls);
    form.setValue('images', newImageUrls);
  };

  const handleAddOrEditSubmit = async (values: any) => {
    setIsLoading(true);
    values.ratingValue = ratingNumber as number;

    for (const key in values) {
      if (values.hasOwnProperty(key) && values[key] === '') {
        values[key] = null;
      }
    }

    try {
      let res: BaseResponse;
      if (id) {
        res = await reviewApi.updateOne(parseInt(id), values);
      } else {
        res = await reviewApi.addOne(values);
      }

      dispatch(
        showToast({
          page: 'rating',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'ratingId' },
        }),
      );
      setIsLoading(false);
      navigate('/quan-tri/san-pham/danh-gia');
    } catch (error: any) {
      setIsLoading(false);

      const { data } = error.response;
      if (data.code === 403 || data.code === 400) {
        setErrors(data.errors);
        dispatch(
          showToast({
            page: 'addOrEditRating',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'addOrEditRatingId' },
          }),
        );
      }

      if (data.code === 401 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  const handleCancelForm = () => {
    navigate('/quan-tri/san-pham/danh-gia');
  };

  return (
    <>
      <TitlePage title={`${id ? 'Chỉnh sửa' : 'Thêm mới'} đánh giá`} />
      <ToastNotify name="addOrEditRating" />
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: '20px' }}>
        <Link to="/quan-tri/san-pham/danh-gia">Danh sách</Link>
        <Typography color="text.primary">{id ? 'Chỉnh sửa' : 'Thêm mới'}</Typography>
      </Breadcrumbs>

      <Box display="flex" justifyContent="center" alignItems="center">
        <Box
          padding="20px"
          marginBottom="20px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap="10px"
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
          {!id && (
            <>
              <Button
                variant="contained"
                onClick={() => {
                  setIsOpenProductDialog(true);
                }}
              >
                Chọn sản phẩm
              </Button>

              <Dialog
                open={isOpenProductDialog}
                onClose={handleProductDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title" sx={{ fontSize: '18px' }}>
                  Chọn sản phẩm đánh giá
                </DialogTitle>
                <DialogContent sx={{ width: '500px' }}>
                  <Autocomplete
                    disableClearable
                    id="tags-outlined"
                    options={productOptions}
                    getOptionLabel={(option) => option.label}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label="Tìm kiếm sản phẩm"
                        required
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const newProductSearchTerm = e.target.value;
                          setProductSearchTerm(newProductSearchTerm);
                          handleProductSearchTermChange(newProductSearchTerm);
                        }}
                      />
                    )}
                    popupIcon=""
                    noOptionsText={productSearchTerm.length < 3 ? `Vui lòng nhập 3 hoặc nhiều ký tự` : 'Không tìm thấy'}
                    sx={{ margin: '10px 0' }}
                    value={productOptions.find(
                      (option) =>
                        orderLineActives.length > 0 && option.value === orderLineActives[0].productItem.product.id,
                    )}
                    onChange={(_e: any, option: ValueObject | null) => {
                      if (option) {
                        const id = option.value;
                        const newOrderLineActives = orderLines.filter(
                          (orderLine) => orderLine.productItem.product.id === id,
                        );
                        setOrderLineActives(newOrderLineActives);
                      }
                    }}
                  />

                  {orderLineActives && (
                    <Box display="flex" flexDirection="column" gap="10px">
                      {orderLineActives.map((orderLine, index) => {
                        return (
                          <Box
                            key={`orderLine-item-${index}`}
                            component="label"
                            htmlFor={`orderLine-item-${index}`}
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Box display="flex" alignItems="center" gap="10px">
                              <img
                                src={orderLine.productItem.imageUrl}
                                alt={orderLine.productItem.product.name}
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  objectFit: 'cover',
                                  border: '1px solid #e0e0e0',
                                  borderRadius: '3px',
                                }}
                              />
                              <Box>
                                <Typography>{orderLine.productItem.product.name}</Typography>
                                <Typography>{orderLine.variation}</Typography>
                              </Box>
                            </Box>
                            <Radio
                              id={`orderLine-item-${index}`}
                              checked={orderLineValue?.id === orderLine.id}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                if (parseInt(e.target.value) === orderLine.id) {
                                  setOrderLineValue(orderLine);
                                }
                              }}
                              value={orderLine.id}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setProductItem(orderLineValue?.productItem as ProductItem);
                      form.setValue('orderLinedId', orderLineValue?.id as number);
                      handleProductDialogClose();
                    }}
                  >
                    Xác nhận
                  </Button>
                  <Button variant="outlined" onClick={handleProductDialogClose} color="error">
                    Hủy
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}

          {productItem && (
            <>
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap="10px">
                <img
                  src={productItem?.imageUrl}
                  alt={productItem?.product?.name}
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
                <Typography fontSize="16px">{productItem?.product?.name}</Typography>
              </Box>

              <Rating
                name="hover-feedback"
                value={ratingNumber}
                getLabelText={getLabelText}
                onChange={(_event, newValue) => {
                  setRatingNumber(newValue);
                }}
                onChangeActive={(_event, newHover) => {
                  setRatingHover(newHover);
                }}
                emptyIcon={<BiStarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
              />
              {ratingNumber !== null && (
                <Typography>{labels[ratingHover !== -1 ? ratingHover : ratingNumber]}</Typography>
              )}

              <Box width="400px">
                <InputField
                  form={form}
                  errorServers={errors}
                  setErrorServers={setErrors}
                  name="comment"
                  label="Nội dung"
                  placeholder="Mời bạn chia sẻ một số cảm nhận về sản phẩm ..."
                  required
                  multiline
                  maxRows={4}
                />
              </Box>

              <Button variant="contained" startIcon={<BiCameraIcon />} onClick={() => setIsOpenMediaDialog(true)}>
                Chọn hình ảnh
              </Button>

              <Box display="flex" gap="10px" maxWidth="600px" flexWrap="wrap">
                {imageUrls.map((imageUrl, index) => (
                  <Box
                    key={`image-item-${index}`}
                    width="100px"
                    height="100px"
                    sx={{
                      position: 'relative',
                      '&:hover div': {
                        display: 'block',
                      },
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt={imageUrl}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        border: '1px solid #e0e0e0',
                        borderRadius: '3px',
                      }}
                    />
                    <Box
                      display="none"
                      position="absolute"
                      bgcolor={theme.palette.common.white}
                      sx={{
                        top: '-8px',
                        right: '-8px',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',

                        '&:hover': {
                          color: theme.palette.error.main,
                          cursor: 'pointer',
                        },
                      }}
                      onClick={() => handleRemoveImage(index)}
                    >
                      <BiXCircleIcon fontSize="20px" />
                    </Box>
                  </Box>
                ))}
              </Box>
            </>
          )}

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
        title="Thư viện hình ảnh sản phẩm"
        isOpen={isOpenMediaDialog}
        handleClose={() => setIsOpenMediaDialog(false)}
        selectedValues={imageUrls}
        handleConfirm={handleConfirmDialog}
        multiple
      />
    </>
  );
};

export default AddOrEditRating;
