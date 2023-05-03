import * as yup from 'yup';

const cartItemSchema = yup.object().shape({
  quantity: yup.number().required('Số lượng sản phẩm không được bỏ trống!'),
  productItemId: yup.number().required('Id sản phẩm không được bỏ trống!'),
});

export default cartItemSchema;
