import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import { useAppSelector } from '@services/store';

import type { TOrder } from '@utils/types';

import styles from './order-info.module.css';

type TOrderInfoProps = {
  order: TOrder;
};

export const OrderInfo = ({ order }: TOrderInfoProps): React.JSX.Element => {
  const { ingredients } = useAppSelector((state) => state.ingredients);

  const orderIngredients = order.ingredients
    .map((id) => ingredients.find((ing) => ing._id === id))
    .filter(Boolean);

  const totalPrice = orderIngredients.reduce((sum, ing) => sum + (ing?.price ?? 0), 0);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return `Сегодня, ${date.toLocaleString('ru-RU', { hour: 'numeric', minute: 'numeric', timeZoneName: 'short' })}`;
    }
    if (days === 1) {
      return `Вчера, ${date.toLocaleString('ru-RU', { hour: 'numeric', minute: 'numeric', timeZoneName: 'short' })}`;
    }
    return `${days} дней назад, ${date.toLocaleString('ru-RU', { hour: 'numeric', minute: 'numeric', timeZoneName: 'short' })}`;
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'done':
        return 'Выполнен';
      case 'pending':
        return 'Готовится';
      case 'created':
        return 'Создан';
      default:
        return status;
    }
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'done':
        return styles.status_done;
      case 'pending':
        return styles.status_pending;
      default:
        return '';
    }
  };

  const countIngredients: Record<string, number> = {};
  order.ingredients.forEach((id) => {
    countIngredients[id] = (countIngredients[id] || 0) + 1;
  });

  const uniqueIngredients = orderIngredients.filter(
    (ing, index, arr) => arr.findIndex((i) => i?._id === ing?._id) === index
  );

  return (
    <div className={styles.container}>
      <p className="text text_type_digits-default mb-2">#{order.number}</p>
      <h2 className="text text_type_main-medium mt-4">{order.name}</h2>
      <p className={`text text_type_main-default mt-2 ${getStatusClass(order.status)}`}>
        {getStatusText(order.status)}
      </p>

      <div className="mt-10">
        <p className="text text_type_main-medium mb-6">Состав:</p>
        <div className={styles.ingredientsList}>
          {uniqueIngredients.map((ing) => {
            if (!ing) return null;
            const count = countIngredients[ing._id];
            return (
              <div key={ing._id} className={styles.ingredientRow}>
                <div className={styles.ingredientIcon}>
                  <img
                    src={ing.image}
                    alt={ing.name}
                    className={styles.ingredientImage}
                  />
                </div>
                <span className="text text_type_main-default flex-grow">{ing.name}</span>
                <span className="text text_type_digits-default">
                  {count} x {ing.price}
                </span>
                <CurrencyIcon type="primary" />
              </div>
            );
          })}
        </div>
      </div>

      <div className={`${styles.footer} mt-10`}>
        <span className="text text_type_main-default text_color_inactive">
          {formatDate(order.createdAt)}
        </span>
        <div className={styles.price}>
          <span className="text text_type_digits-default">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};
