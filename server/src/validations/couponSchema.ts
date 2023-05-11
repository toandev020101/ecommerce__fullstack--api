import * as yup from 'yup';

const couponSchema = yup.object().shape({
  name: yup.string().min(2, 'Tên mã phải có ít nhất 2 ký tự!').max(65, 'Tên mã chỉ tối đa 65 ký tự!'),
  priceMaxName: yup.string().nullable(),
  code: yup.string().min(2, 'Mã phải có ít nhất 2 ký tự!').max(65, 'Mã chỉ tối đa 65 ký tự!'),
  discountValue: yup.number().min(1, 'Giá trị giảm phải lớn hơn 0!'),
  priceMax: yup.number().nullable(),
  type: yup.number(),
  quantity: yup.number().min(0, 'Số lượng phải lớn hơn hoặc bằng 0!'),
  startDate: yup.date().required('Ngày bắt đầu không thể để trống!'),
  endDate: yup.date().required('Ngày kết thúc không thể để trống!'),
});
export default couponSchema;
