import { Box, useTheme } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import {
  MdOutlineNavigateBefore as MdOutlineNavigateBeforeIcon,
  MdOutlineNavigateNext as MdOutlineNavigateNextIcon,
} from 'react-icons/md';
import { Theme } from '../theme';

interface Props {
  children?: JSX.Element[];
  settings?: any;
  arrow?: 'circle' | 'rectangle';
  arrowPadding?: boolean;
  resetCarousel?: boolean;
}

const Carousel: React.FC<Props> = ({ children, settings, arrow = 'circle', arrowPadding, resetCarousel }) => {
  const theme: Theme = useTheme();
  const sliderRef: any = useRef(null);
  const [slideActive, setSlideActive] = useState<number>(0);

  useEffect(() => {
    if (typeof resetCarousel === 'boolean') {
      sliderRef.current.slickGoTo(0);
    }
  }, [resetCarousel]);

  const CustomPrevArrowCircle = (props: any) => {
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
          color: theme.palette.common.black,
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

  const CustomNextArrowCircle = (props: any) => {
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
          color: theme.palette.common.black,
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

  const CustomPrevArrowRectangle = (props: any) => {
    const { onClick } = props;
    return (
      <Box
        className="arrow-rectangle-left"
        onClick={onClick}
        sx={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1,
          left: arrowPadding ? '0' : '-10px',
          width: '30px',
          height: '60px',
          bgcolor: theme.palette.common.white,
          color: theme.palette.common.black,
          opacity: 0.75,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          borderTopRightRadius: '5px',
          borderBottomRightRadius: '5px',
        }}
      >
        <MdOutlineNavigateBeforeIcon fontSize="40px" />
      </Box>
    );
  };

  const CustomNextArrowRectangle = (props: any) => {
    const { onClick } = props;
    return (
      <Box
        className="arrow-rectangle-right"
        onClick={onClick}
        sx={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1,
          right: arrowPadding ? '0' : '-10px',
          width: '30px',
          height: '60px',
          bgcolor: theme.palette.common.white,
          color: theme.palette.common.black,
          opacity: 0.75,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          borderTopLeftRadius: '5px',
          borderBottomLeftRadius: '5px',
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
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    prevArrow:
      settings?.infinite === undefined || (!settings?.infinite && slideActive > 0) ? (
        arrow === 'circle' ? (
          <CustomPrevArrowCircle />
        ) : (
          <CustomPrevArrowRectangle />
        )
      ) : (
        <></>
      ),
    nextArrow:
      settings?.infinite === undefined || (!settings?.infinite && slideActive < (children?.length as number) - 1) ? (
        arrow === 'circle' ? (
          <CustomNextArrowCircle />
        ) : (
          <CustomNextArrowRectangle />
        )
      ) : (
        <></>
      ),
    appendDots: (dots: any) => (
      <Box
        sx={{
          position: 'absolute',
          bottom: '10px',
          display: 'none',

          '& .slick-active > span': {
            bgcolor: '#673ab7',
          },
        }}
      >
        <ul style={{ margin: '0px' }}> {dots} </ul>
      </Box>
    ),
    customPaging: (_i: number) => (
      <span
        style={{
          display: 'inline-block',
          width: '12px',
          height: '12px',
          border: `1px solid ${theme.palette.primary[500]}`,
          borderRadius: '50%',
        }}
      />
    ),
    beforeChange: (_current: number, next: number) => setSlideActive(next),
  };

  return (
    <Box
      sx={{
        '& .slick-track':
          !settings || (settings.slidesToShow && settings.slidesToShow > 1)
            ? {
                display: 'flex',
                gap: '10px',
              }
            : {
                position: 'relative',
              },

        '&:hover .arrow-rectangle-left': {
          opacity: 1,
          boxShadow: '6px 0 4px rgba(0,0,0,.05),4px 0 4px rgba(0,0,0,.09)',
        },

        '&:hover .arrow-rectangle-right': {
          opacity: 1,
          boxShadow: '-6px 0 4px rgba(0,0,0,.05),-4px 0 4px rgba(0,0,0,.09)',
        },

        '&:hover .slick-dots': {
          display: 'block',
        },
      }}
    >
      <Slider {...defaultSettings} {...settings} ref={sliderRef}>
        {children}
      </Slider>
    </Box>
  );
};

export default Carousel;
