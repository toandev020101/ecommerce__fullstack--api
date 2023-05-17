import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Pagination,
  Rating,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import React, { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { BiFilterAlt as BiFilterAltIcon } from 'react-icons/bi';
import { FiChevronLeft as FiChevronLeftIcon, FiChevronRight as FiChevronRightIcon } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as categoryApi from '../apis/categoryApi';
import * as productApi from '../apis/productApi';
import * as variationApi from '../apis/variationApi';
import { FieldError } from '../interfaces/FieldError';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { Variation } from '../models/Variation';
import { toDate } from '../utils/date';
import { priceFormat } from '../utils/format';
import Carousel from './Carousel';
import ProductItem from './ProductItem';
import TitlePage from './TitlePage';
import { Theme } from '../theme';

const limit = 5;

const ProductCategory: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme: Theme = useTheme();

  const url = location.pathname;
  const categorySlug = url.split('/')[1];

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [categoryChilds, setCategoryChilds] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [priceFrom, setPriceFrom] = useState<number | string>('');
  const [priceTo, setPriceTo] = useState<number | string>('');
  const [price, setPrice] = useState<{ priceFrom: number; priceTo: number }>();
  const [errors, setErrors] = useState<FieldError[]>([]);

  const [categoryFilters, setCategoryFilters] = useState<number[]>([]);
  const [variationFilters, setVariationFilters] = useState<{ id: number; values: number[] }[]>([]);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [ratingFilters, setRatingFilters] = useState<string[]>([]);
  const [reload, setReload] = useState<boolean>(false);

  const [page, setPage] = useState<number>(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [sort, setSort] = useState<string>('createdAt');
  const [total, setTotal] = useState<number>(0);

  const sliderSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
  };

  const sliders = [
    {
      imageUrl: '/images/test/slider5.png',
      slug: '',
      name: '',
    },
    {
      imageUrl: '/images/test/slider5.png',
      slug: '',
      name: '',
    },
    {
      imageUrl: '/images/test/slider5.png',
      slug: '',
      name: '',
    },
    {
      imageUrl: '/images/test/slider5.png',
      slug: '',
      name: '',
    },
  ];
  const banners = [
    {
      imageUrl: '/images/test/banner1.png',
      slug: '#',
      name: '',
    },
    {
      imageUrl: '/images/test/banner2.png',
      slug: '#',
      name: '',
    },
  ];

  useEffect(() => {
    const urlArray = url.split('?');
    if (urlArray.length > 0) {
      setPage(0);
    }
  }, [url]);

  useEffect(() => {
    const getListVariationByCategorySlug = async () => {
      try {
        const res = await variationApi.getListByCategorySlugPublic(categorySlug as string);
        setVariations(res.data as Variation[]);
      } catch (error: any) {
        const { data } = error.response;

        if (data.code === 401 || data.code === 403 || data.code === 404 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };
    getListVariationByCategorySlug();
  }, [navigate, categorySlug]);

  useEffect(() => {
    const getListCategoryByParentSlug = async () => {
      try {
        const res = await categoryApi.getListByParentSlugPublic(categorySlug as string);
        setCategoryChilds(res.data as Category[]);
      } catch (error: any) {
        const { data } = error.response;

        if (data.code === 401 || data.code === 403 || data.code === 404 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };
    getListCategoryByParentSlug();
  }, [navigate, categorySlug]);

  useEffect(() => {
    setIsLoading(true);
    const getPaginationProductByCategorySlug = async () => {
      try {
        const res = await productApi.getPaginationByCategorySlugPublic({
          _limit: limit,
          _page: page,
          _sort: sort,
          _order: order,
          categorySlug,
          price,
          categoryFilters,
          variationFilters,
          statusFilters,
          ratingFilters,
        });
        setProducts(res.data as Product[]);
        setTotal(res.pagination?._total as number);
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        const { data } = error.response;

        if (data.code === 401 || data.code === 403 || data.code === 404 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };
    getPaginationProductByCategorySlug();
  }, [
    navigate,
    categorySlug,
    page,
    sort,
    order,
    reload,
    price,
    categoryFilters,
    variationFilters,
    statusFilters,
    ratingFilters,
  ]);

  const handlePriceRangeChange = () => {
    const newErrors: FieldError[] = [];
    if (!priceFrom || !priceTo) {
      if (!priceFrom) {
        newErrors.push({ field: 'priceFrom', message: 'Vui lòng nhập giá!' });
      }

      if (!priceTo) {
        newErrors.push({ field: 'priceTo', message: 'Vui lòng nhập giá!' });
      }
      setErrors(newErrors);
      return;
    }

    if (priceFrom > priceTo) {
      newErrors.push({ field: 'priceFrom', message: 'Giá từ phải nhỏ hơn giá đến!' });
    } else {
      setPrice({ priceFrom: priceFrom as number, priceTo: priceTo as number });
    }
    setReload(!reload);
    setErrors(newErrors);
  };

  const handleCategoryChange = (id: number) => {
    const newCategoryFilters = [...categoryFilters];

    const categoryFilterIndex = newCategoryFilters.findIndex((categoryFilter) => categoryFilter === id);

    if (categoryFilterIndex === -1) {
      newCategoryFilters.push(id);
    } else {
      newCategoryFilters.splice(categoryFilterIndex, 1);
    }

    setCategoryFilters(newCategoryFilters);
    setReload(!reload);
  };

  const handleVariationChange = (id: number, value: number) => {
    const newVariationFilters = [...variationFilters];
    const variationFilterIndex = newVariationFilters.findIndex((variationFilter) => variationFilter.id === id);

    if (variationFilterIndex === -1) {
      newVariationFilters.push({ id, values: [value] });
    } else {
      const valueIndex = newVariationFilters[variationFilterIndex].values.findIndex(
        (variationFilterValue) => variationFilterValue === value,
      );

      if (valueIndex === -1) {
        newVariationFilters[variationFilterIndex].values.push(value);
      } else {
        newVariationFilters[variationFilterIndex].values.splice(valueIndex, 1);
        if (newVariationFilters[variationFilterIndex].values.length === 0) {
          newVariationFilters.splice(variationFilterIndex, 1);
        }
      }
    }

    setVariationFilters(newVariationFilters);
    setReload(!reload);
  };

  const handleStatusChange = (name: string) => {
    const newStatusFilters = [...statusFilters];

    const statusFilterIndex = newStatusFilters.findIndex((statusFilter) => statusFilter === name);

    if (statusFilterIndex === -1) {
      newStatusFilters.push(name);
    } else {
      newStatusFilters.splice(statusFilterIndex, 1);
    }

    setStatusFilters(newStatusFilters);
    setReload(!reload);
  };

  const handleRatingChange = (name: string) => {
    const newRatingFilters = [...ratingFilters];

    const ratingFilterIndex = newRatingFilters.findIndex((ratingFilter) => ratingFilter === name);

    if (ratingFilterIndex === -1) {
      newRatingFilters.push(name);
    } else {
      newRatingFilters.splice(ratingFilterIndex, 1);
    }

    setRatingFilters(newRatingFilters);
    setReload(!reload);
  };

  const handleResetFilter = () => {
    setPriceFrom('');
    setPriceTo('');
    setPrice(undefined);
    setCategoryFilters([]);
    setVariationFilters([]);
    setStatusFilters([]);
    setRatingFilters([]);
  };

  const handleSort = (name: string, type: 'asc' | 'desc') => {
    setSort(name);
    setOrder(type);
  };

  return (
    <>
      <TitlePage title="Điện thoại di động" />

      <Box bgcolor={theme.palette.neutral[950]} padding="20px 0">
        <Container maxWidth="lg">
          {/* begin: header */}
          <Box display="flex" gap="10px">
            {/* slider */}
            <Box width="750px">
              <Carousel arrow="rectangle" arrowPadding settings={sliderSettings}>
                {sliders.map((slider, index) => (
                  <Link key={`slider-item-${index}`} to={slider.slug}>
                    <img
                      src={slider.imageUrl}
                      alt={slider.name}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                  </Link>
                ))}
              </Carousel>
            </Box>
            {/* slider */}

            {/* banner */}
            <Box display="flex" flexDirection="column" gap="10px">
              {banners.map((banner, index) => (
                <Link key={`banner-item-${index}`} to={banner.slug}>
                  <img
                    src={banner.imageUrl}
                    alt={banner.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Link>
              ))}
            </Box>
            {/* banner */}
          </Box>
          {/* end: header */}

          {/* begin: content */}
          <Box display="flex" gap="20px" marginTop="20px">
            {/* filter */}
            <Box width="200px">
              {/* title */}
              <Box display="flex" alignItems="center" gap="10px">
                <BiFilterAltIcon fontSize="20px" />
                <Typography variant="h5" sx={{ textTransform: 'uppercase' }}>
                  Bộ lọc tìm kiếm
                </Typography>
              </Box>
              {/* title */}

              {/* price range */}
              <Box margin="20px 0">
                <Typography marginBottom="10px" fontSize="16px">
                  Khoảng giá
                </Typography>

                <FormControl error variant="standard">
                  <Box display="flex" alignItems="center" gap="5px">
                    <TextField
                      required
                      name="priceFrom"
                      label="Từ"
                      size="small"
                      value={priceFrom}
                      type="number"
                      inputProps={{ min: 0, step: 1000 }}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setPriceFrom(parseInt(e.target.value))}
                      error={!!errors.find((error) => error.field === 'priceFrom')}
                    />
                    <span>-</span>
                    <TextField
                      required
                      name="priceTo"
                      label="Đến"
                      size="small"
                      value={priceTo}
                      type="number"
                      inputProps={{ min: 0, step: 1000 }}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setPriceTo(parseInt(e.target.value))}
                      error={!!errors.find((error) => error.field === 'priceTo')}
                    />
                  </Box>
                  <FormHelperText sx={{ fontSize: '14px' }}>
                    {errors.find((error) => error.field === 'priceFrom' || error.field === 'priceTo')?.message}
                  </FormHelperText>
                </FormControl>

                <Button variant="contained" sx={{ marginTop: '10px', width: '100%' }} onClick={handlePriceRangeChange}>
                  Áp dụng
                </Button>
              </Box>
              {/* price range */}

              <Divider />

              {/* category */}
              {categoryChilds.length > 0 && (
                <>
                  <Box margin="20px 0">
                    <Typography marginBottom="10px" fontSize="16px">
                      Danh mục
                    </Typography>

                    {categoryChilds.map((categoryChild, index) => (
                      <Box key={`category-child-item-${index}`}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              checked={categoryFilters.includes(categoryChild.id)}
                              onChange={() => handleCategoryChange(categoryChild.id)}
                            />
                          }
                          label={categoryChild.name}
                        />
                      </Box>
                    ))}
                  </Box>

                  <Divider />
                </>
              )}
              {/* category */}

              {/* variation */}
              {variations.map((variation, index) => (
                <Fragment key={`variation-item-${index}`}>
                  <Box margin="20px 0">
                    <Typography marginBottom="10px" fontSize="16px">
                      {variation.name}
                    </Typography>

                    {variation?.variationOptions?.map((variationOption: any, idx: number) => {
                      const variationFilter = variationFilters?.find(
                        (variationFilter) => variationFilter.id === variation.id,
                      );
                      let checked = false;
                      if (variationFilter && variationFilter.values.includes(variationOption.id)) {
                        checked = true;
                      }

                      return (
                        <Box key={`variation-option-item-${idx}`}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                size="small"
                                checked={checked}
                                onChange={() => handleVariationChange(variation.id, variationOption.id)}
                              />
                            }
                            label={variationOption.value}
                          />
                        </Box>
                      );
                    })}
                  </Box>

                  <Divider />
                </Fragment>
              ))}
              {/* variation */}

              {/* status */}
              <Box margin="20px 0">
                <Typography marginBottom="10px" fontSize="16px">
                  Tình trạng
                </Typography>

                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={statusFilters.includes('inStock')}
                        onChange={() => handleStatusChange('inStock')}
                      />
                    }
                    label="Còn hàng"
                  />
                </Box>
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={statusFilters.includes('isHot')}
                        onChange={() => handleStatusChange('isHot')}
                      />
                    }
                    label="Nổi bật"
                  />
                </Box>
              </Box>
              {/* status */}

              <Divider />

              {/* rating */}
              <Box margin="20px 0">
                <Typography marginBottom="10px" fontSize="16px">
                  Đánh giá
                </Typography>

                {[5, 4, 3, 2, 1].map((rate, index) => (
                  <label
                    key={`rating-item-${index}`}
                    htmlFor={`checkbox${rate}`}
                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginLeft: '-10px' }}
                  >
                    <Checkbox
                      id={`checkbox${rate}`}
                      color="primary"
                      size="small"
                      name={rate.toString()}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleRatingChange(e.target.name)}
                    />
                    <Rating value={rate} readOnly size="small" />{' '}
                    {rate !== 5 && <span style={{ marginLeft: '5px' }}>trở lên</span>}
                  </label>
                ))}
              </Box>
              {/* rating */}

              <Divider />

              <Button
                variant="contained"
                color="primary"
                sx={{ width: '100%', textTransform: 'uppercase' }}
                onClick={handleResetFilter}
              >
                Xóa tất cả
              </Button>
            </Box>
            {/* filter */}

            <Box flex={1}>
              {/* sort */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                padding="15px 20px"
                bgcolor={theme.palette.neutral[800]}
                width="100%"
              >
                {/* left */}
                <Box display="flex" alignItems="center" gap="10px">
                  <Typography>Sắp xếp theo</Typography>

                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: sort === 'createdAt' ? theme.palette.primary[500] : theme.palette.common.white,
                      color: sort === 'createdAt' ? theme.palette.common.white : theme.palette.common.black,
                      textTransform: 'none',
                      fontWeight: 400,

                      '&:hover': {
                        opacity: 0.9,
                        bgcolor: theme.palette.common.white,
                      },
                    }}
                    onClick={() => handleSort('createdAt', 'desc')}
                  >
                    Mới nhất
                  </Button>

                  <FormControl sx={{ minWidth: '200px' }} size="small">
                    <InputLabel id="demo-simple-select-label">Giá</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="price"
                      value={sort === 'price' ? order : ''}
                      label="Giá"
                      onChange={(e: SelectChangeEvent) => handleSort(e.target.name, e.target.value as 'asc' | 'desc')}
                    >
                      <MenuItem value="asc">Giá từ thấp đến cao</MenuItem>
                      <MenuItem value="desc">Giá từ cao đến thấp</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                {/* left */}

                {/* right */}
                <Box display="flex" alignItems="center" gap="10px">
                  <Typography>
                    <span style={{ color: theme.palette.primary[500] }}>{page + 1}</span>/{Math.ceil(total / limit)}
                  </Typography>
                  <ButtonGroup variant="contained" aria-label="Disabled elevation buttons" size="small">
                    <Button
                      sx={{
                        bgcolor: theme.palette.common.white,
                        color: theme.palette.common.black,
                        textTransform: 'none',
                        fontWeight: 400,

                        '&:hover': {
                          opacity: 0.9,
                          bgcolor: theme.palette.common.white,
                        },
                      }}
                      onClick={() => setPage(page > 0 ? page - 1 : page)}
                      disabled={page === 0}
                    >
                      <FiChevronLeftIcon fontSize="20px" />
                    </Button>
                    <Button
                      sx={{
                        bgcolor: theme.palette.common.white,
                        color: theme.palette.common.black,
                        textTransform: 'none',
                        fontWeight: 400,

                        '&:hover': {
                          opacity: 0.9,
                          bgcolor: theme.palette.common.white,
                        },
                      }}
                      onClick={() => setPage(page < Math.ceil(total / limit) - 1 ? page + 1 : page)}
                      disabled={page === Math.ceil(total / limit) - 1}
                    >
                      <FiChevronRightIcon fontSize="20px" />
                    </Button>
                  </ButtonGroup>
                </Box>
                {/* right */}
              </Box>
              {/* sort */}

              {/* list product */}
              {products.length > 0 ? (
                <Box display="grid" gridTemplateColumns="repeat(5, 1fr)" marginTop="10px">
                  {isLoading ? (
                    <>
                      {Array(limit)
                        .fill(0)
                        .map((_, index) => (
                          <ProductItem
                            key={`product-item-discount-${index}`}
                            imageUrl=""
                            name=""
                            slug=""
                            categorySlug=""
                            price=""
                            isLatest={false}
                            isHot={false}
                            rate={0}
                            ratingCount={0}
                            loading
                          />
                        ))}
                    </>
                  ) : (
                    <>
                      {products.map((product, index) => {
                        const createdAtDate = toDate(product.createdAt);
                        const currentDate = new Date();
                        let isLatest = false;

                        if (
                          currentDate.getFullYear() === createdAtDate.getFullYear() &&
                          currentDate.getMonth() === createdAtDate.getMonth() &&
                          currentDate.getDate() - createdAtDate.getDate() <= 7
                        ) {
                          isLatest = true;
                        }

                        const priceArr = product.productItems.map((productItem) => {
                          if (
                            toDate(productItem.discountStartDate) <= currentDate &&
                            toDate(productItem.discountEndDate) >= currentDate
                          ) {
                            return productItem.discount;
                          }

                          return productItem.price;
                        });

                        // min -> max
                        priceArr.sort((price1, price2) => price1 - price2);

                        const priceString =
                          priceArr.length > 1 && priceArr[0] !== priceArr[priceArr.length - 1]
                            ? `${priceFormat(priceArr[0])} - ${priceFormat(priceArr[priceArr.length - 1])}`
                            : priceFormat(priceArr[0]);

                        // ratingAvgNumber
                        let ratingValueTotal = 0;
                        let ratingValueLength = 0;
                        product.productItems.forEach((productItem) => {
                          productItem.reviews?.forEach((review) => {
                            if (review.id != null) {
                              ratingValueTotal += review.ratingValue;
                              ratingValueLength++;
                            }
                          });
                        });

                        let ratingAvgNumber = 0;
                        if (ratingValueLength > 0) {
                          ratingAvgNumber = parseFloat((ratingValueTotal / ratingValueLength).toFixed(1));
                        }

                        return (
                          <ProductItem
                            key={`product-item-discount-${index}`}
                            imageUrl={product.imageUrl}
                            name={product.name}
                            slug={product.slug}
                            categorySlug={product.category.slug}
                            price={priceString}
                            isLatest={isLatest}
                            isHot={product.isHot === 1}
                            rate={ratingAvgNumber}
                            ratingCount={ratingValueLength}
                          />
                        );
                      })}
                    </>
                  )}
                </Box>
              ) : (
                <Typography textAlign="center" marginTop="20px">
                  Không có dữ liệu
                </Typography>
              )}

              {/* list product */}

              {/* pagination */}
              {products.length > 0 && (
                <Box marginTop="20px" display="flex" justifyContent="center">
                  <Pagination
                    count={Math.ceil(total / limit)}
                    color="primary"
                    onChange={(_event: React.ChangeEvent<unknown>, newPage: number) => setPage(newPage - 1)}
                  />
                </Box>
              )}
              {/* pagination */}
            </Box>
          </Box>
          {/* end: content */}
        </Container>
      </Box>
    </>
  );
};

export default ProductCategory;
