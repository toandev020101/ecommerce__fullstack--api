import {
  Avatar,
  Badge,
  Box,
  Divider,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  AiFillInstagram as AiFillInstagramIcon,
  AiOutlineInbox as AiOutlineInboxIcon,
  AiOutlineUser as AiOutlineUserIcon,
} from 'react-icons/ai';
import {
  BiBell as BiBellIcon,
  BiHelpCircle as BiHelpCircleIcon,
  BiLogOut as BiLogOutIcon,
  BiSearchAlt as BiSearchAltIcon,
  BiCart as BiCartIcon,
} from 'react-icons/bi';
import { FaFacebook as FaFacebookIcon, FaLinkedin as FaLinkedinIcon } from 'react-icons/fa';
import { RiShoppingBag3Fill as RiShoppingBag3FillIcon } from 'react-icons/ri';
import { MdOutlineAdminPanelSettings as MdOutlineAdminPanelSettingsIcon } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import * as authApi from '../../apis/authApi';
import * as userApi from '../../apis/userApi';
import * as cartItemApi from '../../apis/cartItemApi';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { User } from '../../models/User';
import { authFai, authPending, authSuccess, logout, selectIsAuthenticated } from '../../slices/authSlice';
import { showToast } from '../../slices/toastSlice';
import { Theme } from '../../theme';
import JWTManager from '../../utils/jwt';
import { CartItem } from '../../models/CartItem';
import { selectIsReload } from '../../slices/globalSlice';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme: Theme = useTheme();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isReload = useAppSelector(selectIsReload);

  const [user, setUser] = useState<User>();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // menu
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const openMenuUser = Boolean(anchorElUser);
  const handleClickMenuUser = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseMenuUser = () => {
    setAnchorElUser(null);
  };
  // menu

  useEffect(() => {
    const getOneUser = async () => {
      try {
        const res = await userApi.getOneAndRoleByIdPublic(JWTManager.getUserId() as number);
        setUser(res.data as User);
      } catch (error: any) {
        const { data } = error.response;

        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    if (isAuthenticated) {
      getOneUser();
    } else {
      setUser(undefined);
    }
  }, [navigate, isAuthenticated, isReload]);

  useEffect(() => {
    const getAllCartItem = async () => {
      try {
        const res = await cartItemApi.getAll();
        setCartItems(res.data as CartItem[]);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    if (isAuthenticated) {
      getAllCartItem();
    }
  }, [dispatch, navigate, isAuthenticated, isReload]);

  const handleLogout = async () => {
    dispatch(authPending());
    handleCloseMenuUser();

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

      if (data.code === 400) {
        dispatch(
          showToast({
            page: 'login',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'loginId' },
          }),
        );
        navigate('/dang-nhap');
      } else if (data.code === 401 || data.code === 403 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  return (
    <>
      {/* begin: header top */}
      <Box display="flex" justifyContent="space-between" alignItems="center" padding="5px 0">
        {/* begin: left */}
        <Box display="flex" alignItems="center" gap="15px">
          {/* connect */}
          <Box display="flex" alignItems="center" gap="10px">
            <Typography>Kết nối</Typography>
            <Link to="https://facebook.com/toando2001" target="_blank">
              <FaFacebookIcon fontSize="18px" />
            </Link>
            <Link to="https://instagram.com/toando2001" target="_blank">
              <AiFillInstagramIcon fontSize="22px" />
            </Link>
            <Link to="https://linkedin.com/toando2001" target="_blank">
              <FaLinkedinIcon fontSize="18px" />
            </Link>
          </Box>
          {/* connect */}

          {/* help */}
          <Link to="/ho-tro">
            <Box display="flex" justifyContent="center" alignItems="center" gap="5px">
              <BiHelpCircleIcon fontSize="18px" />
              <span>Hỗ trợ</span>
            </Box>
          </Link>
          {/* help */}
        </Box>
        {/* end: left */}

        {/* begin: right */}
        <Box display="flex" alignItems="center" gap="15px">
          {user && (
            <Box display="flex" alignItems="center" gap="10px">
              <Badge
                badgeContent={4}
                color="secondary"
                sx={{
                  '& .MuiBadge-badge': {
                    minWidth: '16px',
                    padding: '0px 4px',
                    height: '16px',
                    top: '2px',
                    right: '2px',
                  },
                }}
              >
                <BiBellIcon fontSize="18px" />
              </Badge>

              <Typography>Thông báo</Typography>
            </Box>
          )}

          <Box display="flex" alignItems="center" gap="10px">
            {user ? (
              <>
                <Tooltip title="Cài đặt tài khoản">
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap="5px"
                    onClick={handleClickMenuUser}
                    sx={{ cursor: 'pointer' }}
                  >
                    {user?.avatar ? (
                      <Avatar src={user.avatar} sx={{ width: 20, height: 20 }} />
                    ) : (
                      <Avatar sx={{ width: 20, height: 20 }}>{user?.fullName.charAt(0)}</Avatar>
                    )}

                    <Typography>{user?.fullName}</Typography>
                  </Box>
                </Tooltip>
                <Menu
                  anchorEl={anchorElUser}
                  id="account-menu"
                  open={openMenuUser}
                  onClose={handleCloseMenuUser}
                  onClick={handleCloseMenuUser}
                  autoFocus={false}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      minWidth: '200px',
                      bgcolor: theme.palette.neutral[1000],
                      color: theme.palette.neutral[100],
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: theme.palette.neutral[1000],
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  {user?.role?.name !== 'Khách hàng' && (
                    <MenuItem onClick={handleCloseMenuUser}>
                      <Link to="/quan-tri" target="_blank" style={{ width: '100%' }}>
                        <MdOutlineAdminPanelSettingsIcon fontSize="20px" style={{ marginRight: '10px' }} /> Quản trị
                      </Link>
                    </MenuItem>
                  )}

                  <MenuItem onClick={handleCloseMenuUser}>
                    <Link to="/nguoi-dung/tai-khoan/ho-so" style={{ width: '100%' }}>
                      <AiOutlineUserIcon fontSize="20px" style={{ marginRight: '10px' }} /> Tài khoản của tôi
                    </Link>
                  </MenuItem>

                  <MenuItem onClick={handleCloseMenuUser}>
                    <Link to="/nguoi-dung/don-hang" style={{ width: '100%' }}>
                      <AiOutlineInboxIcon fontSize="20px" style={{ marginRight: '10px' }} /> Đơn hàng
                    </Link>
                  </MenuItem>

                  <Divider />

                  <MenuItem onClick={handleLogout}>
                    <BiLogOutIcon fontSize="20px" style={{ marginRight: '10px' }} /> Đăng xuất
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Link to="/dang-nhap">Đăng nhập</Link>
                <span>/</span>
                <Link to="/dang-ky">Đăng ký</Link>
              </>
            )}
          </Box>
        </Box>
        {/* end: right */}
      </Box>
      {/* end: header top */}

      {/* begin: header center */}
      <Box display="flex" justifyContent="space-between" alignItems="center" padding="10px 0">
        {/* logo */}
        <Link to="/">
          <Box display="flex" alignItems="center" gap="5px" color={theme.palette.primary[1000]}>
            <RiShoppingBag3FillIcon size="40px" />
            <Typography variant="h3" paddingTop="5px">
              Ecomshop
            </Typography>
          </Box>
        </Link>
        {/* logo */}

        {/* search */}
        <TextField
          placeholder="Tìm kiếm sản phẩm ..."
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <BiSearchAltIcon fontSize="24px" />
              </InputAdornment>
            ),
            style: { height: '40px' },
          }}
          sx={{
            bgcolor: theme.palette.common.white,
            borderRadius: '3px',
            width: '700px',
            height: '40px',
          }}
        />
        {/* search */}

        {/* cart */}
        <Link to="/gio-hang" style={{ marginRight: '40px' }}>
          <Badge
            badgeContent={cartItems.length}
            color="secondary"
            sx={{
              '& .MuiBadge-badge': {
                top: '10px',
                right: '2px',
                fontSize: '13px',
              },
            }}
          >
            <BiCartIcon fontSize="40px" />
          </Badge>
        </Link>
        {/* cart */}
      </Box>
      {/* end: header center */}
    </>
  );
};

export default Header;
