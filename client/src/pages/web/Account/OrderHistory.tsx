import {
  Box,
  Button,
  Container,
  Divider,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiSearchAlt as BiSearchAltIcon } from 'react-icons/bi';
import { AiOutlineInbox as AiOutlineInboxIcon } from 'react-icons/ai';
import * as userApi from '../../../apis/userApi';
import * as orderStatusApi from '../../../apis/orderStatusApi';
import * as orderApi from '../../../apis/orderApi';
import { useAppDispatch, useAppSelector } from '../../../app/hook';
import TitlePage from '../../../components/TitlePage';
import ToastNotify from '../../../components/ToastNotify';
import { User } from '../../../models/User';
import { showToast } from '../../../slices/toastSlice';
import { Theme } from '../../../theme';
import JWTManager from '../../../utils/jwt';
import Sidebar from './Sidebar';
import { Order } from '../../../models/Order';
import { OrderStatus } from '../../../models/OrderStatus';
import { priceFormat } from '../../../utils/format';
import { selectIsReload } from '../../../slices/globalSlice';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const OrderHistory: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme: Theme = useTheme();
  const isReload = useAppSelector(selectIsReload);

  const [user, setUser] = useState<User>();
  const [tabActive, setTabActive] = useState<number>(0);
  const [orderStatusArr, setOrderStatusArr] = useState<OrderStatus[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [searchTerm, setSearchTerm] = useState<string>('');

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
    const getAllOrderStatus = async () => {
      try {
        const res = await orderStatusApi.getAll();
        setOrderStatusArr(res.data as OrderStatus[]);
      } catch (error: any) {
        const { data } = error.response;

        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getAllOrderStatus();
  }, [navigate]);

  useEffect(() => {
    const getListOrderByStatusId = async () => {
      const orderStatusId = tabActive > 0 ? orderStatusArr[tabActive - 1].id : -1;

      try {
        const res = await orderApi.getListByStatusId(orderStatusId, searchTerm);
        setOrders(res.data as Order[]);
      } catch (error: any) {
        const { data } = error.response;

        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getListOrderByStatusId();
  }, [tabActive, navigate, orderStatusArr, searchTerm]);

  const handleTabActiveChange = async (_event: React.SyntheticEvent, newValue: number) => {
    setTabActive(newValue);
  };

  const OrderItem: React.FC<{ data: Order }> = ({ data }) => {
    const theme: Theme = useTheme();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleCancelStatusClick = async (id: number) => {
      const orderStatusId = orderStatusArr.find((status) => status.name === 'Đã hủy')?.id as number;

      try {
        const res = await orderApi.changeStatus(id, { orderStatusId });
        dispatch(
          showToast({
            page: 'orderHistory',
            type: 'success',
            message: res.message,
            options: { theme: 'colored', toastId: 'orderHistoryId' },
          }),
        );

        const newOrders = [...orders];
        const newOrderIndex = newOrders.findIndex((newOrder) => newOrder.id === id);
        if (tabActive === 0) {
          newOrders[newOrderIndex].orderStatusId = orderStatusId;
          newOrders[newOrderIndex].orderStatus.id = orderStatusId;
          newOrders[newOrderIndex].orderStatus.name = 'Đã hủy';
        } else {
          newOrders.splice(newOrderIndex, 1);
        }

        setOrders(newOrders);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 403 || data.code === 404) {
          dispatch(
            showToast({
              page: 'orderHistory',
              type: 'error',
              message: data.message,
              options: { theme: 'colored', toastId: 'orderHistoryId' },
            }),
          );
        } else if (data.code === 401 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    return (
      <Box boxShadow="0 1px 2px 0 rgba(0,0,0,.13)" bgcolor={theme.palette.common.white} padding="15px 20px">
        <Box display="flex" justifyContent="space-between" color={theme.palette.primary[500]} textTransform="uppercase">
          <Typography>Mã đơn hàng: #{data.id}</Typography>
          <Typography>{data.orderStatus.name}</Typography>
        </Box>

        <Divider sx={{ margin: '10px 0' }} />

        <Box display="flex" flexDirection="column" gap="10px">
          {data.orderLines.map((orderLine, index) => (
            <Box key={`order-line-item-${index}`} display="flex" justifyContent="space-between" alignItems="center">
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
                {priceFormat(orderLine.price * orderLine.quantity)}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ margin: '10px 0' }} />
        <Box display="flex" flexDirection="column" alignItems="flex-end" gap="20px">
          <Box display="flex" alignItems="center" gap="10px">
            <Typography>Thành tiền: </Typography>
            <Typography fontSize="18px" fontWeight={500} color={theme.palette.error.main}>
              {priceFormat(data.totalPrice)}
            </Typography>
          </Box>
          <Box display="flex" gap="10px">
            {data.orderStatus.name !== 'Chờ xử lý' &&
            data.orderStatus.name !== 'Vận chuyển' &&
            data.orderStatus.name !== 'Đang giao' ? (
              <Button variant="contained">Mua lại</Button>
            ) : (
              <Button variant="contained" onClick={() => handleCancelStatusClick(data.id)}>
                Hủy đơn
              </Button>
            )}

            <Link to={`tel:${data.orderStatus.name === 'Đang giao' ? '0987xxxxxx' : '0924212027'}`}>
              <Button variant="outlined">
                {data.orderStatus.name === 'Đang giao' ? 'Liên hệ Shipper: 0987xxxxxx' : 'Liên hệ shop: 0924212027'}
              </Button>
            </Link>

            {data.orderStatus.name === 'Thành công' && <Button variant="outlined">Đánh giá</Button>}
            <Link to={`/nguoi-dung/don-hang/${data.id}`}>
              <Button variant="outlined">Xem chi tiết</Button>
            </Link>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <>
      <TitlePage title="Lịch sử đơn hàng" />
      <ToastNotify name="orderHistory" />
      <Box bgcolor={theme.palette.neutral[950]} padding="20px 0">
        <Container maxWidth="lg">
          <Box display="flex" gap="20px">
            <Sidebar user={user} />

            <Box flex={1}>
              <Box
                boxShadow="0 1px 2px 0 rgba(0,0,0,.13)"
                bgcolor={theme.palette.common.white}
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tabs value={tabActive} onChange={handleTabActiveChange} centered>
                  <Tab label="Tất cả" {...a11yProps(0)} />
                  {orderStatusArr.map((orderStatus, index) => (
                    <Tab key={`order-status-tab-item-${index}`} label={orderStatus.name} {...a11yProps(index + 1)} />
                  ))}
                </Tabs>
              </Box>
              <TabPanel value={tabActive} index={0}>
                {orders.length > 0 ? (
                  <>
                    <TextField
                      fullWidth
                      placeholder="Tìm kiếm theo mã đơn, tên sản phẩm"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BiSearchAltIcon fontSize="22px" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ marginBottom: '20px' }}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    />

                    <Box display="flex" flexDirection="column" gap="20px">
                      {orders.map((order, index) => (
                        <OrderItem key={`order-item-${index}`} data={order} />
                      ))}
                    </Box>
                  </>
                ) : (
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap="20px"
                    alignItems="center"
                    justifyContent="center"
                    height="400px"
                    boxShadow="0 1px 2px 0 rgba(0,0,0,.13)"
                    bgcolor={theme.palette.common.white}
                  >
                    <AiOutlineInboxIcon fontSize="50px" />
                    <Typography fontSize="16px" fontWeight={500}>
                      Chưa có đơn hàng
                    </Typography>
                  </Box>
                )}
              </TabPanel>
              {orderStatusArr.map((_, index) => (
                <TabPanel key={`order-status-tabPanel-item-${index}`} value={tabActive} index={index + 1}>
                  {orders.length > 0 ? (
                    <Box display="flex" flexDirection="column" gap="20px">
                      {orders.map((order, index) => (
                        <OrderItem key={`order-item-${index}`} data={order} />
                      ))}
                    </Box>
                  ) : (
                    <Box
                      display="flex"
                      flexDirection="column"
                      gap="20px"
                      alignItems="center"
                      justifyContent="center"
                      height="400px"
                      boxShadow="0 1px 2px 0 rgba(0,0,0,.13)"
                      bgcolor={theme.palette.common.white}
                    >
                      <AiOutlineInboxIcon fontSize="50px" />
                      <Typography fontSize="16px" fontWeight={500}>
                        Chưa có đơn hàng
                      </Typography>
                    </Box>
                  )}
                </TabPanel>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default OrderHistory;
