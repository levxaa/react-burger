import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import styles from './order-detailes.module.css';
type TOrderDetailesProps = {
  orderNumber?: number;
  orderName?: string;
  isLoading?: boolean;
};

export const OrderDetailes = ({
  orderNumber,
  isLoading,
}: TOrderDetailesProps): React.JSX.Element => {
  if (isLoading) {
    return <div>Заказ формируется...</div>;
  }

  return (
    <div className={`${styles.info}`}>
      <span className="text text_type_digits-large mb-8">{orderNumber}</span>
      <span className="text text_type_main-medium">идентификатор заказа</span>
      <div>
        <CheckMarkIcon type="primary" className="mt-15 mb-15" />
      </div>
      <span className="text text_type_main-small mb-2">Ваш заказ начали готовить</span>
      <span className="text text_type_main-default text_color_inactive">
        Дождитесь готовности на орбитальной станции
      </span>
    </div>
  );
};
