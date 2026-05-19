import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppSelector } from '@services/store';

import type { TOrder } from '@utils/types';

import styles from './order-card.module.css';

type TOrderCardProps = {
  order: TOrder;
  path: string;
};

export const OrderCard = ({ order, path }: TOrderCardProps): React.JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ingredients } = useAppSelector((state) => state.ingredients);

  const orderIngredients = order.ingredients
    .map((id) => ingredients.find((ing) => ing._id === id))
    .filter(Boolean);

  const totalPrice = orderIngredients.reduce((sum, ing) => sum + (ing?.price ?? 0), 0);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
    });
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

  return (
    <div
      onClick={() => {
        void navigate(`${path}/${order.number}`, {
          state: { backgroundLocation: location },
        });
      }}
      className={styles.link}
    >
      <div className={`${styles.card} p-6`}>
        <div className={styles.header}>
          <span className="text text_type_digits-default">#{order.number}</span>
          <span className="text text_type_main-default text_color_inactive">
            {formatDate(order.createdAt)}
          </span>
        </div>
        <h3 className="text text_type_main-medium mt-6">{order.name}</h3>
        <p
          className={`text text_type_main-default mt-2 ${getStatusClass(order.status)}`}
        >
          {getStatusText(order.status)}
        </p>
        <div className={styles.footer}>
          <div className={styles.ingredients}>
            {orderIngredients.slice(0, 6).map((ing, index) => (
              <div
                key={index}
                className={styles.ingredient}
                style={{ zIndex: 6 - index }}
              >
                {ing && (
                  <img
                    src={ing.image}
                    alt={ing.name}
                    className={styles.ingredientImage}
                  />
                )}
              </div>
            ))}
            {orderIngredients.length > 6 && (
              <div className={`${styles.moreIngredients} text text_type_main-default`}>
                +{orderIngredients.length - 6}
              </div>
            )}
          </div>
          <div className={styles.price}>
            <span className="text text_type_digits-default">{totalPrice}</span>
            <CurrencyIcon type="primary" />
          </div>
        </div>
      </div>
    </div>
  );
};
