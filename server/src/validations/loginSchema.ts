import * as yup from 'yup';

const loginSchema = yup.object().shape({
  username: yup.string().min(4, 'Tên đăng nhập phải có ít nhất 4 ký tự!').max(20, 'Tên đăng nhập chỉ tối đa 20 ký tự!'),
  password: yup.string().min(4, 'Mật khẩu phải có ít nhất 4 ký tự!').max(20, 'Mật khẩu chỉ tối đa 20 ký tự!'),
});

export default loginSchema;
