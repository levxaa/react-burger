import { FeedPage } from '@/pages/feed/feed-page';
import { ForgotPasswordPage } from '@/pages/forms/forgot-password/forgot-password-page';
import { Home } from '@/pages/home/home';
import { IngredientPage } from '@/pages/ingredient-page/ingredient-page';
import { LoginPage } from '@/pages/forms/login/login-page';
import { NotFoundPage } from '@/pages/not-found/not-found-page';
import { ProfileForm } from '@/pages/profile/profile-form';
import { ProfileOrderPage } from '@/pages/profile/profile-order-page';
import { ProfilePage } from '@/pages/profile/profile-page';
import { RegisterPage } from '@/pages/forms/register/register-page';
import { ResetPasswordPage } from '@/pages/forms/reset-password/reset-password-page';
import { fetchIngredients } from '@/services/ingredients/reducer';
import { useAppDispatch } from '@/services/store';
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { IngredientModal } from '@components/ingredient-modal/ingredient-modal';

import styles from './app.module.css';

type TLocationState = {
  backgroundLocation?: ReturnType<typeof useLocation>;
};

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(fetchIngredients());
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/ingredients/:id" element={<IngredientPage />} />
        <Route path="/profile" element={<ProfilePage />}>
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
