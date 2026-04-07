import { FeedPage } from '@/pages/feed/feed-page';
import { ForgotPasswordPage } from '@/pages/forms/forgot-password/forgot-password-page';
import { LoginPage } from '@/pages/forms/login/login-page';
import { RegisterPage } from '@/pages/forms/register/register-page';
import { ResetPasswordPage } from '@/pages/forms/reset-password/reset-password-page';
import { Home } from '@/pages/home/home';
import { IngredientPage } from '@/pages/ingredient-page/ingredient-page';
import { NotFoundPage } from '@/pages/not-found/not-found-page';
import { ProfileOrderPage } from '@/pages/profile/orders/profile-order-page';
import { ProfileForm } from '@/pages/profile/profile-form';
import { ProfilePage } from '@/pages/profile/profile-page';
import { checkAuth } from '@/services/auth/reducer';
import { fetchIngredients } from '@/services/ingredients/reducer';
import { useAppDispatch } from '@/services/store';
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { IngredientModal } from '@components/ingredient-modal/ingredient-modal';
import { ProtectedRoute } from '@components/protected-route/protected-route';

import styles from './app.module.css';

type TLocationState = {
  backgroundLocation?: ReturnType<typeof useLocation>;
  from?: {
    pathname: string;
  };
};

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(fetchIngredients());
    void dispatch(checkAuth());
  }, [dispatch]);

  const location = useLocation() as unknown as Location & {
    state: TLocationState | null;
  };
  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation ?? location}>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <ProtectedRoute onlyAuth={false}>
              <LoginPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyAuth={false}>
              <RegisterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyAuth={false}>
              <ForgotPasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyAuth={false}>
              <ResetPasswordPage />
            </ProtectedRoute>
          }
        />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/ingredients/:id" element={<IngredientPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfileForm />} />
          <Route path="orders" element={<ProfileOrderPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route path="/ingredients/:id" element={<IngredientModal />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
