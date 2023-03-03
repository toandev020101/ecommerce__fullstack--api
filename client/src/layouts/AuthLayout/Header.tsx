import { Box, Container, Typography, useTheme } from '@mui/material';
import React from 'react';
import { RiShoppingBag3Fill as RiShoppingBag3FillIcon } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { Theme } from '../../theme';

const Header: React.FC = () => {
  const theme: Theme = useTheme();

  return (
    <Box bgcolor={theme.palette.background.default} boxShadow="0 6px 6px #000000f">
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          height="80px"
          bgcolor={theme.palette.background.default}
        >
          <Link to="/">
            <Box display="flex" alignItems="center" gap="5px" color={theme.palette.primary[500]}>
              <RiShoppingBag3FillIcon size="40px" />
              <Typography variant="h3" paddingTop="5px">
                Ecomshop
              </Typography>
            </Box>
          </Link>

          <Link to="/help">
            <Typography component="span" fontSize="14px" paddingTop="5px" color={theme.palette.primary[500]}>
              Bạn cần giúp đỡ ?
            </Typography>
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Header;
