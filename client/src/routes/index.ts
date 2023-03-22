import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';
import Account from '../pages/admin/Account';
import AddOrEditAccount from '../pages/admin/Account/AddOrEditAccount';
import PermissionAccount from '../pages/admin/Account/PermissionAccount';
import RoleAccount from '../pages/admin/Account/RoleAccount';
import AddOrEditRoleAccount from '../pages/admin/Account/RoleAccount/AddOrEditRoleAccount';
import Dashboard from '../pages/admin/Dashboard';
import MediaFile from '../pages/admin/MediaFile';
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
];
