import { Box, Container, Grid, Typography, useTheme } from '@mui/material';
import React from 'react';
import { Theme } from '../../theme';
import { RiShoppingBag3Fill as RiShoppingBag3FillIcon } from 'react-icons/ri';

interface Props {
  children: JSX.Element;
}

const Content: React.FC<Props> = ({ children }) => {
  const theme: Theme = useTheme();

  return (
    <Box bgcolor={theme.palette.primary[500]} height="calc(100vh - 80px)">
      <Container maxWidth="lg">
        <Grid container spacing="30px" margin="0">
          <Grid item md={6} xs={0}>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              gap="10px"
              height="calc(100vh - 80px)"
              color={theme.palette.neutral[1000]}
            >
              <RiShoppingBag3FillIcon size="100px" />
              <Typography variant="h2" fontSize="50px" paddingTop="5px">
                Ecomshop
              </Typography>
              <Typography fontSize="25px">Mua bán điện thoại, laptop và phụ kiện uy tín</Typography>
            </Box>
          </Grid>
          <Grid item md={6} xs={12}>
            {children}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Content;
