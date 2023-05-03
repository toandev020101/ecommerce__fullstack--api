import * as yup from 'yup';

const orderSchema = yup.object().shape({
  fullName: yup.string().min(4, 'Họ và tên phải có ít nhất 4 ký tự!').max(45, 'Họ và tên chỉ tối đa 45 ký tự!'),
  phoneNumber: yup.string().min(10, 'Số điện thoại có ít nhất 10 ký tự!').max(15, 'Số điện thoại chỉ tối đa 15 ký tự!'),
  street: yup.string().required('Đường không thể để trống!'),
  wardId: yup.number().min(0, 'Id phường, xã phải lớn hơn hoặc bằng 0!'),
  districtId: yup.number().min(0, 'Id quận, huyện phải lớn hơn hoặc bằng 0!'),
  provinceId: yup.number().min(0, 'Id tỉnh, thành phố lớn hơn hoặc bằng 0!'),
});
export default orderSchema;
