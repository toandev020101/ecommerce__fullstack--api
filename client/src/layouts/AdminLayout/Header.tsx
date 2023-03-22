import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  AiOutlineMenuFold as AiOutlineMenuFoldIcon,
  AiOutlineMenuUnfold as AiOutlineMenuUnfoldIcon,
  AiOutlineQuestionCircle as AiOutlineQuestionCircleIcon,
  AiOutlineSetting as AiOutlineSettingIcon,
} from 'react-icons/ai';
import { BiBell as BiBellIcon, BiLogOut as BiLogOutIcon } from 'react-icons/bi';
import { BsChatDots as BsChatDotsIcon, BsMoonStars as BsMoonStarsIcon, BsSun as BsSunIcon } from 'react-icons/bs';
import { FiMail as FiMailIcon } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import * as authApi from '../../apis/authApi';
import * as userApi from '../../apis/userApi';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { User } from '../../models/User';
import { authFai, authPending, authSuccess, logout, selectIsAuthenticated } from '../../slices/authSlice';
import { setMode } from '../../slices/globalSlice';
import { selectIsOpenSidebar, setOpenSidebar } from '../../slices/sidebarSlice';
import { showToast } from '../../slices/toastSlice';
import { Theme } from '../../theme';
import JWTManager from '../../utils/jwt';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isOpenSidebar = useAppSelector(selectIsOpenSidebar);
  const theme: Theme = useTheme();

  // menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // menu

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getOneUser = async () => {
      try {
        const res = await userApi.getOneAndRoleById(JWTManager.getUserId() as number);
        setUser(res.data as User);
      } catch (error: any) {
        const { data } = error.response;

        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };
    getOneUser();
  }, [navigate]);

  const handleLogout = async () => {
    dispatch(authPending());
    handleClose();

    try {
      const res = await authApi.logout(user?.id as number);
      dispatch(authSuccess());

      dispatch(
        showToast({
          page: 'login',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'loginId' },
        }),
      );

      dispatch(logout());
      JWTManager.deleteToken();
      navigate('/dang-nhap');
    } catch (error: any) {
      const { data } = error.response;
      dispatch(authFai());

      if (data.code === 401 || data.code === 403 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: 'none',
        boxShadow: 'none',
        color: theme.palette.neutral[50],
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* left */}
        <IconButton
          size="large"
          edge="start"
          aria-label="menu"
          sx={{ mr: 2, color: theme.palette.neutral[100] }}
          onClick={() => dispatch(setOpenSidebar())}
        >
          {isOpenSidebar ? <AiOutlineMenuFoldIcon /> : <AiOutlineMenuUnfoldIcon />}
        </IconButton>
        {/* left */}

        {/* right */}
        <Box display="flex" alignItems="center" gap="10px">
          <IconButton sx={{ color: theme.palette.neutral[200] }} onClick={() => dispatch(setMode())}>
            {theme.palette.mode === 'light' ? <BsMoonStarsIcon fontSize="24px" /> : <BsSunIcon fontSize="24px" />}
          </IconButton>

          <IconButton sx={{ color: theme.palette.neutral[200] }}>
            <Badge badgeContent={4} color="secondary">
              <FiMailIcon fontSize="24px" />
            </Badge>
          </IconButton>

          <IconButton sx={{ color: theme.palette.neutral[200] }}>
            <Badge badgeContent={4} color="primary">
              <BiBellIcon fontSize="24px" />
            </Badge>
          </IconButton>

          {isAuthenticated && (
            <Box>
              {/* avatar */}
              <Tooltip title="Cài đặt tài khoản">
                <IconButton
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={openMenu ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={openMenu ? 'true' : undefined}
                  onClick={handleClick}
                >
                  {user?.avatar ? (
                    <Avatar src={user.avatar} sx={{ width: 36, height: 36 }} />
                  ) : (
                    <Avatar sx={{ width: 36, height: 36 }}>{user?.fullName.charAt(0)}</Avatar>
                  )}
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={openMenu}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    minWidth: '200px',
                    bgcolor: theme.palette.neutral[900],
                    color: theme.palette.neutral[100],
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: theme.palette.neutral[900],
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box display="flex" alignItems="center" padding="10px 20px">
                  {user?.avatar ? (
                    <Avatar src={user.avatar} sx={{ width: 36, height: 36 }} />
                  ) : (
                    <Avatar sx={{ width: 36, height: 36 }}>{user?.fullName.charAt(0)}</Avatar>
                  )}

                  <Box marginLeft="10px">
                    <Typography variant="h5" fontWeight={500}>
                      {user?.fullName}
                    </Typography>
                    <Typography fontSize="13px" sx={{ color: theme.palette.neutral[300] }}>
                      {user?.role?.name}
                    </Typography>
                  </Box>
                </Box>
                <Divider />

                <MenuItem onClick={handleClose}>
                  <FiMailIcon fontSize="20px" style={{ marginRight: '10px' }} /> Hộp thư đến
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <BsChatDotsIcon fontSize="20px" style={{ marginRight: '10px' }} /> Tin nhắn
                </MenuItem>
                <Divider />

                <MenuItem onClick={handleClose}>
                  <AiOutlineSettingIcon fontSize="20px" style={{ marginRight: '10px' }} /> Cài đặt tài khoản
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <AiOutlineQuestionCircleIcon fontSize="20px" style={{ marginRight: '10px' }} /> FAQ
                </MenuItem>
                <Divider />

                <MenuItem onClick={handleLogout}>
                  <BiLogOutIcon fontSize="20px" style={{ marginRight: '10px' }} /> Đăng xuất
                </MenuItem>
              </Menu>
              {/* avatar */}
            </Box>
          )}
        </Box>
        {/* right */}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
