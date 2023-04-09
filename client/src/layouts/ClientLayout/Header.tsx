import { Box, Container, useTheme } from '@mui/material';
import React from 'react';
import { Theme } from '../../theme';
import { FaFacebook as FaFacebookIcon, FaLinkedin as FaLinkedinIcon } from 'react-icons/fa';
import { AiFillInstagram as AiFillInstagramIcon } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const theme: Theme = useTheme();

  return (
    <Box
      sx={{
        backgroundImage: `linear-gradient(-180deg, ${theme.palette.primary[500]},${theme.palette.primary[400]})`,
        color: theme.palette.common.white,
      }}
    >
      <Container>
        {/* begin: header top */}
        <Box display="flex" justifyContent="space-between" alignItems="center" padding="5px 0">
          {/* begin: left */}
          <Box display="flex" justifyContent="center" alignItems="center">
            <Box display="flex" justifyContent="center" alignItems="center" gap="10px">
              <span>Kết nối</span>
              <Link to="https://facebook.com/toan020101">
                <FaFacebookIcon fontSize="18px" />
              </Link>
              <AiFillInstagramIcon fontSize="22px" />
              <FaLinkedinIcon fontSize="18px" />
            </Box>
          </Box>
          {/* end: left */}
        </Box>
        {/* end: header top */}
      </Container>
    </Box>
  );
};

export default Header;
