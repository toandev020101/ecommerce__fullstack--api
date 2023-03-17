import * as yup from 'yup';

const registerSchema = yup.object().shape({
  fullName: yup.string().min(4, 'Họ và tên phải có ít nhất 4 ký tự!').max(45, 'Họ và tên chỉ tối đa 45 ký tự!'),
  username: yup.string().min(4, 'Tên đăng nhập phải có ít nhất 4 ký tự!').max(45, 'Tên đăng nhập chỉ tối đa 45 ký tự!'),
  password: yup.string().min(4, 'Mật khẩu phải có ít nhất 4 ký tự!').max(45, 'Mật khẩu chỉ tối đa 45 ký tự!'),
  gender: yup.number().oneOf([0, 1], 'Giới tính không hợp lệ (Nam / nữ)!'),
});
export default registerSchema;
