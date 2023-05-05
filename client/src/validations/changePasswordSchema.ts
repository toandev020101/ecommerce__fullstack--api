import * as yup from 'yup';

const changePasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(4, 'Mật khẩu hiện tại phải có ít nhất 4 ký tự!')
    .max(45, 'Mật khẩu cũ chỉ tối đa 45 ký tự!'),
  newPassword: yup
    .string()
    .min(4, 'Mật khẩu mới phải có ít nhất 4 ký tự!')
    .max(45, 'Mật khẩu mới chỉ tối đa 45 ký tự!'),
  confirmNewPassword: yup
    .string()
    .min(4, 'Mật khẩu mới phải có ít nhất 4 ký tự!')
    .max(45, 'Mật khẩu mới chỉ tối đa 45 ký tự!')
    .oneOf([yup.ref('newPassword')], 'Không khớp mật khẩu mới!'),
});
export default changePasswordSchema;
