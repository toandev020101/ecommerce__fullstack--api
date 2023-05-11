import * as yup from 'yup';

const shipMethodSchema = yup.object().shape({
  name: yup.string().min(2, 'Tên phương thức phải có ít nhất 2 ký tự!').max(65, 'Tên phương thức chỉ tối đa 65 ký tự!'),
  price: yup.number().min(0, 'Giá phải lớn hơn hoặc bằng 0!'),
});
export default shipMethodSchema;
