import { useAppDispatch, useAppSelector } from '@/services/store';
import { getAccessToken } from '@/utils/api';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { OrderInfo } from '@components/order-info/order-info';
import { connect, disconnect } from '@services/user-orders/reducer';

import styles from './profile-order-info.module.css';

export const ProfileOrderInfoPage = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const userOrders = useAppSelector((state) => state.userOrders.orders);
  const isConnected = useAppSelector((state) => state.userOrders.isConnected);

  const [order, setOrder] = useState<(typeof userOrders)[0] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected) {
      const token = getAccessToken();
      if (token) {
        dispatch(connect(token));
      }
    }
  }, [dispatch, isConnected]);

  useEffect(() => {
    return (): void => {
      dispatch(disconnect());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!id) return;

    const orderNumber = parseInt(id, 10);
    const foundInUserOrders = userOrders.find((o) => o.number === orderNumber);

    if (foundInUserOrders) {
      setOrder(foundInUserOrders);
      setError(null);
      return;
    }

    setError('Заказ не найден');
    setOrder(null);
  }, [id, userOrders]);

  if (error || !order) {
    return (
      <div className={styles.page}>
        <p className="text text_type_main-default">{error ?? 'Заказ не найден'}</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <OrderInfo order={order} />
    </div>
  );
};
