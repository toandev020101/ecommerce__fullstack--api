import { Box, Container, Typography, useTheme } from '@mui/material';
import React from 'react';
import ToastNotify from '../../components/ToastNotify';
import { Theme } from '../../theme';
import Carousel from '../../components/Carousel';
import { Link } from 'react-router-dom';
import ProductItem from '../../components/ProductItem';

const Home: React.FC = () => {
  const theme: Theme = useTheme();
  const sliderSettings = {
    slidesToShow: 2,
    slidesToScroll: 2,
  };

  const imgs = [
    {
      imageUrl:
        'https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn/2023/04/banner/redmi-note12-GRQ-720-220-720x220-1.png',
      slug: 'https://www.thegioididong.com/dtdd/xiaomi-redmi-note-12-4g',
    },
    {
      imageUrl:
        'https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn/2023/04/banner/Realme-C55-GRQ-720-220-720x220-1.png',
      slug: 'https://www.thegioididong.com/dtdd/realme-c55',
    },
    {
      imageUrl:
        'https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn/2023/04/banner/a54-720-220-720x220-3.png',
      slug: 'https://www.thegioididong.com/khuyen-mai-soc/galaxy-a-series-2023',
    },
    {
      imageUrl:
        'https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn/2023/04/banner/ip14-720-220-720x220-4.png',
      slug: 'https://www.thegioididong.com/dtdd/iphone-14-pro-max#2-gia',
    },
  ];

  return (
    <>
      <ToastNotify name="home" />
      <img src="http://localhost:4000/1681092858135_139853444-banner.png" alt="" width="100%" height="100%" />

      <Box bgcolor={theme.palette.neutral[900]}>
        <Container>
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
            src="https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn/2023/04/banner/Promote-Des-1200x100-10.png"
            alt=""
            style={{ height: '100%', width: '100%', objectFit: 'cover', borderRadius: '5px', marginTop: '20px' }}
          />
          {/* end: banner */}

          {/* begin: product discount carousel */}
          <Box
            margin="20px 0"
            sx={{
              bgcolor: theme.palette.primary[500],
              color: theme.palette.neutral[1000],
              borderRadius: '10px',
              padding: '10px',
            }}
          >
            <Typography variant="h2" sx={{ textTransform: 'uppercase', textAlign: 'center', fontWeight: 500 }}>
              Deal ngon giá rẻ quá
            </Typography>

            <Carousel>
              {imgs.map((_img, index) => (
                <ProductItem key={`product-item-discount-${index}`} />
              ))}
            </Carousel>
          </Box>
          {/* end: product discount carousel */}
        </Container>
      </Box>
    </>
  );
};

export default Home;
