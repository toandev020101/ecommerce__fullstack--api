import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RiCoupon3Line as RiCoupon3LineIcon, RiMapPinFill as RiMapPinFillIcon } from 'react-icons/ri';
import { BiX as BiXIcon } from 'react-icons/bi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as districtApi from '../../../apis/districtApi';
import * as orderApi from '../../../apis/orderApi';
import * as paymentMethodApi from '../../../apis/paymentMethodApi';
import * as provinceApi from '../../../apis/provinceApi';
import * as shipMethodApi from '../../../apis/shipMethodApi';
import * as userApi from '../../../apis/userApi';
import * as wardApi from '../../../apis/wardApi';
import * as couponApi from '../../../apis/couponApi';
import { useAppDispatch, useAppSelector } from '../../../app/hook';
import InputField from '../../../components/InputField';
import SearchField from '../../../components/SearchField';
import TitlePage from '../../../components/TitlePage';
import ToastNotify from '../../../components/ToastNotify';
import { FieldError } from '../../../interfaces/FieldError';
import { HeadCell } from '../../../interfaces/HeadCell';
import { OrderInput } from '../../../interfaces/OrderInput';
import { ValueObject } from '../../../interfaces/ValueObject';
import { CartItem } from '../../../models/CartItem';
import { District } from '../../../models/District';
import { PaymentMethod } from '../../../models/PaymentMethod';
import { Province } from '../../../models/Province';
import { ShipMethod } from '../../../models/ShipMethod';
import { User } from '../../../models/User';
import { Ward } from '../../../models/Ward';
import { selectIsAuthenticated } from '../../../slices/authSlice';
import { showToast } from '../../../slices/toastSlice';
import { Theme } from '../../../theme';
import { toDate } from '../../../utils/date';
import { priceFormat } from '../../../utils/format';
import JWTManager from '../../../utils/jwt';
import orderSchema from '../../../validations/orderSchema';
import { Coupon } from '../../../models/Coupon';

