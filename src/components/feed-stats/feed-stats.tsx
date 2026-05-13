import { useAppSelector } from '@services/store';

import styles from './feed-stats.module.css';

const MAX_ORDERS_PER_COLUMN = 5;
const MAX_COLUMNS = 2;

export const FeedStats = (): React.JSX.Element => {
  const { orders, total, totalToday } = useAppSelector((state) => state.feed);

  const doneOrders = orders
    .filter((o) => o.status === 'done')
    .slice(0, MAX_ORDERS_PER_COLUMN * MAX_COLUMNS);
  const pendingOrders = orders
    .filter((o) => o.status === 'pending')
    .slice(0, MAX_ORDERS_PER_COLUMN * MAX_COLUMNS);

  const doneColumns: number[][] = [];
  const pendingColumns: number[][] = [];

  for (let i = 0; i < doneOrders.length; i += MAX_ORDERS_PER_COLUMN) {
    doneColumns.push(
      doneOrders.slice(i, i + MAX_ORDERS_PER_COLUMN).map((o) => o.number)
    );
  }

  for (let i = 0; i < pendingOrders.length; i += MAX_ORDERS_PER_COLUMN) {
    pendingColumns.push(
      pendingOrders.slice(i, i + MAX_ORDERS_PER_COLUMN).map((o) => o.number)
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.columns}>
        <div className={styles.column}>
          <p className="text text_type_main-medium mb-6">Готово</p>
          <div className={styles.row}>
            {doneColumns.map((column, colIndex) => (
              <div key={colIndex} className={styles.numbersColumn}>
                {column.map((num) => (
                  <span key={num} className="text text_type_digits-default">
                    {num}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.column}>
          <p className="text text_type_main-medium mb-6">В работе</p>
          <div className={styles.row}>
            {pendingColumns.map((column, colIndex) => (
              <div key={colIndex} className={styles.numbersColumn}>
                {column.map((num) => (
                  <span key={num} className="text text_type_digits-default">
                    {num}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-15">
        <p className="text text_type_main-medium">Выполнено за всё время:</p>
        <p className="text text_type_digits-large">{total}</p>
      </div>
      <div className="mt-5">
        <p className="text text_type_main-medium">Выполнено за сегодня:</p>
        <p className="text text_type_digits-large">{totalToday}</p>
      </div>
    </div>
  );
};
