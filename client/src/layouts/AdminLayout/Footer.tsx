import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import { Theme } from '../../theme';

const Footer: React.FC = () => {
  const theme: Theme = useTheme();

  return (
    <Box marginLeft="20px" position="absolute" bottom="10px">
      <Typography fontSize="16px" sx={{ color: theme.palette.neutral[400] }}>
        &copy; 2023, lập trình bởi toandev020101
      </Typography>
    </Box>
  );
};

export default Footer;
