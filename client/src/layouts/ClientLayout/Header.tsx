import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import {
  AiFillInstagram as AiFillInstagramIcon,
  AiOutlineInbox as AiOutlineInboxIcon,
  AiOutlineUser as AiOutlineUserIcon,
} from 'react-icons/ai';
import {
  BiBell as BiBellIcon,
  BiCart as BiCartIcon,
  BiHelpCircle as BiHelpCircleIcon,
  BiLock as BiLockIcon,
  BiLogOut as BiLogOutIcon,
  BiSearchAlt as BiSearchAltIcon,
} from 'react-icons/bi';
import { FaFacebook as FaFacebookIcon, FaLinkedin as FaLinkedinIcon } from 'react-icons/fa';
import {
  MdOutlineAdminPanelSettings as MdOutlineAdminPanelSettingsIcon,
  MdOutlineRemoveShoppingCart as MdOutlineRemoveShoppingCartIcon,
} from 'react-icons/md';
import { RiShoppingBag3Fill as RiShoppingBag3FillIcon } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import * as authApi from '../../apis/authApi';
import * as cartItemApi from '../../apis/cartItemApi';
import * as productApi from '../../apis/productApi';
import * as userApi from '../../apis/userApi';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { CartItem } from '../../models/CartItem';
import { Product } from '../../models/Product';
import { User } from '../../models/User';
import { authFai, authPending, authSuccess, logout, selectIsAuthenticated } from '../../slices/authSlice';
import { selectIsReload } from '../../slices/globalSlice';
import { showToast } from '../../slices/toastSlice';
import { Theme } from '../../theme';
import { toDate } from '../../utils/date';
import { priceFormat } from '../../utils/format';
import JWTManager from '../../utils/jwt';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const theme: Theme = useTheme();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isReload = useAppSelector(selectIsReload);
  const searchInputRef: any = useRef(null);
  const searchBoxRef: any = useRef(null);

  const [user, setUser] = useState<User>();
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isOpenSearchBox, setIsOpenSearchBox] = useState<boolean>(false);

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

  const handleSearchTermChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value as string;
    setSearchTerm(newSearchTerm);

    if (searchTerm !== '') {
      try {
        const res = await productApi.getListBySearchTerm(newSearchTerm);
        setProducts(res.data as Product[]);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    } else {
      setProducts([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setIsOpenSearchBox(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [searchBoxRef, searchInputRef]);

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
        <Box sx={{ position: 'relative' }}>
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
            onChange={handleSearchTermChange}
            onFocus={() => setIsOpenSearchBox(true)}
            ref={searchInputRef}
          />

          {searchTerm !== '' && (
            <Box
              ref={searchBoxRef}
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                bgcolor: theme.palette.common.white,
                color: theme.palette.neutral[100],
                width: '100%',
                borderRadius: '3px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                zIndex: 99,
                transformOrigin: 'top',
                animation: 'heightChange 0.25s ease-in-out',
                display: isOpenSearchBox ? 'block' : 'none',
              }}
            >
              <Typography color={theme.palette.neutral[300]} padding="10px">
                {products.length > 0 ? 'Sản phẩm gợi ý' : 'Không có sản phẩm phù hợp'}
              </Typography>

              {products.length > 0 && (
                <Box maxHeight="500px" sx={{ overflowY: 'auto' }}>
                  {products.map((product, index) => {
                    const currentDate = new Date();

                    const priceArr = product.productItems.map((productItem) => {
                      if (
                        toDate(productItem.discountStartDate) <= currentDate &&
                        toDate(productItem.discountEndDate) >= currentDate
                      ) {
                        return productItem.discount;
                      }

                      return productItem.price;
                    });

                    // min -> max
                    priceArr.sort((price1, price2) => price1 - price2);

                    const priceString =
                      priceArr.length > 1 && priceArr[0] !== priceArr[priceArr.length - 1]
                        ? `${priceFormat(priceArr[0])} - ${priceFormat(priceArr[priceArr.length - 1])}`
                        : priceFormat(priceArr[0]);

                    return (
                      <Link
                        key={`product-item-${index}`}
                        to={`/${product.category.slug}/${product.slug}`}
                        onClick={() => setIsOpenSearchBox(false)}
                      >
                        <Box
                          padding="10px"
                          display="flex"
                          gap="5px"
                          sx={{
                            '&:hover': {
                              bgcolor: theme.palette.neutral[800],
                            },
                          }}
                        >
                          <img
                            src={product.productItems[0].imageUrl}
                            alt={product.name}
                            style={{
                              width: '50px',
                              height: '50px',
                              objectFit: 'cover',
                              border: '1px solid #e0e0e0',
                              borderRadius: '2px',
                            }}
                          />
                          <Box>
                            <Typography>{product.name}</Typography>
                            <Typography fontWeight={500} color={theme.palette.error.main}>
                              {priceString}
                            </Typography>
                          </Box>
                        </Box>
                      </Link>
                    );
                  })}
                </Box>
              )}
            </Box>
          )}
        </Box>
        {/* search */}

        {/* cart */}
        <Box
          sx={{
            position: 'relative',
            marginRight: '40px',
            '&:hover .cart__box': {
              display: 'block',
            },
          }}
        >
          <Link to="/gio-hang">
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

          <Box
            className="cart__box"
            sx={{
              position: 'absolute',
              top: '100%',
              right: '-8px',
              bgcolor: theme.palette.common.white,
              color: theme.palette.neutral[100],
              width: '400px',
              borderRadius: '3px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
              zIndex: 99,
              transformOrigin: 'calc(100% - 20px) top',
              animation: 'growth 0.25s ease-in-out',
              display: 'none',

              '&::before': {
                content: '""',
                position: 'absolute',
                right: '10px',
                top: '-25px',
                borderWidth: '15px',
                borderStyle: 'solid',
                borderColor: `transparent transparent ${theme.palette.common.white} transparent`,
                zIndex: 99,
              },
            }}
          >
            {user ? (
              <>
                {cartItems.length > 0 ? (
                  <>
                    <Typography sx={{ padding: '10px', color: theme.palette.neutral[300] }}>
                      Sản phẩm đã thêm
                    </Typography>
                    <Box maxHeight="500px" sx={{ overflowY: 'auto' }}>
                      {cartItems.map((cartItem, index) => {
                        let variation = '';
                        const productConfigurations = cartItem.productItem.productConfigurations;
                        productConfigurations?.forEach((productConfiguration, idx) => {
                          variation += productConfiguration.variationOption.value;
                          if (idx !== productConfigurations.length - 1) {
                            variation += ', ';
                          }
                        });

                        return (
                          <Link
                            key={`cart-item-${index}`}
                            to={`/${cartItem.productItem.product.category.slug}/${cartItem.productItem.product.slug}`}
                          >
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              padding="10px"
                              sx={{
                                '&:hover': {
                                  bgcolor: theme.palette.neutral[800],
                                },
                              }}
                            >
                              <Box display="flex" gap="5px">
                                <img
                                  src={cartItem.productItem.imageUrl}
                                  alt={cartItem.productItem.product.name}
                                  style={{
                                    width: '50px',
                                    height: '50px',
                                    objectFit: 'cover',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '2px',
                                  }}
                                />
                                <Box>
                                  <Typography
                                    sx={{
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      maxWidth: '220px',
                                      WebkitLineClamp: 1,
                                      WebkitBoxOrient: 'vertical',
                                      display: '-webkit-box',
                                    }}
                                  >
                                    {cartItem.productItem.product.name}
                                  </Typography>
                                  <Typography fontSize="12px" color={theme.palette.neutral[300]}>
                                    {variation}
                                  </Typography>
                                  <Typography fontSize="12px" color={theme.palette.neutral[300]}>
                                    x{cartItem.quantity}
                                  </Typography>
                                </Box>
                              </Box>

                              <Typography fontWeight={500} color={theme.palette.error.main}>
                                {priceFormat(cartItem.quantity * cartItem.productItem.price)}
                              </Typography>
                            </Box>
                          </Link>
                        );
                      })}
                    </Box>
                    <Box display="flex" justifyContent="flex-end" padding="10px">
                      <Link to="/gio-hang">
                        <Button variant="contained">Xem giỏ hàng</Button>
                      </Link>
                    </Box>
                  </>
                ) : (
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    gap="10px"
                    height="300px"
                  >
                    <MdOutlineRemoveShoppingCartIcon fontSize="50px" />
                    <Typography>Giỏ hàng của bạn còn trống</Typography>
                  </Box>
                )}
              </>
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                gap="10px"
                height="300px"
              >
                <BiLockIcon fontSize="50px" />
                <Typography>Vui lòng đăng nhập để xem giỏ hàng</Typography>
              </Box>
            )}
          </Box>
        </Box>
        {/* cart */}
      </Box>
      {/* end: header center */}
    </>
  );
};

export default Header;
