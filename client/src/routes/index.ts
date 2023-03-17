import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';
import Account from '../pages/admin/Account';
import AddOrEditAccount from '../pages/admin/Account/AddOrEditAccount';
import Dashboard from '../pages/admin/Dashboard';
import MediaFile from '../pages/admin/MediaFile';
import AddMediaFile from '../pages/admin/MediaFile/AddMediaFile';
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
  { path: '/quan-tri/kho-luu-tru/them-moi', component: AddMediaFile, layout: AdminLayout },

  { path: '/quan-tri/tai-khoan/danh-sach', component: Account, layout: AdminLayout },
  { path: '/quan-tri/tai-khoan/danh-sach/them-moi', component: AddOrEditAccount, layout: AdminLayout },
];
