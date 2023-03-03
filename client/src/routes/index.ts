import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';
import Dashboard from '../pages/admin/Dashboard';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';

interface Route {
  path: string;
  component: any;
  layout?: any;
}

export const authRoutes: Route[] = [
  { path: '/login', component: Login, layout: AuthLayout },
  { path: '/register', component: Register, layout: AuthLayout },
];

export const publicRoutes: Route[] = [{ path: '/', component: Home }];

export const privateRoutes: Route[] = [{ path: '/admin', component: Dashboard, layout: AdminLayout }];
