import * as yup from 'yup';

const orderSchema = yup.object().shape({
  fullName: yup.string().min(4, 'Họ và tên phải có ít nhất 4 ký tự!').max(45, 'Họ và tên chỉ tối đa 45 ký tự!'),
  phoneNumber: yup.string().min(10, 'Số điện thoại có ít nhất 10 ký tự!').max(15, 'Số điện thoại chỉ tối đa 15 ký tự!'),
  totalQuantity: yup.number().min(0, 'Tổng số lượng phải lớn hơn hoặc bằng 0!'),
  totalPrice: yup.number().min(0, 'Tổng giá phải lớn hơn hoặc bằng 0!'),
  street: yup.string().required('Đường không thể để trống!'),
  wardId: yup.number().min(0, 'Id phường, xã phải lớn hơn hoặc bằng 0!'),
  districtId: yup.number().min(0, 'Id quận, huyện phải lớn hơn hoặc bằng 0!'),
  provinceId: yup.number().min(0, 'Id tỉnh, thành phố lớn hơn hoặc bằng 0!'),
  lines: yup.array().of(
    yup.object().shape({
      variation: yup.string().required('Thuộc tính không thể để trống!'),
      quantity: yup.number().min(1, 'Số lượng phải lớn hơn hoặc bằng 1!'),
      price: yup.number().min(0, 'Giá phải lớn hơn hoặc bằng 0!'),
      productItemId: yup.number().min(0, 'Id sản phẩm phải lớn hơn hoặc bằng 0!'),
    }),
  ),
});
export default orderSchema;
