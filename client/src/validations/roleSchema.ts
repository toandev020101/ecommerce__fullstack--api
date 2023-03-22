import * as yup from 'yup';

const roleSchema = yup.object().shape({
  name: yup.string().min(4, 'Tên vai trò phải có ít nhất 4 ký tự!').max(65, 'Tên vai trò chỉ tối đa 65 ký tự!'),
});

export default roleSchema;
