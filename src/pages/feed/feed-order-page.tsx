import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { OrderInfo } from '@components/order-info/order-info';
import { connect, disconnect } from '@services/feed/reducer';
import { useAppDispatch, useAppSelector } from '@services/store';

import styles from './feed-order-page.module.css';

export const FeedOrderPage = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const feedOrders = useAppSelector((state) => state.feed.orders);
  const isConnected = useAppSelector((state) => state.feed.isConnected);

  const [order, setOrder] = useState<(typeof feedOrders)[0] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected) {
      dispatch(connect());
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
    const foundInFeed = feedOrders.find((o) => o.number === orderNumber);

    if (foundInFeed) {
      setOrder(foundInFeed);
      setError(null);
      return;
    }

    setError('Заказ не найден');
    setOrder(null);
  }, [id, feedOrders]);

  if (error || !order) {
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <p className="text text_type_main-default">{error ?? 'Заказ не найден'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <OrderInfo order={order} />
      </div>
    </div>
  );
};
