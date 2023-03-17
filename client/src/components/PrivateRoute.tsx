import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hook';
import { selectIsAuthenticated } from '../slices/authSlice';

const PrivateRoute: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/dang-nhap');
    }
  }, [isAuthenticated, navigate]);

  return <Outlet />;
};

export default PrivateRoute;
