import { useEffect } from 'react';

import { FeedStats } from '@components/feed-stats/feed-stats';
import { OrderCard } from '@components/order-card/order-card';
//import { connectFeed, disconnectFeed } from '@services/feed/actions';
import { connect, disconnect } from '@services/feed/reducer';
import { useAppDispatch, useAppSelector } from '@services/store';

import styles from './feed.module.css';

export const FeedPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.feed);

  useEffect(() => {
    dispatch(connect());
    return (): void => {
      dispatch(disconnect());
    };
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <h1 className="text text_type_main-large mb-5">Лента заказов</h1>
      <div className={styles.content}>
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} path="/feed" />
          ))}
        </div>
        <div className={styles.stats}>
          <FeedStats />
        </div>
      </div>
    </div>
  );
};
