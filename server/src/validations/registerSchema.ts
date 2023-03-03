import * as yup from 'yup';

const registerSchema = yup.object().shape({
  firstName: yup.string().min(2, 'Họ phải có ít nhất 2 ký tự!').max(20, 'Họ chỉ tối đa 20 ký tự!'),
  lastName: yup.string().min(2, 'Tên phải có ít nhất 2 ký tự!').max(20, 'Tên chỉ tối đa 20 ký tự!'),
  username: yup.string().min(4, 'Tên đăng nhập phải có ít nhất 4 ký tự!').max(45, 'Tên đăng nhập chỉ tối đa 45 ký tự!'),
  password: yup.string().min(4, 'Mật khẩu phải có ít nhất 4 ký tự!').max(45, 'Mật khẩu chỉ tối đa 45 ký tự!'),
  gender: yup.number().oneOf([0, 1], 'Giới tính không hợp lệ (Nam / nữ)!'),
});
export default registerSchema;
