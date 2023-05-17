import { Box, Rating, Skeleton, Typography, useTheme } from '@mui/material';
import React from 'react';
import { Theme } from '../theme';
import { Link } from 'react-router-dom';

interface Props {
  imageUrl: string;
  name: string;
  slug: string;
  categorySlug?: string;
  price: string;
  isLatest?: boolean;
  isHot?: boolean;
  rate: number;
  ratingCount: number;
  loading?: boolean;
  type?: 'carousel' | 'list';
}

const ProductItem: React.FC<Props> = ({
  imageUrl,
  name,
  slug,
  categorySlug,
  price,
  isLatest = false,
  isHot = false,
  rate,
  ratingCount,
  loading = false,
  type = 'list',
}) => {
  const theme: Theme = useTheme();

  return (
    <>
      {loading ? (
        <Box
          minHeight="400px"
          display="block"
          padding="10px"
          sx={
            type === 'list'
              ? {
                  borderBottom: '1px solid #e9e9e9',
                  borderRight: '1px solid #e9e9e9',
                  bgcolor: theme.palette.common.white,

                  '&:nth-child(1), &:nth-child(2), &:nth-child(3), &:nth-child(4), &:nth-child(5)': {
                    borderTop: '1px solid #e9e9e9',
                  },

                  '&:nth-child(5n + 1)': {
                    borderLeft: '1px solid #e9e9e9',
                  },
                }
              : {
                  boxShadow: '0 .0625rem .125rem 0 rgba(0,0,0,.1)',
                }
          }
        >
          {/* begin: header */}
          <Box display="flex" gap="5px" marginTop="-8px">
            <Skeleton animation="wave" height="33px" width="50px" />
            <Skeleton animation="wave" height="33px" width="50px" />
          </Box>
          {/* end: header */}

          {/* begin: content */}
          {/* image */}
          <Skeleton animation="wave" height="264px" sx={{ marginTop: '-50px' }} />
          {/* image */}
          <Skeleton animation="wave" width="100%" sx={{ marginTop: '-40px' }} />
          <Skeleton animation="wave" width="100%" />
          <Skeleton animation="wave" width="100%" />
          {/* end: content */}
        </Box>
      ) : (
        <Box
          component={Link}
          to={`/${categorySlug}/${slug}`}
          minHeight="400px"
          padding="10px"
          display="block"
          sx={
            type === 'list'
              ? {
                  borderBottom: '1px solid #e9e9e9',
                  borderRight: '1px solid #e9e9e9',
                  bgcolor: theme.palette.common.white,

                  '&:nth-child(1), &:nth-child(2), &:nth-child(3), &:nth-child(4), &:nth-child(5)': {
                    borderTop: '1px solid #e9e9e9',
                  },

                  '&:nth-child(5n + 1)': {
                    borderLeft: '1px solid #e9e9e9',
                  },

                  '&:hover': {
                    boxShadow: '0 2px 12px rgba(0,0,0,.12)',
                  },

                  '&:hover .product__image': {
                    transform: 'translateY(-8px)',
                    transition: 'transform linear 0.3s',
                  },

                  '&:hover h5': {
                    color: theme.palette.secondary[500],
                  },
                }
              : {
                  boxShadow: '0 .0625rem .125rem 0 rgba(0,0,0,.1)',

                  borderRadius: '3px',
                  '&:hover': {
                    boxShadow: '0 .0625rem 20px 0 rgba(0,0,0,.05)',
                  },

                  '&:hover .product__image': {
                    transform: 'translateY(-10px)',
                    transition: 'transform linear 0.3s',
                  },

                  '&:hover h5': {
                    color: theme.palette.secondary[500],
                  },
                }
          }
        >
          {/* begin: header */}
          <Box display="flex" gap="5px" marginTop={isLatest || isHot ? '0' : '20px'} marginBottom="15px">
            {isLatest && (
              <Box
                padding="1px 10px"
                borderRadius="3px"
                bgcolor={theme.palette.success.main}
                color={theme.palette.common.white}
                fontSize="12px"
              >
                Mới nhất
              </Box>
            )}
            {isHot && (
              <Box
                padding="1px 10px"
                borderRadius="3px"
                bgcolor={theme.palette.warning.main}
                color={theme.palette.common.white}
                fontSize="12px"
              >
                Nổi bật
              </Box>
            )}
          </Box>
          {/* end: header */}

          {/* begin: content */}
          {/* image */}
          <Box
            width="100%"
            paddingTop="100%"
            sx={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
            }}
            className="product__image"
          />
          {/* image */}

          <Typography marginTop="20px" variant="h5" fontSize="14px">
            {name}
          </Typography>
          <Box marginTop="5px" fontSize="16px" fontWeight={500} color={theme.palette.error.main}>
            {price}
          </Box>
          {rate > 0 && (
            <Box marginTop="5px" display="flex" alignItems="center" gap="5px" fontSize="14px">
              <span style={{ color: theme.palette.warning.main, fontWeight: 500, marginTop: '2px' }}>{rate}</span>
              <Rating name="read-only" value={rate} precision={0.1} size="small" readOnly />
              <span style={{ color: theme.palette.neutral[300] }}>({ratingCount})</span>
            </Box>
          )}
          {/* end: content */}
        </Box>
      )}
    </>
  );
};

export default ProductItem;
