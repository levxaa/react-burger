import { Navigate, useLocation } from 'react-router-dom';

import { useAppSelector } from '@services/store';

type ProtectedRouteProps = {
  children: React.ReactNode;
  anonymous?: boolean;
};

type TLocationState = {
  from?: {
    pathname: string;
  };
};

export const ProtectedRoute = ({
  children,
  anonymous = false,
}: ProtectedRouteProps): React.JSX.Element => {
  const { isAuth } = useAppSelector((state) => state.auth);
  const location = useLocation() as unknown as Location & {
    state: TLocationState | null;
  };
  const from = location.state?.from?.pathname ?? '/';

  if (anonymous && isAuth) {
    return <Navigate to={from} replace />;
  }

  if (!anonymous && !isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
