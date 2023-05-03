import {
  Box,
  Collapse,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useState, Fragment, useEffect } from 'react';
import {
  AiOutlineDashboard as AiOutlineDashboardIcon,
  AiOutlineInbox as AiOutlineInboxIcon,
  AiOutlineUser as AiOutlineUserIcon,
} from 'react-icons/ai';
import {
  MdOutlineDraw as MdOutlineDrawIcon,
  MdOutlineLocalShipping as MdOutlineLocalShippingIcon,
  MdOutlinePayments as MdOutlinePaymentsIcon,
  MdOutlinePermMedia as MdOutlinePermMediaIcon,
} from 'react-icons/md';
import { RiShoppingBag3Fill as RiShoppingBag3FillIcon } from 'react-icons/ri';
import { TbListDetails as TbListDetailsIcon } from 'react-icons/tb';
import {
  BiChevronRight as BiChevronRightIcon,
  BiChevronDown as BiChevronDownIcon,
  BiRadioCircle as BiRadioCircleIcon,
} from 'react-icons/bi';
import { useAppSelector } from '../../app/hook';
import { NavItem } from '../../interfaces/NavItem';
import { selectIsOpenSidebar } from '../../slices/sidebarSlice';
import { Theme } from '../../theme';
import { Link, useLocation } from 'react-router-dom';

interface Props {
  width: string;
}

