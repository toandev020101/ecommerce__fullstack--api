import { Box, Breadcrumbs, Container, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RiShoppingBag3Fill as RiShoppingBag3FillIcon } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import * as couponApi from '../../../apis/couponApi';
import TitlePage from '../../../components/TitlePage';
import ToastNotify from '../../../components/ToastNotify';
import { Coupon } from '../../../models/Coupon';
import { Theme } from '../../../theme';
import { toDate } from '../../../utils/date';
import { dateToString } from '../../../utils/date';
import { useAppDispatch } from '../../../app/hook';
import { showToast } from '../../../slices/toastSlice';
import { toDateString } from '../../../utils/date';

const VoucherList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme: Theme = useTheme();

  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    const getAllCoupon = async () => {
      try {
        const res = await couponApi.getAllPublic();
        setCoupons(res.data as Coupon[]);
      } catch (error: any) {
        const { data } = error.response;

        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getAllCoupon();
  }, [navigate]);

  const handleStatus = (coupon: Coupon) => {
    const currentDate = new Date();
    const currentDateString = toDateString(currentDate);

    if (toDate(toDateString(coupon.startDate)) > toDate(currentDateString)) {
      return 'chưa được triển khai';
    }

    if (toDate(toDateString(coupon.endDate)) < toDate(currentDateString)) {
      return 'đã quá hạn';
    }

    if (coupon.quantity === 0) {
      return 'đã hết';
    }

    return 'đang hoạt động';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        dispatch(
          showToast({
            page: 'voucher',
            type: 'success',
            message: 'Đã sao chép mã giảm giá: ' + text,
            options: { theme: 'colored', toastId: 'voucherId' },
          }),
        );
      })
      .catch((_err) => {
        dispatch(
          showToast({
            page: 'voucher',
            type: 'error',
            message: 'Lỗi khi sao chép mã giảm giá: ' + text,
            options: { theme: 'colored', toastId: 'voucherId' },
          }),
        );
      });
  };

  return (
    <>
      <TitlePage title="Mã giảm giá" />
      <ToastNotify name="voucher" />

      <Box bgcolor={theme.palette.neutral[950]} padding="20px 0">
        <Container maxWidth="lg">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">Trang chủ</Link>
            <Typography color={theme.palette.primary[500]}>Mã giảm giá</Typography>
          </Breadcrumbs>

          <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="10px" marginTop="20px">
            {coupons.map((coupon, index) => (
              <Box
                key={`coupon-item-${index}`}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                borderRadius="5px"
                padding="15px"
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.secondary[400]}, ${theme.palette.primary[400]})`,
                  color: theme.palette.common.white,
                }}
              >
                <Box display="flex" alignItems="center" gap="5px" marginBottom="10px">
                  <RiShoppingBag3FillIcon size="32px" />
                  <Typography variant="h4" paddingTop="5px">
                    Ecomshop
                  </Typography>
                </Box>

                <Typography fontSize="18px">{coupon.name}</Typography>
                <Typography>{coupon.priceMaxName ? coupon.priceMaxName : 'Không giới hạn giá'}</Typography>

                <Box display="flex" margin="10px 0">
                  <Typography fontSize="18px" padding="3px 8px" border={`1px dashed ${theme.palette.common.white}`}>
                    {coupon.code}
                  </Typography>
                  <Typography
                    fontSize="18px"
                    padding="3px 8px"
                    bgcolor={theme.palette.common.white}
                    color={theme.palette.primary[500]}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => copyToClipboard(coupon.code)}
                  >
                    Sao chép
                  </Typography>
                </Box>

                <Typography>Số lượng: {coupon.quantity}</Typography>

                <Typography>
                  Ngày: {dateToString(coupon.startDate, 1)} - {dateToString(coupon.endDate, 1)}
                </Typography>

                <Typography>Trạng thái: {handleStatus(coupon)}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default VoucherList;
