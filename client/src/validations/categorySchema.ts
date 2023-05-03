import * as yup from 'yup';

const categorySchema = yup.object().shape({
  name: yup.string().min(2, 'Tên danh mục phải có ít nhất 2 ký tự!').max(100, 'Tên danh mục chỉ tối đa 100 ký tự!'),
  slug: yup
    .string()
    .min(2, 'Đường dẫn danh mục phải có ít nhất 2 ký tự!')
    .max(100, 'Đường dẫn danh mục chỉ tối đa 100 ký tự!'),
  level: yup.number().required('Vị trí danh mục không thể để trống!'),
  parentId: yup.string().nullable(),
  isActive: yup.number().oneOf([0, 1], 'Trạng thái không hợp lệ!'),
});

export default categorySchema;
