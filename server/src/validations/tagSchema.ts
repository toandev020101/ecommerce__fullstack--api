import * as yup from 'yup';

const tagSchema = yup.object().shape({
  name: yup.string().min(2, 'Tên thẻ phải có ít nhất 2 ký tự!').max(65, 'Tên thẻ chỉ tối đa 65 ký tự!'),
  slug: yup.string().min(2, 'Đường dẫn phải có ít nhất 2 ký tự!').max(65, 'Đường dẫn chỉ tối đa 65 ký tự!'),
});
export default tagSchema;
