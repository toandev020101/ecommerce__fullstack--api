import { Category } from './Category';
import { ProductItem } from './Product';

export interface CartItem {
  id: number;
  quantity: number;
  productItemId: number;
  productItem: ProductItem & {
    product: {
      id: number;
      name: string;
      slug: string;
      productItems: ProductItem[];
      category: Category;
    };
  };
  userId: number;
}
