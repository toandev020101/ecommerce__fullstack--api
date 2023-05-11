import { Box, Grid, List, ListItem, Typography, useTheme } from '@mui/material';
import React from 'react';
import { AiFillInstagram as AiFillInstagramIcon } from 'react-icons/ai';
import { FaFacebook as FaFacebookIcon, FaLinkedin as FaLinkedinIcon } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Theme } from '../../theme';

const Footer: React.FC = () => {
  const theme: Theme = useTheme();
  const dateNow = new Date();

  const customerCares = [
    {
      label: 'Trung tâm trợ giúp',
      slug: '/ho-tro',
    },
    {
      label: 'Hướng dẫn mua hàng',
      slug: '/huong-dan-mua-hang',
    },
    {
      label: 'Thanh toán',
      slug: '/thanh-toan',
    },
    {
      label: 'Trả hàng & hoàn tiền',
      slug: '/tra-hang-hoan-tien',
    },
    {
      label: 'Chính sách bảo hành',
      slug: '/chinh-sac-bao-hanh',
    },
    {
      label: 'Mã giảm giá',
      slug: '/ma-giam-gia',
    },
  ];

  const shopInfos = [
    {
      label: 'Giới thiệu về Ecomshop',
      slug: '/gioi-thieu',
    },
    {
      label: 'Điều khoản Ecomshop',
      slug: '/dieu-khoan',
    },
    {
      label: 'Chính sách bảo mật',
      slug: '/chinh-sac-bao-mat',
    },
    {
      label: 'Gửi góp ý & khiếu nại',
      slug: '/gui-gop-y-khieu-nai',
    },
  ];

  const switchboardSupports = [
    {
      title: 'Gọi mua:',
      label: '1800.2938',
      slug: 'tel:18002938',
      time: '(7:30 - 22:00)',
    },
    {
      title: 'Khiếu nại:',
      label: '1800.2153',
      slug: 'tel:18002153',
      time: '(8:00 - 21:30)',
    },
    {
      title: 'Bảo hành:',
      label: '1800.3421',
      slug: 'tel:18003421',
      time: '(8:00 - 21:00)',
    },
  ];

  const socialNetworks = [
    {
      label: 'Facebook',
      icon: <FaFacebookIcon fontSize="18px" />,
      slug: 'https://facebook.com/toando2001',
    },
    {
      label: 'Instagram',
      icon: <AiFillInstagramIcon fontSize="18px" />,
      slug: 'https://instagram.com/toando2001',
    },
    {
      label: 'Linkedin',
      icon: <FaLinkedinIcon fontSize="18px" />,
      slug: 'https://linkedin.com/toando2001',
    },
  ];

  return (
    <>
      {/* begin: footer content */}
      <Grid container spacing={3}>
        <Grid item md={3}>
          <Typography variant="h6" sx={{ textTransform: 'uppercase' }}>
            Chăm sóc khách hàng
          </Typography>
          <List>
            {customerCares.map((customerCare, index) => (
              <ListItem
                key={`customer-care-item-${index}`}
                sx={{
                  padding: '4px 0',
                  color: theme.palette.neutral[400],
                  '&:hover': { color: theme.palette.primary[500] },
                }}
              >
                <Link to={customerCare.slug}>{customerCare.label}</Link>
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid item md={3}>
          <Typography variant="h6" sx={{ textTransform: 'uppercase' }}>
            Về Ecomshop
          </Typography>
          <List>
            {shopInfos.map((shopInfo, index) => (
              <ListItem
                key={`shop-info-item-${index}`}
                sx={{
                  padding: '4px 0',
                  color: theme.palette.neutral[400],
                  '&:hover': { color: theme.palette.primary[500] },
                }}
              >
                <Link to={shopInfo.slug}>{shopInfo.label}</Link>
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid item md={3}>
          <Typography variant="h6" sx={{ textTransform: 'uppercase' }}>
            Tổng đài hỗ trợ (miễn phí gọi)
          </Typography>
          <List>
            {switchboardSupports.map((switchboardSupport, index) => (
              <ListItem
                key={`switchboard-support-item-${index}`}
                sx={{
                  padding: '4px 0',
                  color: theme.palette.neutral[400],
                  display: 'flex',
                  alginItems: 'center',
                  gap: '5px',
                }}
              >
                <Typography>{switchboardSupport.title}</Typography>
                <Link to={switchboardSupport.slug} style={{ fontWeight: 600, color: theme.palette.primary[500] }}>
                  {switchboardSupport.label}
                </Link>
                <Typography>{switchboardSupport.time}</Typography>
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid item md={3}>
          <Typography variant="h6" sx={{ textTransform: 'uppercase' }}>
            Theo dõi chúng tôi
          </Typography>
          <List>
            {socialNetworks.map((socialNetwork, index) => (
              <ListItem
                key={`social-network-item-${index}`}
                sx={{
                  padding: '4px 0',
                  color: theme.palette.neutral[400],
                  '&:hover p': {
                    color: theme.palette.primary[500],
                  },
                }}
              >
                <Link to={socialNetwork.slug} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {socialNetwork.icon}
                  <Typography>{socialNetwork.label}</Typography>
                </Link>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
      {/* end: footer content */}

      {/* begin: footer bottom */}
      <Box marginTop="10px" padding="10px 0" borderTop="1px solid #e0e0e0" textAlign="center">
        <Typography color={theme.palette.neutral[400]}>
          &copy; {dateNow.getFullYear()} Lập trình bởi toandev020101
        </Typography>
      </Box>
      {/* end: footer bottom */}
    </>
  );
};

export default Footer;
