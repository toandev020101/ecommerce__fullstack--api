import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Checkbox,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Pagination,
  Rating,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import parseToHTML from 'html-react-parser';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { AiOutlineMinus as AiOutlineMinusIcon, AiOutlinePlus as AiOutlinePlusIcon } from 'react-icons/ai';
import { BiSearchAlt as BiSearchAltIcon, BiX as BiXIcon } from 'react-icons/bi';
import { FaStar as FaStarIcon } from 'react-icons/fa';
import { MdAddShoppingCart as MdAddShoppingCartIcon } from 'react-icons/md';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as cartItemApi from '../apis/cartItemApi';
import * as productApi from '../apis/productApi';
import * as reviewApi from '../apis/reviewApi';
import { useAppDispatch } from '../app/hook';
import { CartItemInput } from '../interfaces/CartItemInput';
import { Product } from '../models/Product';
import { Review } from '../models/Review';
import { setIsReload } from '../slices/globalSlice';
import { showToast } from '../slices/toastSlice';
import { Theme } from '../theme';
import { dateToString, toDate } from '../utils/date';
import { priceFormat } from '../utils/format';
import Carousel from './Carousel';
import TitlePage from './TitlePage';
import ToastNotify from './ToastNotify';

const orderReview = 'desc';
const sortReview = 'id';
const limitReview = 5;

