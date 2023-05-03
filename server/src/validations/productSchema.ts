import * as yup from 'yup';

const productSchema = yup.object().shape({
  imageUrl: yup.string().required('Ảnh sản phẩm không thể để trống!'),
  name: yup.string().min(4, 'Tên sản phẩm phải có ít nhất 4 ký tự!').max(255, 'Tên sản phẩm chỉ tối đa 255 ký tự!'),
  slug: yup.string().min(4, 'Đường dẫn phải có ít nhất 4 ký tự!').max(255, 'Đường dẫn chỉ tối đa 255 ký tự!'),
  weight: yup.number().min(0, 'Trọng lượng phải lớn hơn hoặc bằng 0!'),
  length: yup.number().min(0, 'Chiều dài phải lớn hơn hoặc bằng 0!'),
  width: yup.number().min(0, 'Chiều rộng phải lớn hơn hoặc bằng 0!'),
  height: yup.number().min(0, 'Chiều cao phải lớn hơn hoặc bằng 0!'),
  categoryId: yup.number().required('Danh mục không thể để trống !'),
  isActive: yup.number().required('Trạng thái không thể để trống !'),
  items: yup.array().of(
    yup.object().shape({
      idx: yup.string(),
      SKU: yup.string(),
      price: yup.number().min(0, 'Giá phải lớn hơn hoặc bằng 0!'),
      imageUrl: yup.string().required('Ảnh sản phẩm không thể để trống!'),
      inventory: yup.object().shape({
        quantity: yup.number().min(0, 'Số lượng phải lớn hơn hoặc bằng 0!'),
        priceEntry: yup.number().min(0, 'Giá phải lớn hơn hoặc bằng 0!'),
        locationCode: yup.string().required('Mã vị trí không thể để trống!'),
      }),
    }),
  ),
});
export default productSchema;
