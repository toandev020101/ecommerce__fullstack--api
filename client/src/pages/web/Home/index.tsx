import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ToastNotify from '../../../components/ToastNotify';
import { Theme } from '../../../theme';
import Carousel from '../../../components/Carousel';
import { Link, useNavigate } from 'react-router-dom';
import ProductItem from '../../../components/ProductItem';
import TitlePage from '../../../components/TitlePage';
import { Product } from '../../../models/Product';
import * as productApi from '../../../apis/productApi';
import { toDate } from '../../../utils/date';
import { priceFormat } from '../../../utils/format';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const theme: Theme = useTheme();
  const sliderSettings = {
    slidesToShow: 2,
    slidesToScroll: 2,
  };

  const imgs = [
    {
      imageUrl: '/images/test/slider1.png',
      slug: '#',
    },
    {
      imageUrl: '/images/test/slider2.png',
      slug: '#',
    },
    {
      imageUrl: '/images/test/slider3.png',
      slug: '#',
    },
    {
      imageUrl: '/images/test/slider4.png',
      slug: '#',
    },
  ];

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const getAllProductPublic = async () => {
      try {
        const res = await productApi.getAllPublic();
        setProducts(res.data as Product[]);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getAllProductPublic();
  }, [navigate]);

  return (
    <>
      <TitlePage title="Ecomshop - Mua bán điện thoại, laptop và phụ kiện uy tín" />
      <ToastNotify name="home" />
      <img src="http://localhost:4000/1681116259036_754440794-banner.png" alt="" width="100%" height="100%" />

      <Box bgcolor={theme.palette.neutral[950]} paddingBottom="20px">
        <Container maxWidth="lg">
          {/* begin: slider */}
          <Box marginTop="-100px">
            <Carousel settings={sliderSettings}>
              {imgs.map((img, index) => (
                <Link to={img.slug} key={`carousel-${index}`}>
                  <img
                    src={img.imageUrl}
                    alt=""
                    style={{ height: '180px', width: '100%', objectFit: 'cover', borderRadius: '10px' }}
                  />
                </Link>
              ))}
            </Carousel>
          </Box>
          {/* end: slider */}

          {/* begin: banner */}
          <img
            src="/images/test/banner3.webp"
            alt=""
            style={{ height: '100%', width: '100%', objectFit: 'cover', borderRadius: '5px', marginTop: '20px' }}
          />
          {/* end: banner */}

          {/* begin: product discount carousel */}
          <Box
            margin="20px 0"
            sx={{
              backgroundImage: `linear-gradient(-180deg, ${theme.palette.primary[300]},${theme.palette.primary[500]})`,
              borderRadius: '10px',
              padding: '10px',
            }}
          >
            <Typography
              variant="h2"
              sx={{
                textTransform: 'uppercase',
                textAlign: 'center',
                fontWeight: 500,
                color: theme.palette.neutral[1000],
                marginBottom: '10px',
              }}
            >
              Deal ngon giá rẻ quá
            </Typography>

            <Carousel arrow="rectangle">
              {products.slice(0, 10).map((product, index) => {
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
                    rate={4.5}
                    ratingCount={232}
                  />
                );
              })}
            </Carousel>

            <Box display="flex" justifyContent="center" marginTop="10px">
              <Link to="/mua-online-gia-re">
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: theme.palette.common.white,
                    color: theme.palette.common.black,
                    minWidth: '150px',
                    textTransform: 'none',

                    '&:hover': {
                      opacity: 0.9,
                      bgcolor: theme.palette.common.white,
                    },
                  }}
                >
                  Xem tất cả
                </Button>
              </Link>
            </Box>
          </Box>
          {/* end: product discount carousel */}

          {/* begin: Suggestions */}
          <Box marginTop="20px">
            <Typography
              variant="h3"
              sx={{ textTransform: 'uppercase', fontWeight: 500, marginBottom: '10px', textAlign: 'center' }}
            >
              Gợi ý hôm nay
            </Typography>

            {/* list product */}
            <Box display="grid" gridTemplateColumns="repeat(5, 1fr)">
              {products.slice(0, 8).map((product, index) => {
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
                    rate={4.5}
                    ratingCount={232}
                  />
                );
              })}
            </Box>
            {/* list product */}

            <Box display="flex" justifyContent="center" marginTop="10px">
              <Button
                variant="contained"
                sx={{
                  bgcolor: theme.palette.common.white,
                  color: theme.palette.common.black,
                  minWidth: '150px',
                  textTransform: 'none',

                  '&:hover': {
                    opacity: 0.9,
                    bgcolor: theme.palette.common.white,
                  },
                }}
              >
                Xem thêm
              </Button>
            </Box>
          </Box>
          {/* end: Suggestions */}
        </Container>
      </Box>
    </>
  );
};

export default Home;
