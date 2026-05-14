import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Modal } from '@components/modal/modal';
import { OrderInfo } from '@components/order-info/order-info';
import { useAppSelector } from '@services/store';

export const OrderModal = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const feedOrders = useAppSelector((state) => state.feed.orders);
  const userOrders = useAppSelector((state) => state.userOrders.orders);

  const [order, setOrder] = useState<(typeof feedOrders)[0] | null>(null);

  useEffect(() => {
    if (!id) return;

    const orderNumber = parseInt(id, 10);

    const foundInFeed = feedOrders.find((o) => o.number === orderNumber);
    const foundInUserOrders = userOrders.find((o) => o.number === orderNumber);

    if (foundInFeed) {
      setOrder(foundInFeed);
      return;
    }

    if (foundInUserOrders) {
      setOrder(foundInUserOrders);
    }
  }, [id, feedOrders, userOrders]);

  const handleCloseModal = (): void => {
    void navigate(-1);
  };

  if (!order) {
    return (
      <Modal onClose={handleCloseModal} header="Информация о заказе">
        <div className="text text_type_main-default p-10">Заказ не найден</div>
      </Modal>
    );
  }

  return (
    <Modal onClose={handleCloseModal} header="Информация о заказе">
      <OrderInfo order={order} />
    </Modal>
  );
};
