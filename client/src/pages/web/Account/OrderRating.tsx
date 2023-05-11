import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Container, Rating, Typography, useTheme } from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiStar as BiStarIcon, BiCamera as BiCameraIcon, BiXCircle as BiXCircleIcon } from 'react-icons/bi';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import * as reviewApi from '../../../apis/reviewApi';
import * as userApi from '../../../apis/userApi';
import * as mediaApi from '../../../apis/mediaApi';
import { useAppDispatch, useAppSelector } from '../../../app/hook';
import TitlePage from '../../../components/TitlePage';
import { ReviewInput } from '../../../interfaces/ReviewInput';
import { Review } from '../../../models/Review';
import { User } from '../../../models/User';
import { selectIsReload } from '../../../slices/globalSlice';
import { showToast } from '../../../slices/toastSlice';
import { Theme } from '../../../theme';
import JWTManager from '../../../utils/jwt';
import reviewSchema from '../../../validations/reviewSchema';
import Sidebar from './Sidebar';
import InputField from '../../../components/InputField';
import { FieldError } from '../../../interfaces/FieldError';
import { ProductItem } from '../../../models/Product';
import { LoadingButton } from '@mui/lab';
import { BaseResponse } from '../../../interfaces/BaseResponse';
import ToastNotify from '../../../components/ToastNotify';

const OrderRating: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const theme: Theme = useTheme();
  const isReload = useAppSelector(selectIsReload);
  const { orderLinedId } = useParams();

  const [user, setUser] = useState<User>();
  const [review, setReview] = useState<Review>();
  const [productItem, setProductItem] = useState<ProductItem>();

  const [ratingNumber, setRatingNumber] = useState<number | null>(3);
  const [ratingHover, setRatingHover] = useState<number>(-1);
  const [images, setImages] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FieldError[]>([]);

  const form = useForm<ReviewInput>({
    defaultValues: {
      ratingValue: 3,
      orderLinedId: parseInt(orderLinedId as string),
      comment: '',
      images: [],
      type: 0,
    },
    resolver: yupResolver(reviewSchema),
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

  useEffect(() => {
    if (!location.state || !location.state.productItem) {
      dispatch(
        showToast({
          page: 'orderHistory',
          type: 'error',
          message: 'Vui lòng chọn sản phẩm',
          options: { theme: 'colored', toastId: 'orderHistoryId' },
        }),
      );

      navigate('/nguoi-dung/don-hang');
    } else if (location.state && location.state.productItem) {
      setProductItem(location.state.productItem as ProductItem);
    }
  }, [location.state, dispatch, navigate]);

  useEffect(() => {
    const getOneReview = async () => {
      try {
        const res = await reviewApi.getOneByOrderLinedId(parseInt(orderLinedId as string));
        const resData = res.data as Review;
        setReview(resData);
        setRatingNumber(resData.ratingValue);

        const newImages = resData.reviewImages.map((reviewImage) => reviewImage.imageUrl);
        setImages(newImages);

        form.reset({
          ratingValue: resData.ratingValue,
          orderLinedId: resData.orderLinedId,
          comment: resData.comment,
          images: newImages,
        });
      } catch (error: any) {
        const { data } = error.response;

        if (data.code === 403) {
          dispatch(
            showToast({
              page: 'orderRating',
              type: 'error',
              message: data.message,
              options: { theme: 'colored', toastId: 'orderRatingId' },
            }),
          );
          navigate('/nguoi-dung/don-hang');
        } else if (data.code === 401 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getOneReview();
  }, [navigate, dispatch, orderLinedId, form]);

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

  const handleImagesChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // upload file
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        formData.append('files', file);
      }

      try {
        const res = await mediaApi.addAny(formData);
        const resData = res.data as string[];

        setImages([...images, ...resData]);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleAddOrEditSubmit = async (values: ReviewInput) => {
    setIsLoading(true);
    values.ratingValue = ratingNumber as number;
    values.images = images;

    try {
      let res: BaseResponse;
      if (review) {
        res = await reviewApi.updateOne(review.id, values);
      } else {
        res = await reviewApi.addOne(values);
      }

      dispatch(
        showToast({
          page: 'orderHistory',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'orderHistoryId' },
        }),
      );

      navigate('/nguoi-dung/don-hang');
    } catch (error: any) {
      const { data } = error.response;
      if (data.code === 400 || data.code === 403) {
        if (data.code === 400) {
          setErrors(data.errors);
        }

        dispatch(
          showToast({
            page: 'orderRating',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'orderRatingId' },
          }),
        );
      } else if (data.code === 401 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  return (
    <>
      <TitlePage
        title={`Đánh giá sản phẩm ${review ? review.orderLine.productItem.product.name : productItem?.product?.name}`}
      />
      <ToastNotify name="orderRating" />

      <Box bgcolor={theme.palette.neutral[950]} padding="20px 0">
        <Container maxWidth="lg">
          <Box display="flex" gap="20px">
            <Sidebar user={user} />
            <Box
              padding="15px 30px"
              boxShadow="0 1px 2px 0 rgba(0,0,0,.13)"
              borderRadius="5px"
              bgcolor={theme.palette.common.white}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              flex={1}
              gap="20px"
              component="form"
              onSubmit={form.handleSubmit(handleAddOrEditSubmit)}
            >
              <Typography variant="h4" sx={{ textAlign: 'center' }}>
                Đánh giá sản phẩm
              </Typography>

              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap="10px">
                <img
                  src={review ? review.orderLine.productItem.imageUrl : productItem?.imageUrl}
                  alt={review ? review.orderLine.productItem.product.name : productItem?.product?.name}
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
                <Typography fontSize="16px">
                  {review ? review.orderLine.productItem.product.name : productItem?.product?.name}
                </Typography>
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

              <Button variant="contained" startIcon={<BiCameraIcon />} component="label">
                Chọn hình ảnh
                <input hidden accept="image/*" multiple type="file" onChange={handleImagesChange} />
              </Button>

              <Box display="flex" gap="10px" maxWidth="600px" flexWrap="wrap">
                {images.map((image, index) => (
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
                      src={image}
                      alt={image}
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

              <Box display="flex" gap="10px">
                <LoadingButton
                  variant="contained"
                  loading={isLoading}
                  loadingIndicator="Đang gửi..."
                  type="submit"
                  sx={{
                    backgroundColor: theme.palette.primary[500],
                    color: theme.palette.neutral[1000],
                  }}
                >
                  Gửi đánh giá
                </LoadingButton>

                <Button variant="contained" color="error" onClick={() => navigate('/nguoi-dung/don-hang')}>
                  Hủy
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default OrderRating;
