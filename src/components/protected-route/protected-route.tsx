import { Navigate, useLocation } from 'react-router-dom';

import { useAppSelector } from '@services/store';

type ProtectedRouteProps = {
  onlyAuth?: boolean;
  children: React.ReactNode;
};

export const ProtectedRoute = ({
  onlyAuth = true,
  children,
}: ProtectedRouteProps): React.JSX.Element => {
  const { isAuth } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (onlyAuth) {
    if (isAuth) {
      return <>{children}</>;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAuth) {
    return <>{children}</>;
  }
  return <Navigate to="/profile" replace />;
};
