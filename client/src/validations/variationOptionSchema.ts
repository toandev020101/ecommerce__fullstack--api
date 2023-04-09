import * as yup from 'yup';

const variationOptionSchema = yup.object().shape({
  value: yup.string().min(2, 'Tên chủng loại phải có ít nhất 2 ký tự!').max(65, 'Tên chủng loại chỉ tối đa 65 ký tự!'),
  slug: yup.string().min(2, 'Đường dẫn phải có ít nhất 2 ký tự!').max(65, 'Đường dẫn chỉ tối đa 65 ký tự!'),
  variationId: yup.number().required('Id thuộc tính không thể để trống!'),
});
export default variationOptionSchema;
