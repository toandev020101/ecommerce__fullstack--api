import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';
import Account from '../pages/admin/Account';
import AddOrEditAccount from '../pages/admin/Account/AddOrEditAccount';
import PermissionAccount from '../pages/admin/Account/PermissionAccount';
import RoleAccount from '../pages/admin/Account/RoleAccount';
import AddOrEditRoleAccount from '../pages/admin/Account/RoleAccount/AddOrEditRoleAccount';
import Dashboard from '../pages/admin/Dashboard';
import MediaFile from '../pages/admin/MediaFile';
import ProductManager from '../pages/admin/ProductManager';
import AddOrEditProduct from '../pages/admin/ProductManager/AddOrEditProduct';
import CategoryProduct from '../pages/admin/ProductManager/CategoryProduct';
import AddOrEditCategoryProduct from '../pages/admin/ProductManager/CategoryProduct/AddOrEditCategoryProduct';
import TagProduct from '../pages/admin/ProductManager/TagProduct';
import VariationProduct from '../pages/admin/ProductManager/VariationProduct';
import VariationOptionProduct from '../pages/admin/ProductManager/VariationProduct/VariationOptionProduct';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';

interface Route {
  path: string;
  component: any;
  layout?: any;
}

export const authRoutes: Route[] = [
  { path: '/dang-nhap', component: Login, layout: AuthLayout },
  { path: '/dang-ky', component: Register, layout: AuthLayout },
];

export const publicRoutes: Route[] = [{ path: '/', component: Home }];

export const privateRoutes: Route[] = [
  { path: '/quan-tri', component: Dashboard, layout: AdminLayout },

  { path: '/quan-tri/kho-luu-tru', component: MediaFile, layout: AdminLayout },

  { path: '/quan-tri/tai-khoan/danh-sach', component: Account, layout: AdminLayout },
  { path: '/quan-tri/tai-khoan/danh-sach/them-moi', component: AddOrEditAccount, layout: AdminLayout },
  { path: '/quan-tri/tai-khoan/danh-sach/chinh-sua/:id', component: AddOrEditAccount, layout: AdminLayout },

  { path: '/quan-tri/tai-khoan/vai-tro', component: RoleAccount, layout: AdminLayout },
  { path: '/quan-tri/tai-khoan/vai-tro/them-moi', component: AddOrEditRoleAccount, layout: AdminLayout },
  { path: '/quan-tri/tai-khoan/vai-tro/chinh-sua/:id', component: AddOrEditRoleAccount, layout: AdminLayout },

  { path: '/quan-tri/tai-khoan/quyen', component: PermissionAccount, layout: AdminLayout },

  { path: '/quan-tri/san-pham/danh-sach', component: ProductManager, layout: AdminLayout },
  { path: '/quan-tri/san-pham/danh-sach/them-moi', component: AddOrEditProduct, layout: AdminLayout },
  { path: '/quan-tri/san-pham/danh-sach/chinh-sua/:id', component: AddOrEditProduct, layout: AdminLayout },

  { path: '/quan-tri/san-pham/danh-muc', component: CategoryProduct, layout: AdminLayout },
  { path: '/quan-tri/san-pham/danh-muc/them-moi', component: AddOrEditCategoryProduct, layout: AdminLayout },
  { path: '/quan-tri/san-pham/danh-muc/chinh-sua/:id', component: AddOrEditCategoryProduct, layout: AdminLayout },

  { path: '/quan-tri/san-pham/tu-khoa', component: TagProduct, layout: AdminLayout },

  { path: '/quan-tri/san-pham/thuoc-tinh', component: VariationProduct, layout: AdminLayout },
  {
    path: '/quan-tri/san-pham/thuoc-tinh/:variationId/chung-loai',
    component: VariationOptionProduct,
    layout: AdminLayout,
  },
];
