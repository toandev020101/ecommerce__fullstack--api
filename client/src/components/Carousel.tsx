import { Box, useTheme } from '@mui/material';
import React from 'react';
import Slider from 'react-slick';
import {
  MdOutlineNavigateBefore as MdOutlineNavigateBeforeIcon,
  MdOutlineNavigateNext as MdOutlineNavigateNextIcon,
} from 'react-icons/md';
import { Theme } from '../theme';

interface Props {
  children: JSX.Element[];
  settings?: Object;
}

const Carousel: React.FC<Props> = ({ children, settings }) => {
  const theme: Theme = useTheme();

  const CustomPrevArrow = (props: any) => {
    const { onClick } = props;
    return (
      <Box
        onClick={onClick}
        sx={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1,
          left: '-15px',
          width: '40px',
          height: '40px',
          bgcolor: theme.palette.common.white,
          borderRadius: '50%',
          opacity: 0.75,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <MdOutlineNavigateBeforeIcon fontSize="30px" />
      </Box>
    );
  };

  const CustomNextArrow = (props: any) => {
    const { onClick } = props;
    return (
      <Box
        onClick={onClick}
        sx={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1,
          right: '-15px',
          width: '40px',
          height: '40px',
          bgcolor: theme.palette.common.white,
          borderRadius: '50%',
          opacity: 0.75,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <MdOutlineNavigateNextIcon fontSize="30px" />
      </Box>
    );
  };

  const defaultSettings = {
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 5,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  return (
    <Box
      sx={{
        '& .slick-track': {
          display: 'flex',
          gap: '10px',
        },
      }}
    >
      <Slider {...defaultSettings} {...settings}>
        {children}
      </Slider>
    </Box>
  );
};

export default Carousel;
