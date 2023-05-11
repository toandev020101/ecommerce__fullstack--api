import * as yup from 'yup';

const paymentMethodSchema = yup.object().shape({
  name: yup.string().min(2, 'Tên phương thức phải có ít nhất 2 ký tự!').max(65, 'Tên phương thức chỉ tối đa 65 ký tự!'),
  description: yup.string().min(2, 'Mô tả phải có ít nhất 2 ký tự!'),
});
export default paymentMethodSchema;
