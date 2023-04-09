import * as yup from 'yup';

const userSchema = yup.object().shape({
  fullName: yup.string().min(4, 'Họ và tên phải có ít nhất 4 ký tự!').max(45, 'Họ và tên chỉ tối đa 45 ký tự!'),
  username: yup.string().min(4, 'Tên đăng nhập phải có ít nhất 4 ký tự!').max(45, 'Tên đăng nhập chỉ tối đa 45 ký tự!'),
  password: yup.string().min(4, 'Mật khẩu phải có ít nhất 4 ký tự!').max(45, 'Mật khẩu chỉ tối đa 45 ký tự!'),
  gender: yup.number().oneOf([0, 1], 'Giới tính không hợp lệ (Nam / nữ)!'),
  email: yup.string().nullable().email('Email không hợp lệ!'),
  phoneNumber: yup.string().nullable().max(15, 'Số điện thoại chỉ tối đa 15 ký tự!'),
  street: yup.string().nullable(),
  provinceId: yup.string().nullable(),
  districtId: yup.string().nullable(),
  wardId: yup.string().nullable(),
  isActive: yup.number().oneOf([0, 1], 'Trạng thái không hợp lệ!'),
  roleId: yup.number().required('Vai trò không thể để trống!'),
  avatar: yup.string().nullable(),
});
export default userSchema;
