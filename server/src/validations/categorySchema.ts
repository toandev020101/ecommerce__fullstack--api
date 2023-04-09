import * as yup from 'yup';

const categorySchema = yup.object().shape({
  imageUrl: yup.string().required('Hình ảnh danh mục không thể để trống'),
  name: yup.string().min(4, 'Tên danh mục phải có ít nhất 4 ký tự!').max(100, 'Tên danh mục chỉ tối đa 100 ký tự!'),
  slug: yup
    .string()
    .min(4, 'Đường dẫn danh mục phải có ít nhất 4 ký tự!')
    .max(100, 'Đường dẫn danh mục chỉ tối đa 100 ký tự!'),
  level: yup.number().required('Vị trí danh mục không thể để trống!'),
  parentId: yup.number().nullable(),
  isActive: yup.number().oneOf([0, 1], 'Trạng thái không hợp lệ!'),
});

export default categorySchema;