const Sidebar: React.FC<Props> = ({ width }) => {
  const theme: Theme = useTheme();
  const isOpenSidebar = useAppSelector(selectIsOpenSidebar);
  const { pathname } = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const navItems: NavItem[] = [
    {
      slug: '',
      name: 'Bản tin',
      icon: <AiOutlineDashboardIcon />,
    },
    {
      slug: 'giao-dien',
      name: 'Giao diện',
      icon: <MdOutlineDrawIcon />,
      child: [
        {
          slug: 'trang-tinh',
          name: 'Trang tĩnh',
        },
        {
          slug: 'hinh-anh-slider',
          name: 'Hình ảnh slider',
        },
        {
          slug: 'cuoi-trang',
          name: 'Cuối trang',
        },
      ],
    },
    {
      slug: 'kho-luu-tru',
      name: 'Kho lưu trữ',
      icon: <MdOutlinePermMediaIcon />,
    },
    {
      slug: 'san-pham',
      name: 'Sản phẩm',
      icon: <AiOutlineInboxIcon />,
      child: [
        {
          slug: 'danh-sach',
          name: 'Danh sách sản phẩm',
        },
        {
          slug: 'danh-muc',
          name: 'Danh mục',
        },
        {
          slug: 'tu-khoa',
          name: 'Từ khóa',
        },
        {
          slug: 'thuoc-tinh',
          name: 'Thuộc tính',
        },
        {
          slug: 'danh-gia',
          name: 'Đánh giá',
        },
      ],
    },
    {
      slug: 'don-hang',
      name: 'Đơn hàng',
      icon: <TbListDetailsIcon />,
      child: [
        {
          slug: 'danh-sach',
          name: 'Danh sách đơn hàng',
        },
        {
          slug: 'phieu-uu-dai',
          name: 'Phiếu ưu đãi',
        },
        {
          slug: 'kho',
          name: 'Kho',
        },
      ],
    },
    {
      slug: 'giao-hang',
      name: 'Giao hàng',
      icon: <MdOutlineLocalShippingIcon />,
      child: [
        {
          slug: 'phuong-thuc',
          name: 'Phương thức',
        },
      ],
    },
    {
      slug: 'thanh-toan',
      name: 'Thanh toán',
      icon: <MdOutlinePaymentsIcon />,
    },
    {
      slug: 'tai-khoan',
      name: 'Tài khoản',
      icon: <AiOutlineUserIcon />,
      child: [
        {
          slug: 'danh-sach',
          name: 'Danh sách tài khoản',
        },
        {
          slug: 'vai-tro',
          name: 'Vai trò',
        },
        {
          slug: 'quyen',
          name: 'Quyền',
        },
      ],
    },
  ];

  useEffect(() => {
    const pathnameArr = pathname.split('/');
    if (!!pathnameArr[3]) {
      setOpenMenu(pathnameArr[2]);
    }
  }, [pathname]);

  return (
    <Drawer
      sx={{
        width: width,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.neutral[950],
          color: theme.palette.neutral[50],
        },
      }}
      variant="persistent"
      anchor="left"
      open={isOpenSidebar}
    >
      {/* logo */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap="5px"
        color={theme.palette.primary[500]}
        padding="20px 0"
      >
        <RiShoppingBag3FillIcon size="40px" />
        <Typography variant="h3" paddingTop="5px">
          Ecomshop
        </Typography>
      </Box>
      {/* logo */}

      <List sx={{ margin: '20px 0' }} disablePadding>
        {navItems.map((nav, index) => (
          <Fragment key={`nav-item-${index}`}>
            {nav.child ? (
              <Fragment key={`nav-child-item-${index}`}>
                <ListItemButton
                  onClick={() => setOpenMenu(openMenu !== nav.slug ? (nav.slug as string) : null)}
                  sx={{
                    marginTop: '5px',
                    '&.MuiListItemButton-root': {
                      borderTopRightRadius: '30px',
                      borderBottomRightRadius: '30px',
                      marginRight: '10px',
                      backgroundColor: openMenu === nav.slug ? theme.palette.neutral[800] : 'transparent',
                    },
                    '&.MuiListItemButton-root:hover': {
                      backgroundColor: theme.palette.neutral[800],
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ fontSize: '24px', marginRight: '15px', minWidth: 0, color: theme.palette.neutral[200] }}
                  >
                    {nav.icon}
                  </ListItemIcon>
                  <ListItemText primary={nav.name} sx={{ '& .MuiListItemText-primary': { fontSize: '15px' } }} />

                  {openMenu === nav.slug || nav.slug === pathname.split('/')[2] ? (
                    <BiChevronDownIcon fontSize="24px" style={{ color: theme.palette.neutral[200] }} />
                  ) : (
                    <BiChevronRightIcon fontSize="24px" style={{ color: theme.palette.neutral[200] }} />
                  )}
                </ListItemButton>

                <Collapse
                  in={openMenu === nav.slug || nav.slug === pathname.split('/')[2]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {nav.child.map((navChild, index) => (
                      <Link to={`/quan-tri/${nav.slug}/${navChild.slug}`} key={`nav-item-child-${index}`}>
                        <ListItemButton
                          sx={{
                            pl: 4,
                            marginTop: '5px',
                            '&.MuiListItemButton-root': {
                              borderTopRightRadius: '30px',
                              borderBottomRightRadius: '30px',
                              marginRight: '10px',

                              backgroundImage:
                                pathname.split('/')[2] === nav.slug && navChild.slug === pathname.split('/')[3]
                                  ? `linear-gradient(98deg, ${theme.palette.primary[900]},  ${theme.palette.primary.main} 94%)`
                                  : 'transparent',
                              color:
                                pathname.split('/')[2] === nav.slug && navChild.slug === pathname.split('/')[3]
                                  ? theme.palette.common.white
                                  : theme.palette.neutral[50],
                            },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              fontSize: '24px',
                              marginRight: '15px',
                              minWidth: 0,
                              color:
                                pathname.split('/')[2] === nav.slug && navChild.slug === pathname.split('/')[3]
                                  ? theme.palette.common.white
                                  : theme.palette.neutral[200],
                            }}
                          >
                            <BiRadioCircleIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={navChild.name}
                            sx={{ '& .MuiListItemText-primary': { fontSize: '15px' } }}
                          />
                        </ListItemButton>
                      </Link>
                    ))}
                  </List>
                </Collapse>
              </Fragment>
            ) : (
              <Link to={`/quan-tri/${nav.slug}`}>
                <ListItemButton
                  onClick={() => setOpenMenu(null)}
                  sx={{
                    marginTop: '5px',
                    '&.MuiListItemButton-root': {
                      borderTopRightRadius: '30px',
                      borderBottomRightRadius: '30px',
                      marginRight: '10px',
                      backgroundImage:
                        (!pathname.split('/')[2] && !nav.slug) || nav.slug === pathname.split('/')[2]
                          ? `linear-gradient(98deg, ${theme.palette.primary[900]},  ${theme.palette.primary.main} 94%)`
                          : 'transparent',
                      color:
                        (!pathname.split('/')[2] && !nav.slug) || nav.slug === pathname.split('/')[2]
                          ? theme.palette.common.white
                          : theme.palette.neutral[50],
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      fontSize: '24px',
                      marginRight: '15px',
                      minWidth: 0,
                      color:
                        (!pathname.split('/')[2] && !nav.slug) || nav.slug === pathname.split('/')[2]
                          ? theme.palette.common.white
                          : theme.palette.neutral[200],
                    }}
                  >
                    {nav.icon}
                  </ListItemIcon>
                  <ListItemText primary={nav.name} sx={{ '& .MuiTypography-root': { fontSize: '15px' } }} />
                </ListItemButton>
              </Link>
            )}
          </Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
