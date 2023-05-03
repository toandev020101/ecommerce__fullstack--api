import {
  Box,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Rating,
  Typography,
  useTheme,
} from '@mui/material';
import parseToHTML from 'html-react-parser';
import React, { useEffect, useState } from 'react';
import { AiOutlineMinus as AiOutlineMinusIcon, AiOutlinePlus as AiOutlinePlusIcon } from 'react-icons/ai';
import { BiX as BiXIcon } from 'react-icons/bi';
import { FaStar as FaStarIcon } from 'react-icons/fa';
import { MdAddShoppingCart as MdAddShoppingCartIcon } from 'react-icons/md';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as productApi from '../apis/productApi';
import * as cartItemApi from '../apis/cartItemApi';
import { Product } from '../models/Product';
import { Theme } from '../theme';
import { toDate } from '../utils/date';
import { priceFormat } from '../utils/format';
import Carousel from './Carousel';
import TitlePage from './TitlePage';
import ToastNotify from './ToastNotify';
import { LoadingButton } from '@mui/lab';
import { showToast } from '../slices/toastSlice';
import { useAppDispatch } from '../app/hook';
import { CartItemInput } from '../interfaces/CartItemInput';

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

            <Rating name="read-only" value={4.6} size="small" precision={0.1} readOnly />
            <Typography>101 đánh giá</Typography>
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
                        4.6
                      </Typography>
                      <Rating name="read-only" value={4.6} precision={0.1} readOnly />
                      <Typography marginTop="3px">101 đánh giá</Typography>
                    </Box>

                    {[
                      { number: 5, percent: 65 },
                      { number: 4, percent: 25 },
                      { number: 3, percent: 15 },
                      { number: 2, percent: 0 },
                      { number: 1, percent: 0 },
                    ].map((star, index) => (
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

                  {/* filter */}
                  <Box></Box>
                  {/* filter */}
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
                    <Typography fontSize="16px" color={theme.palette.error.main}>
                      -
                      {100 -
                        Math.ceil(
                          ((product?.productItems[itemActive].discount as number) /
                            (product?.productItems[itemActive].price as number)) *
                            100,
                        )}
                      %
                    </Typography>
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
                <Button
                  variant="contained"
                  size="large"
                  sx={{ width: '100%' }}
                  disabled={(product?.productItems[itemActive].inventory.quantity as number) === 0}
                >
                  Mua ngay
                </Button>
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
