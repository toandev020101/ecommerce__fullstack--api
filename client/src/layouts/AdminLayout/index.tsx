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
  const widthDrawer = '260px';

  return (
    <>
      <Box minHeight="100vh" sx={{ backgroundColor: theme.palette.neutral[950] }}>
        <Sidebar width={widthDrawer} />

        <Box paddingLeft={isOpenSidebar ? widthDrawer : '0'}>
          <Header />

          {/* content */}
          <Box padding="20px">{children}</Box>
          {/* content */}

          <Footer />
        </Box>
      </Box>
    </>
  );
};

export default AdminLayout;