const ProductDetail: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme: Theme = useTheme();
  const { categorySlug, productSlug } = useParams();

  const sliderSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    infinite: false,
    speed: 500,
  };

  const [product, setProduct] = useState<Product>();
  const [colors, setColors] = useState<{ name: string; imageUrl: string; library: string[] }[]>([]);
  const [colorActive, setColorActive] = useState<number>(0);
  const [resetCarousel, setResetCarousel] = useState<boolean>();
  const [openDescriptionDialog, setOpenDescriptionDialog] = useState<boolean>(false);

  const [variations, setVariations] = useState<{ id: number; options: { name: string; slug: string }[] }[]>([]);
  const [itemActive, setItemActive] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [ratingAvgNumber, setRatingAvgNumber] = useState<number>(0);
  const [ratingPeople, setRatingPeople] = useState<number>(0);
  const [ratingStars, setRatingStars] = useState<
    {
      number: number;
      percent: number;
    }[]
  >([
    {
      number: 5,
      percent: 0,
    },
    {
      number: 4,
      percent: 0,
    },
    {
      number: 3,
      percent: 0,
    },
    {
      number: 2,
      percent: 0,
    },
    {
      number: 1,
      percent: 0,
    },
  ]);
  const [ratingImages, setRatingImages] = useState<string[]>([]);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalReview, setTotalReview] = useState<number>(0);

  const [reviewPage, setReviewPage] = useState(0);
  const [searchTermReview, setSearchTermReview] = useState<string>('');
  const [reviewStar, setReviewStar] = useState(0);
  const [isReviewImage, setIsReviewImage] = useState<boolean>(false);

  useEffect(() => {
    const getOneProduct = async () => {
      try {
        const res = await productApi.getOneBySlugPublic(productSlug as string);
        setProduct(res.data as Product);
      } catch (error: any) {
        const { data } = error.response;

        if (data.code === 401 || data.code === 403 || data.code === 404 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };
    getOneProduct();
    setItemActive(0);
  }, [navigate, productSlug]);

  useEffect(() => {
    const newColors: { name: string; imageUrl: string; library: string[] }[] = [];
    const newVariations: { id: number; options: { name: string; slug: string }[] }[] = [];

    product?.productItems.forEach((productItem) => {
      productItem.productConfigurations?.forEach((productConfiguration) => {
        // handle color
        if (productConfiguration.variationOption.variation?.slug === 'mau-sac') {
          const colorIndex = newColors.findIndex(
            (newColor) => newColor.name === productConfiguration.variationOption.value,
          );

          if (colorIndex === -1) {
            const library = productItem.productImages
              ? productItem.productImages.map((productImage) => productImage.imageUrl)
              : [];

            newColors.push({
              name: productConfiguration.variationOption.value,
              imageUrl: productItem.imageUrl as string,
              library,
            });
          }
        }

        // handle variation
        const variationIndex = newVariations.findIndex(
          (variation) => variation.id === productConfiguration.variationOption.variationId,
        );

        if (variationIndex === -1) {
          newVariations.push({
            id: productConfiguration.variationOption.variationId,
            options: [
              { name: productConfiguration.variationOption.value, slug: productConfiguration.variationOption.slug },
            ],
          });
        } else {
          const variationOptionIndex = newVariations[variationIndex].options.findIndex(
            (option) => option.slug === productConfiguration.variationOption.slug,
          );

          if (variationOptionIndex === -1) {
            newVariations[variationIndex].options.push({
              name: productConfiguration.variationOption.value,
              slug: productConfiguration.variationOption.slug,
            });
          }
        }
      });
    });

    setColors(newColors);
    setVariations(newVariations);
  }, [product]);

  useEffect(() => {
    const getListReviewByProductId = async () => {
      try {
        const res = await reviewApi.getListByProductId(product?.id as number);
        const resData = res.data as Review[];

        if (resData.length > 0) {
          let totalRating = 0;
          const ratingStarCounts: {
            number: number;
            count: number;
          }[] = [
            {
              number: 5,
              count: 0,
            },
            {
              number: 4,
              count: 0,
            },
            {
              number: 3,
              count: 0,
            },
            {
              number: 2,
              count: 0,
            },
            {
              number: 1,
              count: 0,
            },
          ];
          resData.forEach((review) => {
            totalRating += review.ratingValue;
            ratingStarCounts.forEach((ratingStarCount) => {
              if (ratingStarCount.number === review.ratingValue) {
                ratingStarCount.count += 1;
              }
            });
          });

          const newRatingAvgNumber = parseFloat((totalRating / resData.length).toFixed(1));
          setRatingAvgNumber(newRatingAvgNumber);
          setRatingPeople(resData.length);

          const newRatingStars: {
            number: number;
            percent: number;
          }[] = [...ratingStars];

          newRatingStars.forEach((newRatingStar) => {
            ratingStarCounts.forEach((ratingStarCount) => {
              if (ratingStarCount.number === newRatingStar.number) {
                newRatingStar.percent = (ratingStarCount.count / resData.length) * 100;
              }
            });
          });
          setRatingStars(newRatingStars);

          let newRatingImages: string[] = [];
          resData.forEach((review) => {
            review.reviewImages.forEach((reviewImage) => {
              newRatingImages.push(reviewImage.imageUrl);
            });
          });
          setRatingImages(newRatingImages);
        }
      } catch (error: any) {
        const { data } = error.response;

        if (data.code === 401 || data.code === 403 || data.code === 404 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };
    getListReviewByProductId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, product]);

  useEffect(() => {
    const getPaginationReviewByProductId = async () => {
      try {
        const res = await reviewApi.getPaginationByProductId(product?.id as number, {
          _limit: limitReview,
          _page: reviewPage,
          _sort: sortReview,
          _order: orderReview,
          star: reviewStar,
          isImage: isReviewImage,
          searchTerm: searchTermReview,
        });
        const resData = res.data as Review[];
        if (resData.length === 0 && reviewPage > 0) {
          setReviewPage(reviewPage - 1);
        }

        setReviews(resData);
        setTotalReview(res.pagination?._total as number);
      } catch (error: any) {
        const { data } = error.response;

        if (data.code === 401 || data.code === 403 || data.code === 404 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };
    getPaginationReviewByProductId();
  }, [isReviewImage, navigate, product, reviewPage, reviewStar, searchTermReview]);

  const handleColorActiveClick = (index: number) => {
    setColorActive(index);
    setResetCarousel(resetCarousel ? !resetCarousel : true);
  };

  const handleDescriptionDialogClose = () => {
    setOpenDescriptionDialog(false);
  };

  const handleVariationOptionClick = (variationId: number, optionActiveArr: string[], optionSlug: string) => {
    optionActiveArr.forEach((optionActive, index) => {
      const variationIndex = variations.findIndex((variation) => variation.id === variationId);

      const variationOptionIndex = variations[variationIndex].options.findIndex(
        (option) => option.slug === optionActive,
      );

      if (variationOptionIndex !== -1) {
        optionActiveArr[index] = optionSlug;
        return;
      }
    });

    const SKUActive = optionActiveArr.join('_');

    product?.productItems.forEach((productItem, index) => {
      if (productItem.SKU === SKUActive) {
        setItemActive(index);
      }
    });
  };

  const handleDiscount = () => {
    const currentDate = new Date();
    const productItem = product?.productItems[itemActive];
    if (
      productItem &&
      toDate(productItem.discountStartDate) <= currentDate &&
      toDate(productItem.discountEndDate) >= currentDate
    ) {
      return true;
    }
    return false;
  };

  const handleAddCartClick = async () => {
    setIsLoading(true);

    // handle value
    const values: CartItemInput = {
      quantity,
      productItemId: product?.productItems[itemActive].id as number,
    };

    try {
      const res = await cartItemApi.addOne(values);
      dispatch(
        showToast({
          page: 'productDetail',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'productDetailId' },
        }),
      );

      setQuantity(1);
      setIsLoading(false);
      dispatch(setIsReload());
    } catch (error: any) {
      setIsLoading(false);

      const { data } = error.response;
      if (data.code === 403 || data.code === 400) {
        dispatch(
          showToast({
            page: 'productDetail',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'productDetailId' },
          }),
        );
      } else if (data.code === 401) {
        dispatch(
          showToast({
            page: 'login',
            type: 'error',
            message: 'Vui lòng đăng nhập tài khoản',
            options: { theme: 'colored', toastId: 'loginId' },
          }),
        );
        navigate('/dang-nhap');
      } else if (data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  return (
    <>
      <TitlePage title={product?.name as string} />
      <ToastNotify name="productDetail" />

      <Box bgcolor={theme.palette.neutral[950]} padding="20px 0">
        <Container maxWidth="lg">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">Trang chủ</Link>
            <Link to={`/${categorySlug}`}>{product?.category.name}</Link>
            <Typography color={theme.palette.primary[500]}>{product?.name}</Typography>
          </Breadcrumbs>

          {/* title */}
          <Box display="flex" alignItems="center" gap="10px" padding="10px 0" borderBottom="1px solid #e0e0e0">
            <Typography variant="h1" fontSize="18px" fontWeight={500}>
              {product?.name}
            </Typography>

            <Rating name="read-only" value={ratingAvgNumber} size="small" precision={0.1} readOnly />
            <Typography>{ratingPeople} đánh giá</Typography>
          </Box>
          {/* title */}

          <Box display="flex" gap="30px" marginTop="15px">
            {/* left */}
            <Box width="700px">
              {/* carousel */}
              <Carousel arrow="rectangle" arrowPadding settings={sliderSettings} resetCarousel={resetCarousel}>
                {colors[colorActive]?.library.map((imageUrl, index) => (
                  <img
                    key={`product-item-image-${index}`}
                    src={imageUrl}
                    alt={`productImage${index}`}
                    height="450px"
                    style={{ width: '100%', objectFit: 'cover', borderRadius: '10px' }}
                  />
                ))}
              </Carousel>
              {/* carousel */}

              {/* list button */}
              <Box display="flex" justifyContent="center" alignItems="center" gap="10px" marginTop="10px">
                {colors.map((color, index) => (
                  <Box key={`button-color-item-${index}`} display="flex" flexDirection="column" alignItems="center">
                    <Box
                      width="55px"
                      height="55px"
                      padding="5px"
                      border={`1px solid ${colorActive === index ? theme.palette.primary[500] : '#e0e0e0'}`}
                      borderRadius="3px"
                      sx={{
                        cursor: 'pointer',
                      }}
                      onClick={() => handleColorActiveClick(index)}
                    >
                      <img
                        src={color.imageUrl}
                        alt={`buttonColorItem${index}`}
                        style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                      />
                    </Box>

                    <Typography
                      marginTop="5px"
                      fontSize="12px"
                      color={colorActive === index ? theme.palette.primary[500] : theme.palette.neutral[200]}
                    >
                      {color.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
              {/* list button */}

              {/* description */}
              {product?.description && (
                <Box
                  marginTop="20px"
                  maxHeight="400px"
                  overflow="hidden"
                  position="relative"
                  sx={{ '& img': { objectFit: 'cover', maxWidth: '100%' } }}
                >
                  <Typography variant="h5" fontSize="18px" fontWeight={500} marginBottom="10px">
                    Thông tin sản phẩm
                  </Typography>

                  <Box>{parseToHTML(product.description as string)}</Box>
                  <Box
                    position="absolute"
                    width="100%"
                    bottom={0}
                    left={0}
                    height="100px"
                    sx={{
                      background:
                        'linear-gradient(to bottom,rgba(250 250 250/0),rgba(250 250 250/62.5),rgba(250 250 250/1))',
                    }}
                  />

                  <Button
                    variant="contained"
                    sx={{
                      position: 'absolute',
                      left: '50%',
                      bottom: '10px',
                      transform: 'translateX(-50%)',
                      textTransform: 'none',
                      minWidth: '120px',
                    }}
                    onClick={() => setOpenDescriptionDialog(!openDescriptionDialog)}
                  >
                    Xem thêm
                  </Button>

                  {/* Dialog */}
                  <Dialog
                    open={openDescriptionDialog}
                    onClose={handleDescriptionDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="md"
                    sx={{ '& img': { objectFit: 'cover', maxWidth: '100%' } }}
                  >
                    <DialogTitle id="alert-dialog-title">
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h4">Thông tin sản phẩm</Typography>

                        <IconButton onClick={handleDescriptionDialogClose} color="error">
                          <BiXIcon fontSize="25px" />
                        </IconButton>
                      </Box>
                    </DialogTitle>
                    <DialogContent>{parseToHTML(product.description as string)}</DialogContent>
                  </Dialog>
                  {/* Dialog */}
                </Box>
              )}
              {/* description */}

              {/* rating */}
              <Box marginTop="20px" border="1px solid #ccc" borderRadius="5px" padding="10px">
                <Typography variant="h5" fontSize="18px" fontWeight={500}>
                  Đánh giá {product?.name}
                </Typography>

                <Box display="flex" margin="20px 10px">
                  {/* table */}
                  <Box borderRight="1px solid #d9d9d9" width="260px" paddingRight="25px">
                    <Box display="flex" alignItems="center" gap="10px">
                      <Typography fontSize="20px" fontWeight={500} color={theme.palette.warning.main}>
                        {ratingAvgNumber}
                      </Typography>
                      <Rating name="read-only" value={ratingAvgNumber} precision={0.1} readOnly />
                      <Typography marginTop="3px">{ratingPeople} đánh giá</Typography>
                    </Box>

                    {ratingStars.map((star, index) => (
                      <Box key={`star-item-${index}`} display="flex" alignItems="center" gap="5px" marginTop="5px">
                        <Typography fontSize="12px">{star.number}</Typography>
                        <FaStarIcon fontSize="12px" />
                        <Box
                          height="4px"
                          width="calc(100% - 60px)"
                          bgcolor={theme.palette.neutral[700]}
                          position="relative"
                        >
                          <Box
                            bgcolor={theme.palette.warning.main}
                            position="absolute"
                            left={0}
                            top={0}
                            height="4px"
                            width={`${star.percent}%`}
                          />
                        </Box>
                        <Typography fontSize="12px">{star.percent}%</Typography>
                      </Box>
                    ))}
                  </Box>
                  {/* table */}

                  {/* images */}
                  <Box
                    display="grid"
                    gridTemplateColumns="repeat(5, 1fr)"
                    gridTemplateRows="repeat(2, 1fr)"
                    flex={1}
                    gap="10px"
                    padding="10px"
                  >
                    {ratingImages.slice(0, 10).map((ratingImage, index) => (
                      <Box
                        key={`rating-image-item-${index}`}
                        sx={
                          ratingImages.length > 10
                            ? {
                                position: 'relative',
                                '&:last-child::before': {
                                  content: `"Xem ${ratingImages.length - 9} ảnh từ KH"`,
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  bgcolor: 'rgba(0,0,0,0.6)',
                                  width: '100%',
                                  height: '100%',
                                  color: theme.palette.common.white,
                                  textAlign: 'center',
                                  lineHeight: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: '3px',
                                },
                              }
                            : {}
                        }
                      >
                        <img
                          src={ratingImage}
                          alt={ratingImage}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            border: '1px solid #e0e0e0',
                            borderRadius: '3px',
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                  {/* images */}
                </Box>

                {/* filter */}
                <Box>
                  <TextField
                    id="outlined-basic"
                    label="Tìm kiếm đánh giá"
                    variant="outlined"
                    size="small"
                    sx={{ width: '250px' }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <BiSearchAltIcon fontSize="20px" />
                        </InputAdornment>
                      ),
                    }}
                    value={searchTermReview}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTermReview(e.target.value)}
                  />

                  <Box display="flex" gap="10px" alignItems="center" marginTop="20px">
                    <Typography>Lọc theo:</Typography>
                    {[0, 5, 4, 3, 2, 1].map((star, index) => (
                      <Button
                        key={`star-button-item-${index}`}
                        variant={`${reviewStar === star ? 'contained' : 'outlined'}`}
                        sx={{ textTransform: 'none' }}
                        onClick={() => setReviewStar(star)}
                      >
                        {star === 0 ? 'Tất cả' : `${star} sao`}
                      </Button>
                    ))}
                  </Box>

                  <FormControlLabel
                    sx={{ marginTop: '10px' }}
                    control={
                      <Checkbox
                        checked={isReviewImage}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setIsReviewImage(e.target.checked)}
                      />
                    }
                    label="Có hình ảnh"
                  />

                  <Typography variant="h6" marginTop="10px">
                    {totalReview} đánh giá
                  </Typography>
                </Box>
                {/* filter */}

                {/* list rating */}
                <Box>
                  {reviews.map((review, index) => (
                    <Box key={`rating-item-${index}`}>
                      <Box display="flex" gap="10px" marginTop="10px" paddingTop="10px" borderTop="1px solid #e0e0e0">
                        {review.user.avatar ? (
                          <Avatar src={review.user.avatar} sx={{ width: 45, height: 45 }} />
                        ) : (
                          <Avatar sx={{ width: 45, height: 45 }}>{review.user.fullName.charAt(0)}</Avatar>
                        )}

                        <Box display="flex" flexDirection="column" gap="5px">
                          <Typography>{review.user.fullName}</Typography>
                          <Rating name="read-only" value={review.ratingValue} size="small" readOnly />
                          <Typography fontSize="12px" color={theme.palette.neutral[300]}>
                            {dateToString(review.createdAt, 2)} | Phân loại loại hàng: {review.orderLine.variation}
                          </Typography>

                          <Typography>{review.comment}</Typography>
                          <Box display="grid" gridTemplateColumns="repeat(10, 1fr)" gap="10px">
                            {review.reviewImages?.map((reviewImage, idx) => (
                              <img
                                key={`review-image-item-${idx}`}
                                src={reviewImage.imageUrl}
                                alt={reviewImage.imageUrl}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  border: '1px solid #e0e0e0',
                                  borderRadius: '3px',
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </Box>

                      {review.reply && review.reply.status === 1 && (
                        <Box
                          margin="10px 0 0 50px"
                          display="flex"
                          gap="10px"
                          padding="10px"
                          bgcolor={theme.palette.neutral[800]}
                          borderRadius="5px"
                          sx={{
                            position: 'relative',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: '-20px',
                              left: '8px',
                              borderWidth: '10px',
                              borderStyle: 'solid',
                              borderColor: `transparent transparent ${theme.palette.neutral[800]} transparent`,
                            },
                          }}
                        >
                          {review.user.avatar ? (
                            <Avatar src={review.user.avatar} sx={{ width: 45, height: 45 }} />
                          ) : (
                            <Avatar sx={{ width: 45, height: 45 }}>{review.user.fullName.charAt(0)}</Avatar>
                          )}

                          <Box display="flex" flexDirection="column" gap="5px">
                            <Box display="flex" alignItems="center" gap="10px">
                              <Typography>{review.reply.user.fullName}</Typography>
                              <Typography
                                fontSize="11px"
                                sx={{
                                  bgcolor: theme.palette.primary[500],
                                  color: theme.palette.common.white,
                                  padding: '2px 5px',
                                  borderRadius: '3px',
                                }}
                              >
                                {review.reply.user.role.name}
                              </Typography>
                            </Box>
                            <Typography fontSize="12px" color={theme.palette.neutral[300]}>
                              {dateToString(review.reply.createdAt, 2)}
                            </Typography>

                            <Typography>{review.reply.comment}</Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
                {/* list rating */}

                <Box marginTop="20px" display="flex" justifyContent="center">
                  {totalReview > 0 ? (
                    <Pagination
                      count={Math.ceil(totalReview / limitReview)}
                      color="primary"
                      onChange={(_event: React.ChangeEvent<unknown>, newPage: number) => {
                        setReviewPage(newPage - 1);
                      }}
                    />
                  ) : (
                    <Typography>Chưa có bình luận nào !</Typography>
                  )}
                </Box>
              </Box>
              {/* rating */}
            </Box>
            {/* left */}

            {/* right */}
            <Box flex={1}>
              {/* list variation */}
              <Box>
                {variations.map((variation, index) => (
                  <Box key={`variation-item-${index}`} display="flex" gap="10px" marginBottom="10px">
                    {variation.options.map((option, idx) => {
                      const variationOptionActives = product?.productItems[itemActive]?.SKU?.split('_');

                      return (
                        <Button
                          variant="outlined"
                          key={`variation-option-item-${idx}`}
                          sx={{
                            bgcolor: theme.palette.common.white,
                            color:
                              variationOptionActives && variationOptionActives.includes(option.slug)
                                ? theme.palette.primary[500]
                                : theme.palette.neutral[200],
                            textTransform: 'none',
                            fontWeight: 400,
                            borderColor:
                              variationOptionActives && variationOptionActives.includes(option.slug)
                                ? theme.palette.primary[500]
                                : theme.palette.neutral[600],

                            '&:hover': {
                              opacity: 0.9,
                              bgcolor: theme.palette.common.white,
                            },
                          }}
                          onClick={() =>
                            handleVariationOptionClick(variation.id, variationOptionActives as string[], option.slug)
                          }
                        >
                          {option.name}
                        </Button>
                      );
                    })}
                  </Box>
                ))}
              </Box>
              {/* list variation */}

              {/* price */}
              <Box display="flex" alignItems="baseline" gap="10px" marginTop="20px">
                <Typography fontSize="20px" fontWeight={500} color={theme.palette.error.main}>
                  {handleDiscount()
                    ? product && priceFormat(product.productItems[itemActive].discount)
                    : product && priceFormat(product.productItems[itemActive].price)}
                </Typography>

                {handleDiscount() && (
                  <>
                    <Typography
                      fontSize="16px"
                      color={theme.palette.neutral[400]}
                      sx={{ textDecoration: 'line-through' }}
                    >
                      {product && priceFormat(product.productItems[itemActive].price)}
                    </Typography>
                    <Box display="flex" alignItems="center" gap="5px" color={theme.palette.error.main}>
                      <Typography fontSize="16px">Giảm</Typography>
                      <Typography fontSize="16px">
                        {100 -
                          Math.ceil(
                            ((product?.productItems[itemActive].discount as number) /
                              (product?.productItems[itemActive].price as number)) *
                              100,
                          )}
                        %
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
              {/* price */}

              {/* shortDescription */}
              {product?.shortDescription && (
                <Box marginTop="20px" sx={{ '& img': { objectFit: 'cover', maxWidth: '100%' } }}>
                  {parseToHTML(product.shortDescription as string)}
                </Box>
              )}
              {/* shortDescription */}

              {/* quantity */}
              <Box display="flex" alignItems="center" gap="20px" marginTop="20px">
                <Typography fontSize="16px">Số lượng</Typography>

                {(product?.productItems[itemActive].inventory.quantity as number) > 0 && (
                  <ButtonGroup size="small">
                    <Button
                      variant="outlined"
                      onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                      disabled={quantity === 1}
                    >
                      <AiOutlineMinusIcon />
                    </Button>
                    <Button variant="outlined" sx={{ cursor: 'default' }}>
                      {quantity}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() =>
                        setQuantity(
                          quantity < (product?.productItems[itemActive].inventory.quantity as number)
                            ? quantity + 1
                            : (product?.productItems[itemActive].inventory.quantity as number),
                        )
                      }
                      disabled={quantity === (product?.productItems[itemActive].inventory.quantity as number)}
                    >
                      <AiOutlinePlusIcon />
                    </Button>
                  </ButtonGroup>
                )}

                <Typography color={theme.palette.neutral[300]}>
                  {product?.productItems[itemActive].inventory.quantity} sản phẩm có sẵn
                </Typography>
              </Box>
              {/* quantity */}

              {/* button */}
              <Box display="flex" gap="10px" marginTop="20px">
                <LoadingButton
                  loading={isLoading}
                  loadingPosition="start"
                  variant="contained"
                  color="secondary"
                  size="large"
                  startIcon={<MdAddShoppingCartIcon />}
                  sx={{ width: '100%' }}
                  disabled={(product?.productItems[itemActive].inventory.quantity as number) === 0}
                  onClick={handleAddCartClick}
                >
                  Thêm vào giỏ hàng
                </LoadingButton>
              </Box>
              {/* button */}
            </Box>
            {/* right */}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ProductDetail;
