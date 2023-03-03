import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hook';
import { selectIsAuthenticated } from '../slices/authSlice';

const PrivateRoute: React.FC = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
