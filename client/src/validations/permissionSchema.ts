import * as yup from 'yup';

const permissionSchema = yup.object().shape({
  name: yup.string().min(4, 'Tên quyền phải có ít nhất 4 ký tự!').max(65, 'Tên quyền chỉ tối đa 65 ký tự!'),
  slug: yup.string().min(4, 'Đường dẫn phải có ít nhất 4 ký tự!').max(65, 'Đường dẫn chỉ tối đa 65 ký tự!'),
  method: yup.string().required('Hành động không thể để trống!'),
});

export default permissionSchema;