const Checkout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme: Theme = useTheme();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [checkouts, setCheckouts] = useState<CartItem[]>([]);
  const [openUpdateInfoDialog, setOpenUpdateInfoDialog] = useState<boolean>(false);
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [userInfo, setUserInfo] = useState<{
    fullName: string;
    phoneNumber: string;
    street: string;
    provinceId: number;
    districtId: number;
    wardId: number;
  }>();

  const [provinceOptions, setProvinceOptions] = useState<ValueObject[]>([]);
  const [districtOptions, setDistrictOptions] = useState<ValueObject[]>([]);
  const [wardOptions, setWardOptions] = useState<ValueObject[]>([]);

  const [provinceSearchValue, setProvinceSearchValue] = useState<ValueObject>();
  const [districtSearchValue, setDistrictSearchValue] = useState<ValueObject>();
  const [wardSearchValue, setWardSearchValue] = useState<ValueObject>();

  const [provinceSearchTerm, setProvinceSearchTerm] = useState<string>('');
  const [districtSearchTerm, setDistrictSearchTerm] = useState<string>('');
  const [wardSearchTerm, setWardSearchTerm] = useState<string>('');

  const [provinceId, setProvinceId] = useState<number>(-1);
  const [districtId, setDistrictId] = useState<number>(-1);

  const [note, setNote] = useState<string>();
  const [shipMethods, setShipMethods] = useState<ShipMethod[]>([]);
  const [shipMethodValue, setShipMethodValue] = useState<number>();
  const [openUpdateShipMethodDialog, setOpenUpdateShipMethodDialog] = useState<boolean>(false);
  const [shipMethodActive, setShipMethodActive] = useState<ShipMethod>();

  const [coupons, setCoupons] = useState<{ code: string; price: number }[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentMethodActive, setPaymentMethodActive] = useState<PaymentMethod>();
  const [voucherValue, setVoucherValue] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [shipPrice, setShipPrice] = useState<number>(0);
  const [totalVoucherPrice, setTotalVoucherPrice] = useState<number>(0);

  const headCells: readonly HeadCell[] = [
    {
      label: 'Sản phẩm',
      numeric: false,
    },
    {
      label: 'Đơn giá',
      numeric: false,
    },
    {
      label: 'Số lượng',
      numeric: false,
    },
    {
      label: 'Thành tiền',
      numeric: false,
    },
  ];

  const form = useForm<OrderInput>({
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      street: '',
      provinceId: '',
      districtId: '',
      wardId: '',
    },
    resolver: yupResolver(orderSchema),
  });

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(
        showToast({
          page: 'login',
          type: 'error',
          message: 'Vui lòng đăng nhập tài khoản của bạn',
          options: { theme: 'colored', toastId: 'loginId' },
        }),
      );
      navigate('/dang-nhap');
    }
  }, [dispatch, isAuthenticated, navigate]);

  useEffect(() => {
    if (!location.state || !location.state.checkouts || !location.state.totalPrice) {
      dispatch(
        showToast({
          page: 'cart',
          type: 'error',
          message: 'Vui lòng chọn sản phẩm',
          options: { theme: 'colored', toastId: 'cartId' },
        }),
      );

      navigate('/gio-hang');
    } else if (location.state && location.state.checkouts) {
      setCheckouts(location.state.checkouts as CartItem[]);
      setTotalPrice(location.state.totalPrice as number);
    }
  }, [location.state, dispatch, navigate]);

  useEffect(() => {
    const getOneUser = async () => {
      try {
        const res = await userApi.getOneAndRoleByIdPublic(JWTManager.getUserId() as number);
        const resData = res.data as User;

        setUserInfo({
          fullName: resData.fullName,
          phoneNumber: resData.phoneNumber ? resData.phoneNumber : '',
          street: resData.street ? resData.street : '',
          wardId: resData.wardId ? resData.wardId : -1,
          districtId: resData.districtId ? resData.districtId : -1,
          provinceId: resData.provinceId ? resData.provinceId : -1,
        });

        setProvinceId(resData.provinceId ? resData.provinceId : -1);
        setDistrictId(resData.districtId ? resData.districtId : -1);

        setProvinceSearchValue({ label: resData.province?.name as string, value: resData.provinceId as number });
        setDistrictSearchValue({ label: resData.district?.name as string, value: resData.districtId as number });
        setWardSearchValue({ label: resData.ward?.name as string, value: resData.wardId as number });

        form.reset({
          fullName: resData.fullName,
          phoneNumber: resData.phoneNumber ? resData.phoneNumber : '',
          street: resData.street ? resData.street : '',
          provinceId: resData.provinceId ? resData.provinceId : '',
          districtId: resData.districtId ? resData.districtId : '',
          wardId: resData.wardId ? resData.wardId : '',
        });
      } catch (error: any) {
        const { data } = error.response;

        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getOneUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  useEffect(() => {
    const getListProvinceBySearchTerm = async () => {
      try {
        const res = await provinceApi.getListBySearchTerm(provinceSearchTerm);
        const resData = res.data as Province[];
        let data: ValueObject[] = [];

        for (let i = 0; i < resData.length; i++) {
          data.push({ label: resData[i].name, value: resData[i].id });
        }
        setProvinceOptions(data);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getListProvinceBySearchTerm();
  }, [provinceSearchTerm, navigate]);

  useEffect(() => {
    const getListDistrictByProvinceIdAndSearchTerm = async () => {
      try {
        const res = await districtApi.getListByProvinceIdAndSearchTerm(provinceId, districtSearchTerm);
        const resData = res.data as District[];
        let data: ValueObject[] = [];

        for (let i = 0; i < resData.length; i++) {
          data.push({ label: resData[i].name, value: resData[i].id });
        }
        setDistrictOptions(data);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };
    getListDistrictByProvinceIdAndSearchTerm();
  }, [districtSearchTerm, navigate, provinceId]);

  useEffect(() => {
    const getListWardByDistrictIdAndSearchTerm = async () => {
      try {
        const res = await wardApi.getListByDistrictIdAndSearchTerm(districtId, wardSearchTerm);
        const resData = res.data as Ward[];
        let data: ValueObject[] = [];

        for (let i = 0; i < resData.length; i++) {
          data.push({ label: resData[i].name, value: resData[i].id });
        }
        setWardOptions(data);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getListWardByDistrictIdAndSearchTerm();
  }, [wardSearchTerm, navigate, districtId]);

  useEffect(() => {
    const getAllShipMethod = async () => {
      try {
        const res = await shipMethodApi.getAll();
        const resData = res.data as ShipMethod[];

        setShipMethods(resData);
        setShipMethodActive(resData[0]);
        setShipMethodValue(resData[0].id);
        setShipPrice(resData[0].price);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getAllShipMethod();
  }, [navigate]);

  useEffect(() => {
    const getAllPaymentMethod = async () => {
      try {
        const res = await paymentMethodApi.getAll();
        const resData = res.data as PaymentMethod[];

        setPaymentMethods(resData);
        setPaymentMethodActive(resData[0]);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getAllPaymentMethod();
  }, [navigate]);

  const handleUpdateInfoDialogClose = () => {
    setOpenUpdateInfoDialog(false);
  };

  const handleUpdateShipMethodDialogClose = () => {
    setOpenUpdateShipMethodDialog(false);
  };

  const handleDiscount = (row: CartItem) => {
    const currentDate = new Date();
    const productItem = row.productItem;
    if (
      productItem &&
      toDate(productItem.discountStartDate) <= currentDate &&
      toDate(productItem.discountEndDate) >= currentDate
    ) {
      return true;
    }
    return false;
  };

  const handleVoucherClick = async () => {
    try {
      const res = await couponApi.checkOne(voucherValue as string);
      const resData = res.data as Coupon;

      const newCoupons = [...coupons];
      const newCouponIndex = newCoupons.findIndex((newCoupon) => newCoupon.code === resData.code);
      if (newCouponIndex === -1) {
        let newCoupon = { code: resData.code, price: 0 };
        let newTotalVoucherPrice = totalVoucherPrice;
        if (resData.type === 1) {
          if (resData.priceMax && (totalPrice * resData.discountValue) / 100 > resData.priceMax) {
            newCoupon.price = resData.priceMax;
          } else {
            newCoupon.price = (totalPrice * resData.discountValue) / 100;
          }
        } else {
          newCoupon.price = resData.discountValue;
        }

        newCoupons.push(newCoupon);
        setCoupons(newCoupons);

        newTotalVoucherPrice += newCoupon.price;
        setTotalVoucherPrice(newTotalVoucherPrice);

        dispatch(
          showToast({
            page: 'checkout',
            type: 'success',
            message: res.message,
            options: { theme: 'colored', toastId: 'checkoutId' },
          }),
        );
      } else {
        dispatch(
          showToast({
            page: 'checkout',
            type: 'warning',
            message: 'Mã giảm giá đã được áp dụng',
            options: { theme: 'colored', toastId: 'checkoutId' },
          }),
        );
      }
    } catch (error: any) {
      const { data } = error.response;
      if (data.code === 400 || data.code === 403 || data.code === 404) {
        setErrors(data.errors);
        dispatch(
          showToast({
            page: 'checkout',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'checkoutId' },
          }),
        );
      } else if (data.code === 401 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  const handleVoucherDelete = (index: number) => {
    const newCoupons = [...coupons];

    const newTotalVoucherPrice = totalVoucherPrice - newCoupons[index].price;
    setTotalVoucherPrice(newTotalVoucherPrice);

    newCoupons.splice(index, 1);
    setCoupons(newCoupons);
  };

  const handleUpdateInfoSubmit = (values: any) => {
    setUserInfo(values);
  };

  const handleCheckoutSubmit = async () => {
    setIsLoading(true);

    let totalQuantity = 0;
    checkouts.forEach((checkout) => {
      totalQuantity += checkout.quantity;
    });

    const values: OrderInput = {
      fullName: userInfo?.fullName as string,
      phoneNumber: userInfo?.phoneNumber as string,
      totalQuantity,
      totalPrice: totalPrice + shipPrice - totalVoucherPrice,
      street: userInfo?.street as string,
      wardId: userInfo?.wardId as number,
      districtId: userInfo?.districtId as number,
      provinceId: userInfo?.provinceId as number,
      note: note as string,
      shipMethodId: shipMethodActive?.id as number,
      paymentMethodId: paymentMethodActive?.id as number,
      lines: checkouts.map((checkout) => {
        // handle variation active
        let variationActive = '';
        if (checkout.productItem.productConfigurations) {
          checkout.productItem.productConfigurations.forEach((productConfiguration, index) => {
            variationActive += productConfiguration.variationOption.value;
            if (index !== (checkout.productItem.productConfigurations?.length as number) - 1) {
              variationActive += ', ';
            }
          });
        }

        return {
          variation: variationActive,
          quantity: checkout.quantity,
          price: handleDiscount(checkout) ? checkout.productItem.discount : checkout.productItem.price,
          productItemId: checkout.productItemId,
        };
      }),
      coupons,
    };

    try {
      const res = await orderApi.addOne(values);

      dispatch(
        showToast({
          page: 'orderAccount',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'orderAccountId' },
        }),
      );
      setIsLoading(false);
      navigate('/nguoi-dung/don-hang');
    } catch (error: any) {
      setIsLoading(false);

      const { data } = error.response;
      if (data.code === 403 || data.code === 400) {
        setErrors(data.errors);
        dispatch(
          showToast({
            page: 'checkout',
            type: 'error',
            message: data.errors[0].message,
            options: { theme: 'colored', toastId: 'checkoutId' },
          }),
        );
      } else if (data.code === 401 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  return (
    <>
      <TitlePage title="Thanh toán" />
      <ToastNotify name="checkout" />

      <Box bgcolor={theme.palette.neutral[950]} padding="20px 0">
        <Container maxWidth="lg">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">Trang chủ</Link>
            <Typography color={theme.palette.primary[500]}>Thanh toán</Typography>
          </Breadcrumbs>

          {/* address */}
          <Box
            marginTop="20px"
            bgcolor={theme.palette.neutral[1000]}
            padding="20px"
            marginBottom="20px"
            boxShadow="0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)"
            borderRadius="5px"
          >
            <Box display="flex" alignItems="center" gap="5px" color={theme.palette.primary[500]}>
              <RiMapPinFillIcon fontSize="18px" />
              <Typography fontSize="16px" fontWeight={500}>
                Địa Chỉ Nhận Hàng
              </Typography>
            </Box>

            <Box marginTop="15px" display="flex" alignItems="center" gap="20px">
              <Box display="flex" alignItems="center" gap="10px">
                <Typography fontSize="16px" fontWeight={500}>
                  {userInfo?.fullName}
                </Typography>
                <Typography
                  fontSize="16px"
                  fontWeight={500}
                  color={userInfo?.phoneNumber ? theme.palette.neutral[100] : theme.palette.neutral[500]}
                >
                  {userInfo?.phoneNumber ? userInfo?.phoneNumber : 'Chưa có số điện thoại'}
                </Typography>
              </Box>

              <Typography
                fontWeight={500}
                color={
                  userInfo?.street && userInfo.wardId !== -1 && userInfo.districtId !== -1 && userInfo.provinceId !== -1
                    ? theme.palette.neutral[100]
                    : theme.palette.neutral[500]
                }
              >
                {userInfo?.street && userInfo.wardId !== -1 && userInfo.districtId !== -1 && userInfo.provinceId !== -1
                  ? `${userInfo.street}, ${wardSearchValue?.label}, ${districtSearchValue?.label}, ${provinceSearchValue?.label}`
                  : 'Chưa có địa chỉ'}
              </Typography>

              <Button
                variant="contained"
                size="small"
                sx={{ textTransform: 'none' }}
                onClick={() => setOpenUpdateInfoDialog(true)}
              >
                Thay đổi
              </Button>
            </Box>
          </Box>

          <Dialog
            open={openUpdateInfoDialog}
            onClose={handleUpdateInfoDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title" sx={{ fontSize: '18px' }}>
              Cập nhật địa chỉ của tôi
            </DialogTitle>
            <DialogContent>
              <Box component="form" onSubmit={form.handleSubmit(handleUpdateInfoSubmit)} width="500px">
                <Box display="flex" gap="10px" marginTop="10px">
                  <InputField
                    form={form}
                    errorServers={errors}
                    setErrorServers={setErrors}
                    name="fullName"
                    label="Họ và tên"
                  />

                  <InputField
                    form={form}
                    errorServers={errors}
                    setErrorServers={setErrors}
                    name="phoneNumber"
                    label="Số điện thoại"
                  />
                </Box>

                <Box display="flex" gap="10px">
                  <SearchField
                    form={form}
                    name="provinceId"
                    options={provinceOptions}
                    searchValue={provinceSearchValue}
                    label="Tìm kiếm tỉnh, thành phố"
                    onHandleChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setProvinceSearchTerm(e.target.value);
                      setDistrictSearchValue(undefined);
                      setWardSearchValue(undefined);
                    }}
                    onHandleOptionChange={(option: ValueObject) => {
                      setProvinceId(option.value as number);
                      setProvinceSearchValue(option);
                      setDistrictId(-1);
                      setDistrictSearchValue(undefined);
                      setWardSearchValue(undefined);
                    }}
                  />

                  <SearchField
                    form={form}
                    name="districtId"
                    options={districtOptions}
                    searchValue={districtSearchValue}
                    label="Tìm kiếm quận, huyện"
                    onHandleChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setDistrictSearchTerm(e.target.value);
                      setWardSearchValue(undefined);
                    }}
                    onHandleOptionChange={(option: ValueObject) => {
                      setDistrictId(option.value as number);
                      setDistrictSearchValue(option);
                      setWardSearchValue(undefined);
                    }}
                    disabled={provinceId === -1}
                  />
                </Box>

                <Box display="flex" gap="10px" marginBottom="10px">
                  <SearchField
                    form={form}
                    name="wardId"
                    options={wardOptions}
                    searchValue={wardSearchValue}
                    label="Tìm kiếm phường, xã"
                    onHandleChange={(e: ChangeEvent<HTMLInputElement>) => setWardSearchTerm(e.target.value)}
                    onHandleOptionChange={(option: ValueObject) => {
                      setWardSearchValue(option);
                    }}
                    disabled={districtId === -1}
                  />

                  <InputField
                    form={form}
                    errorServers={errors}
                    setErrorServers={setErrors}
                    name="street"
                    label="Số nhà, đường"
                  />
                </Box>

                <Box display="flex" justifyContent="flex-end" gap="10px">
                  <Button variant="outlined" onClick={handleUpdateInfoDialogClose} type="submit">
                    Xác nhận
                  </Button>
                  <Button variant="outlined" onClick={handleUpdateInfoDialogClose} color="error">
                    Hủy
                  </Button>
                </Box>
              </Box>
            </DialogContent>
          </Dialog>
          {/* address */}

          {/* table */}
          <Box marginTop="20px">
            <TableContainer component={Paper}>
              <Table
                sx={{
                  minWidth: 500,
                }}
                aria-label="custom pagination table"
              >
                <TableHead>
                  <TableRow>
                    {headCells.map((headCell, index) => (
                      <TableCell
                        key={`header-cell-${index}`}
                        align={headCell.numeric ? 'right' : 'left'}
                        sx={{ fontSize: '14px' }}
                        width={headCell.width}
                      >
                        <Typography fontWeight={500}>{headCell.label}</Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* table content */}
                  {checkouts.map((row, index) => {
                    // handle variation active
                    let variationActive = '';
                    if (row.productItem.productConfigurations) {
                      row.productItem.productConfigurations.forEach((productConfiguration, index) => {
                        variationActive += productConfiguration.variationOption.value;
                        if (index !== (row.productItem.productConfigurations?.length as number) - 1) {
                          variationActive += ', ';
                        }
                      });
                    }

                    return (
                      <TableRow key={`table-${index}`} hover role="checkbox" tabIndex={-1}>
                        <TableCell sx={{ fontSize: '14px' }}>
                          <Box display="flex" gap="10px">
                            <img
                              src={row.productItem.imageUrl}
                              alt={row.productItem.product.name}
                              style={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'cover',
                              }}
                            />
                            <Box>
                              <Typography fontSize="16px">{row.productItem.product.name}</Typography>
                              <Typography>{variationActive}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>
                          <Box display="flex" gap="10px">
                            {handleDiscount(row) && (
                              <Typography sx={{ color: theme.palette.neutral[300], textDecoration: 'line-through' }}>
                                {priceFormat(row.productItem.price)}
                              </Typography>
                            )}
                            <Typography>
                              {priceFormat(handleDiscount(row) ? row.productItem.discount : row.productItem.price)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>{row.quantity}</TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>
                          <Typography color={theme.palette.error.main}>
                            {priceFormat(
                              handleDiscount(row)
                                ? row.productItem.discount * row.quantity
                                : row.productItem.price * row.quantity,
                            )}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {/* table content */}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          {/* table */}

          {/* note */}
          <Box
            marginTop="10px"
            bgcolor={theme.palette.neutral[1000]}
            padding="20px"
            marginBottom="20px"
            boxShadow="0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)"
            borderRadius="5px"
          >
            <Box width="400px">
              <TextField
                name="note"
                label="Ghi chú"
                multiline
                maxRows={4}
                sx={{ width: '350px', marginBottom: '10px' }}
                value={note}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNote(e.target.value)}
              />
            </Box>

            <Box
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
              gap="10px"
              paddingTop="10px"
              borderTop="1px dashed #ccc"
            >
              <Typography>Tổng số tiền ({checkouts.length} sản phẩm):</Typography>
              <Typography fontSize="16px" fontWeight={500} color={theme.palette.error.main}>
                {priceFormat(totalPrice)}
              </Typography>
            </Box>
          </Box>
          {/* note */}

          <Box display="flex" gap="20px" marginTop="20px">
            {/* shipping method */}
            <Box
              width="100%"
              bgcolor={theme.palette.neutral[1000]}
              padding="20px"
              marginBottom="20px"
              boxShadow="0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)"
              borderRadius="5px"
            >
              <Box display="flex" alignItems="center" gap="20px">
                <Box display="flex" alignItems="center" gap="10px">
                  <Typography fontSize="16px">Phương thức giao hàng:</Typography>
                  <Typography fontSize="16px" color={theme.palette.primary[500]}>
                    {shipMethodActive?.name}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  sx={{ textTransform: 'none' }}
                  onClick={() => setOpenUpdateShipMethodDialog(true)}
                >
                  Thay đổi
                </Button>

                <Dialog
                  open={openUpdateShipMethodDialog}
                  onClose={handleUpdateShipMethodDialogClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title" sx={{ fontSize: '18px' }}>
                    Chọn phương thức giao hàng
                  </DialogTitle>
                  <DialogContent sx={{ minWidth: '400px' }}>
                    {shipMethods.map((shipMethod, index) => (
                      <Box
                        key={`ship-method-item-${index}`}
                        component="label"
                        htmlFor={`ship-method-item-${index}`}
                        display="flex"
                        alignItems="center"
                        gap="10px"
                      >
                        <Radio
                          id={`ship-method-item-${index}`}
                          checked={shipMethodValue === shipMethod.id}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setShipMethodValue(parseInt(e.target.value))}
                          value={shipMethod.id}
                        />
                        <Typography fontWeight={500}>{shipMethod.name}</Typography>
                        <Typography fontWeight={500} color={theme.palette.error.main}>
                          {priceFormat(shipMethod.price)}
                        </Typography>
                      </Box>
                    ))}
                  </DialogContent>
                  <DialogActions>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        const newShipMethodActive = shipMethods.find((shipMethod) => shipMethod.id === shipMethodValue);

                        handleUpdateShipMethodDialogClose();
                        setShipMethodActive(newShipMethodActive);
                        setShipPrice(newShipMethodActive?.price as number);
                      }}
                    >
                      Xác nhận
                    </Button>
                    <Button variant="outlined" onClick={handleUpdateShipMethodDialogClose} color="error">
                      Hủy
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>

              <Typography fontWeight={500} color={theme.palette.error.main}>
                + {shipMethodActive ? priceFormat(shipMethodActive.price) : '0đ'}
              </Typography>
            </Box>
            {/* shipping method */}

            {/* coupon */}
            <Box
              width="100%"
              bgcolor={theme.palette.neutral[1000]}
              padding="20px"
              marginBottom="20px"
              boxShadow="0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)"
              borderRadius="5px"
            >
              <Box display="flex" justifyContent="flex-end" alignItems="center" gap="20px">
                <Box display="flex" alignItems="center" gap="10px">
                  <RiCoupon3LineIcon fontSize="20px" color={theme.palette.primary[500]} />
                  <Typography fontSize="16px">Ecomshop Voucher</Typography>
                </Box>

                <Box display="flex" alignItems="center" gap="10px">
                  <TextField
                    variant="outlined"
                    label="Mã giảm giá"
                    size="small"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setVoucherValue(e.target.value)}
                  />
                  <Button variant="contained" onClick={handleVoucherClick}>
                    Áp dụng
                  </Button>
                </Box>
              </Box>

              <Box marginTop="10px">
                {coupons.map((coupon, index) => (
                  <Box
                    key={`coupon-item-${index}`}
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                    gap="10px"
                  >
                    <Typography>{coupon.code}</Typography>

                    <Typography fontWeight={500} color={theme.palette.error.main}>
                      - {priceFormat(coupon.price)}
                    </Typography>

                    <Typography
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',

                        '&:hover': {
                          color: theme.palette.error.main,
                          cursor: 'pointer',
                        },
                      }}
                      onClick={() => handleVoucherDelete(index)}
                    >
                      <BiXIcon fontSize="18px" />
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            {/* coupon */}
          </Box>

          {/* payment method */}
          <Box
            bgcolor={theme.palette.neutral[1000]}
            padding="20px"
            marginBottom="20px"
            boxShadow="0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)"
            borderRadius="5px"
          >
            <Box display="flex" alignItems="center" gap="20px">
              <Typography fontSize="16px">Phương thức thanh toán</Typography>

              <Box display="flex" alignItems="center" gap="10px">
                {paymentMethods.map((paymentMethod, index) => (
                  <Button
                    key={`payment-method-item-${index}`}
                    variant={paymentMethodActive?.id === paymentMethod.id ? 'contained' : 'outlined'}
                    onClick={() => setPaymentMethodActive(paymentMethod)}
                  >
                    {paymentMethod.name}
                  </Button>
                ))}
              </Box>
            </Box>

            <Typography marginTop="20px">{paymentMethodActive?.description}</Typography>
          </Box>
          {/* payment method */}

          {/* payment price */}
          <Box display="flex" justifyContent="flex-end">
            <Box
              bgcolor={theme.palette.neutral[1000]}
              padding="20px"
              marginBottom="20px"
              boxShadow="0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)"
              borderRadius="5px"
              display="flex"
              flexDirection="column"
              alignItems="flex-end"
              gap="20px"
            >
              <Box width="300px" display="flex" flexDirection="column" gap="10px">
                <Box display="flex" justifyContent="space-between">
                  <Typography color={theme.palette.neutral[300]}>Tổng tiền hàng</Typography>
                  <Typography>{priceFormat(totalPrice)}</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Typography color={theme.palette.neutral[300]}>Phí vận chuyển</Typography>
                  <Typography>+ {priceFormat(shipPrice)}</Typography>
                </Box>

                {totalVoucherPrice > 0 && (
                  <Box display="flex" justifyContent="space-between">
                    <Typography color={theme.palette.neutral[300]}>Tổng cộng Voucher giảm giá</Typography>
                    <Typography>- {priceFormat(totalVoucherPrice)}</Typography>
                  </Box>
                )}

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography color={theme.palette.neutral[300]}>Tổng thanh toán</Typography>
                  <Typography fontSize="20px" fontWeight={500} color={theme.palette.error.main}>
                    {priceFormat(totalPrice + shipPrice - totalVoucherPrice)}
                  </Typography>
                </Box>
              </Box>

              <LoadingButton loading={isLoading} variant="contained" size="large" onClick={handleCheckoutSubmit}>
                Đặt hàng
              </LoadingButton>
            </Box>
          </Box>
          {/* payment price */}
        </Container>
      </Box>
    </>
  );
};

export default Checkout;
