import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { logout } from '@services/auth/reducer';
import { useAppDispatch } from '@services/store';

import styles from './profile.module.css';

export const ProfilePage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isOrdersActive = location.pathname.includes('/orders');

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    const logoutUser = async (): Promise<void> => {
      await dispatch(logout());
      await navigate('/login', { replace: true });
    };
    void logoutUser();
  };

  return (
    <div className={styles.container}>
      <nav className={styles.menu}>
        <Link
          to="/profile"
          className={`${styles.link} text text_type_main-medium ${
            !isOrdersActive ? styles.link_active : ''
          }`}
        >
          Профиль
        </Link>
        <Link
          to="/profile/orders"
          className={`${styles.link} text text_type_main-medium ${
            isOrdersActive ? styles.link_active : ''
          }`}
        >
          История заказов
        </Link>
        <Link
          to="/login"
          onClick={handleLogout}
          className={`${styles.link} text text_type_main-medium`}
        >
          Выход
        </Link>
        <p
          className={`${styles.menu_hint} text text_type_main-default text_color_inactive mt-20`}
        >
          В этом разделе вы можете изменить свои персональные данные
        </p>
      </nav>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};
