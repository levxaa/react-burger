import { getAccessToken } from '@/utils/api';
import { useEffect } from 'react';

import { OrderCard } from '@components/order-card/order-card';
import { useAppDispatch, useAppSelector } from '@services/store';
import { connect, disconnect } from '@services/user-orders/reducer';

import styles from './profile-orders.module.css';

export const ProfileOrderPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { orders, error } = useAppSelector((state) => state.userOrders);
  const isAuth = useAppSelector((state) => state.auth.isAuth);

  useEffect(() => {
    if (!isAuth) {
      dispatch({
        type: 'userOrders/onError',
        payload: 'Требуется авторизация',
      });
      return;
    }

    const token = getAccessToken();
    console.log(`token ${token}`);

    if (token) {
      dispatch(connect(token));
    } else {
      dispatch({
        type: 'userOrders/onError',
        payload: 'Сессия истекла, войдите снова',
      });
    }
    return (): void => {
      dispatch(disconnect());
    };
  }, [dispatch, isAuth]);

  if (error) {
    return (
      <div className={styles.container}>
        <p className="text text_type_main-default text_color_error">{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.ordersList}>
        {orders?.map((order) => (
          <OrderCard key={order._id} order={order} path="/profile/orders" />
        ))}
        {(!orders || orders.length === 0) && (
          <p className="text text_type_main-default text_color_inactive">
            У вас пока нет заказов
          </p>
        )}
      </div>
    </div>
  );
};
