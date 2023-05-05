import { Avatar, Box, Collapse, List, ListItem, ListItemIcon, ListItemText, Typography, useTheme } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { AiOutlineUser as AiOutlineUserIcon } from 'react-icons/ai';
import { BiEditAlt as BiEditAltIcon, BiRadioCircle as BiRadioCircleIcon } from 'react-icons/bi';
import { TbListDetails as TbListDetailsIcon } from 'react-icons/tb';
import { Link, useLocation } from 'react-router-dom';
import { NavItem } from '../../../interfaces/NavItem';
import { User } from '../../../models/User';
import { Theme } from '../../../theme';

interface Props {
  user?: User;
}

const Sidebar: React.FC<Props> = ({ user }) => {
  const theme: Theme = useTheme();
  const { pathname } = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const navItems: NavItem[] = [
    {
      slug: 'tai-khoan',
      name: 'Tài khoản của tôi',
      icon: <AiOutlineUserIcon />,
      child: [
        {
          slug: 'ho-so',
          name: 'Hồ sơ',
        },
        {
          slug: 'thay-doi-mat-khau',
          name: 'Đổi mật khẩu',
        },
      ],
    },
    {
      slug: 'don-hang',
      name: 'Đơn hàng',
      icon: <TbListDetailsIcon />,
    },
  ];

  useEffect(() => {
    const pathnameArr = pathname.split('/');
    if (!!pathnameArr[3]) {
      setOpenMenu(pathnameArr[2]);
    }
  }, [pathname]);

  return (
    <Box width="180px">
      {/* header */}
      <Box display="flex" alignItems="center" gap="10px" paddingBottom="20px" borderBottom="1px solid #f0f0f0">
        <Avatar src={user?.avatar} alt={user?.username} sx={{ width: '55px', height: '55px' }} />
        <Box>
          <Typography fontSize="16px" fontWeight={500}>
            {user?.fullName}
          </Typography>
          <Link to="/nguoi-dung/tai-khoan/ho-so">
            <Box display="flex" alignItems="center" gap="5px" color={theme.palette.neutral[300]}>
              <BiEditAltIcon fontSize="18px" />
              <Typography>Sửa hồ sơ</Typography>
            </Box>
          </Link>
        </Box>
      </Box>
      {/* header */}

      {/* menu */}
      <List disablePadding sx={{ marginTop: '20px' }}>
        {navItems.map((nav, index) => (
          <Fragment key={`nav-item-${index}`}>
            {nav.child ? (
              <Fragment key={`nav-child-item-${index}`}>
                <ListItem
                  onClick={() => setOpenMenu(openMenu !== nav.slug ? (nav.slug as string) : null)}
                  sx={{
                    cursor: 'pointer',
                  }}
                  disablePadding
                >
                  <ListItemIcon
                    sx={{ fontSize: '22px', marginRight: '10px', minWidth: 0, color: theme.palette.neutral[200] }}
                  >
                    {nav.icon}
                  </ListItemIcon>
                  <ListItemText primary={nav.name} sx={{ '& .MuiListItemText-primary': { fontSize: '15px' } }} />
                </ListItem>

                <Collapse
                  in={openMenu === nav.slug || nav.slug === pathname.split('/')[2]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {nav.child.map((navChild, index) => (
                      <Link to={`/nguoi-dung/${nav.slug}/${navChild.slug}`} key={`nav-item-child-${index}`}>
                        <ListItem
                          sx={{
                            padding: '0 0 0 15px',
                            marginTop: '5px',
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              fontSize: '22px',
                              marginRight: '10px',
                              minWidth: 0,
                              color:
                                pathname.split('/')[2] === nav.slug && navChild.slug === pathname.split('/')[3]
                                  ? theme.palette.primary[500]
                                  : theme.palette.neutral[300],
                            }}
                          >
                            <BiRadioCircleIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={navChild.name}
                            sx={{
                              '& .MuiListItemText-primary': {
                                fontSize: '15px',
                                color:
                                  pathname.split('/')[2] === nav.slug && navChild.slug === pathname.split('/')[3]
                                    ? theme.palette.primary[500]
                                    : theme.palette.neutral[50],
                              },
                            }}
                          />
                        </ListItem>
                      </Link>
                    ))}
                  </List>
                </Collapse>
              </Fragment>
            ) : (
              <Link to={`/nguoi-dung/${nav.slug}`}>
                <ListItem
                  onClick={() => setOpenMenu(null)}
                  sx={{
                    marginTop: '5px',
                  }}
                  disablePadding
                >
                  <ListItemIcon
                    sx={{
                      fontSize: '22px',
                      marginRight: '10px',
                      minWidth: 0,
                      color:
                        pathname.split('/')[2] === nav.slug ? theme.palette.primary[500] : theme.palette.neutral[300],
                    }}
                  >
                    {nav.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={nav.name}
                    sx={{
                      '& .MuiTypography-root': {
                        fontSize: '15px',
                        color:
                          pathname.split('/')[2] === nav.slug ? theme.palette.primary[500] : theme.palette.neutral[50],
                      },
                    }}
                  />
                </ListItem>
              </Link>
            )}
          </Fragment>
        ))}
      </List>
      {/* menu */}
    </Box>
  );
};

export default Sidebar;
