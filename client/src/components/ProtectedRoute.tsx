import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hook';

interface Props {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: Props) => {
  const { user, initialized } = useAppSelector((state) => state.auth);

  if (!initialized) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
