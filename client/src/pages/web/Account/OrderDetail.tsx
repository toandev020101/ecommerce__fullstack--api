import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BiChevronLeft as BiChevronLeftIcon } from 'react-icons/bi';
import { FiMapPin as FiMapPinIcon } from 'react-icons/fi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as userApi from '../../../apis/userApi';
import * as orderApi from '../../../apis/orderApi';
import { useAppDispatch, useAppSelector } from '../../../app/hook';
import TitlePage from '../../../components/TitlePage';
import { User } from '../../../models/User';
import { showToast } from '../../../slices/toastSlice';
import { Theme } from '../../../theme';
import JWTManager from '../../../utils/jwt';
import Sidebar from './Sidebar';
import { Order } from '../../../models/Order';
import { priceFormat } from '../../../utils/format';
import { selectIsReload } from '../../../slices/globalSlice';

const OrderDetail: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme: Theme = useTheme();
  const isReload = useAppSelector(selectIsReload);
  const { id } = useParams();

  const [user, setUser] = useState<User>();
  const [order, setOrder] = useState<Order>();

  useEffect(() => {
    const getOneUser = async () => {
      try {
        const res = await userApi.getOneAndRoleByIdPublic(JWTManager.getUserId() as number);
        const resData = res.data as User;
        setUser(resData);
      } catch (error: any) {
        const { data } = error.response;

        if (data.code === 401) {
          dispatch(
            showToast({
              page: 'login',
              type: 'error',
              message: 'Vui lòng đăng nhập tài khoản của bạn',
              options: { theme: 'colored', toastId: 'loginId' },
            }),
          );
          navigate('/dang-nhap');
        } else if (data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getOneUser();
  }, [navigate, dispatch, isReload]);

  useEffect(() => {
    const getOneOrder = async () => {
      try {
        const res = await orderApi.getOneById(parseInt(id as string));
        const resData = res.data as Order;
        setOrder(resData);
      } catch (error: any) {
        const { data } = error.response;

        if (data.code === 403) {
          dispatch(
            showToast({
              page: 'orderHistory',
              type: 'error',
              message: data.message,
              options: { theme: 'colored', toastId: 'orderHistoryId' },
            }),
          );
          navigate('/nguoi-dung/don-hang');
        } else if (data.code === 401 || data.code === 404 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getOneOrder();
  }, [navigate, dispatch, id]);

  const handleTotalPrice = () => {
    let totalPrice = 0;
    order?.orderLines.forEach((line) => {
      totalPrice += line.price * line.quantity;
    });

    return totalPrice;
  };

  const handleTotalVoucherPrice = () => {
    let totalVoucherPrice = 0;
    order?.orderCoupons.forEach((coupon) => {
      totalVoucherPrice += coupon.price;
    });

    return totalVoucherPrice;
  };

  return (
    <>
      <TitlePage title={`Xem chi tiết đơn hàng #${id}`} />
      <Box bgcolor={theme.palette.neutral[950]} padding="20px 0">
        <Container maxWidth="lg">
          <Box display="flex" gap="20px">
            <Sidebar user={user} />
            <Box
              padding="15px 30px"
              boxShadow="0 1px 2px 0 rgba(0,0,0,.13)"
              borderRadius="5px"
              bgcolor={theme.palette.common.white}
              flex={1}
            >
              {/* header */}
              <Box
                color={theme.palette.primary[500]}
                textTransform="uppercase"
                display="flex"
                justifyContent="space-between"
              >
                <Link to="/nguoi-dung/don-hang">
                  <Box display="flex" alignItems="center" gap="5px">
                    <BiChevronLeftIcon fontSize="22px" />
                    <Typography>Trở lại</Typography>
                  </Box>
                </Link>

                <Box display="flex">
                  <Typography>Mã đơn hàng: #{order?.id}</Typography>
                  <Typography sx={{ marginLeft: '10px', paddingLeft: '10px', borderLeft: '1px solid #e0e0e0' }}>
                    {order?.orderStatus.name}
                  </Typography>
                </Box>
              </Box>
              {/* header */}

              <Box marginTop="20px">
                <Box display="flex" alignItems="center" gap="10px">
                  <FiMapPinIcon fontSize="18px" />
                  <Typography fontSize="18px">Địa chỉ nhận hàng</Typography>
                </Box>
                <Box marginTop="5px" display="flex" gap="10px" alignItems="center">
                  <Typography fontSize="16px">{order?.fullName}</Typography>
                  <Typography color={theme.palette.neutral[300]}>{order?.phoneNumber}</Typography>
                  <Typography color={theme.palette.neutral[300]}>
                    {order?.street}, {order?.ward.name}, {order?.district.name}, {order?.province.name}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" flexDirection="column" gap="10px" marginTop="20px">
                {order?.orderLines.map((orderLine, index) => (
                  <Box
                    key={`order-line-item-${index}`}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box display="flex" gap="10px">
                      <img
                        src={orderLine.productItem.product.imageUrl}
                        alt={orderLine.productItem.product.name}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          border: '1px solid #e0e0e0',
                          borderRadius: '3px',
                        }}
                      />
                      <Box>
                        <Typography fontSize="16px" fontWeight={500}>
                          {orderLine.productItem.product.name}
                        </Typography>
                        <Typography color={theme.palette.neutral[300]}>{orderLine.variation}</Typography>
                        <Typography>x{orderLine.quantity}</Typography>
                      </Box>
                    </Box>

                    <Typography fontSize="16px" fontWeight={500} color={theme.palette.error.main}>
                      {priceFormat(orderLine.quantity * orderLine.price)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box display="flex" flexDirection="column" alignItems="flex-end" marginTop="20px" gap="10px">
                <Box display="flex" justifyContent="space-between" minWidth="350px">
                  <Typography>Tổng tiền hàng: </Typography>
                  <Typography>{priceFormat(handleTotalPrice())}</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" minWidth="350px">
                  <Typography>Phí vận chuyển: </Typography>
                  <Typography>+{priceFormat(order ? order.shipMethod.price : 0)}</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" minWidth="350px">
                  <Typography>Voucher từ Ecomshop: </Typography>
                  <Typography>-{priceFormat(handleTotalVoucherPrice())}</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center" minWidth="350px">
                  <Typography>Thành tiền: </Typography>
                  <Typography fontSize="16px" fontWeight={500} sx={{ color: theme.palette.error.main }}>
                    {priceFormat(order ? order.totalPrice : 0)}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" minWidth="350px">
                  <Typography>Phương thức thanh toán: </Typography>
                  <Typography>{order?.paymentMethod.name}</Typography>
                </Box>
              </Box>

              <Box display="flex" justifyContent="flex-end" gap="10px" marginTop="20px">
                {order?.orderStatus.name !== 'Chờ xử lý' &&
                order?.orderStatus.name !== 'Vận chuyển' &&
                order?.orderStatus.name !== 'Đang giao' ? (
                  <Button variant="contained">Mua lại</Button>
                ) : (
                  <Button variant="contained">Hủy đơn</Button>
                )}

                <Link to={`tel:${order?.orderStatus.name === 'Đang giao' ? '0987xxxxxx' : '0924212027'}`}>
                  <Button variant="outlined">
                    {order?.orderStatus.name === 'Đang giao'
                      ? 'Liên hệ Shipper: 0987xxxxxx'
                      : 'Liên hệ shop: 0924212027'}
                  </Button>
                </Link>

                {order?.orderStatus.name === 'Thành công' && <Button variant="outlined">Đánh giá</Button>}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default OrderDetail;
