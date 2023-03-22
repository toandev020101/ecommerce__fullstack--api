import { Box, useTheme } from '@mui/material';
import React from 'react';
import { useAppSelector } from '../../app/hook';
import { selectIsOpenSidebar } from '../../slices/sidebarSlice';
import { Theme } from '../../theme';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

interface Props {
  children: JSX.Element;
}

const AdminLayout: React.FC<Props> = ({ children }) => {
  const isOpenSidebar = useAppSelector(selectIsOpenSidebar);
  const theme: Theme = useTheme();
  const widthDrawer = '250px';

  return (
    <>
      <Box minWidth="100vw" minHeight="100vh" sx={{ backgroundColor: theme.palette.neutral[950] }}>
        <Sidebar width={widthDrawer} />

        <Box width="100%" height="100%" paddingLeft={isOpenSidebar ? widthDrawer : '0'}>
          <Header />

          {/* content */}
          <Box padding="20px" width="100%" height="100%">
            {children}
          </Box>
          {/* content */}

          <Footer />
        </Box>
      </Box>
    </>
  );
};

export default AdminLayout;
