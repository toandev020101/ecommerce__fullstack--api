import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import React from 'react';
import ToastNotify from '../../../components/ToastNotify';
import { Theme } from '../../../theme';
import Carousel from '../../../components/Carousel';
import { Link } from 'react-router-dom';
import ProductItem from '../../../components/ProductItem';
import TitlePage from '../../../components/TitlePage';

const Home: React.FC = () => {
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
              {Array(8)
                .fill(0)
                .map((_, index) => (
                  <ProductItem
                    key={`product-item-discount-${index}`}
                    imageUrl="https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn/Products/Images/42/251192/iphone-14-pro-max-den-thumb-600x600.jpg"
                    name="iPhone 14 pro max 128GB"
                    slug="iphone-14-pro-max-128GB"
                    categorySlug="dien-thoai"
                    price="3.000.0000đ"
                    isLatest
                    isHot
                    rate={4.5}
                    ratingCount={232}
                    type="carousel"
                  />
                ))}
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
              {Array(10)
                .fill(0)
                .map((_, index) => (
                  <ProductItem
                    key={`product-item-discount-${index}`}
                    imageUrl="https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn/Products/Images/42/251192/iphone-14-pro-max-den-thumb-600x600.jpg"
                    name="iPhone 14 pro max 128GB"
                    slug="iphone-14-pro-max-128GB"
                    categorySlug="dien-thoai"
                    price="3.000.0000đ"
                    isLatest
                    isHot
                    rate={4.5}
                    ratingCount={232}
                  />
                ))}
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
