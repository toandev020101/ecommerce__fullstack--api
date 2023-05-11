import * as yup from 'yup';

const reviewSchema = yup.object().shape({
  comment: yup.string().min(2, 'Nội dung phải có ít nhất 2 ký tự!').max(300, 'Nội dung chỉ tối đa 300 ký tự!'),
  ratingValue: yup.number().min(0).max(5),
  orderedProductId: yup.number(),
});
export default reviewSchema;
