import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Modal } from '@components/modal/modal';
import { OrderInfo } from '@components/order-info/order-info';
import { useAppSelector } from '@services/store';
import { getOrderByNumberRequest } from '@utils/api';

import type { TOrder } from '@utils/types';

export const OrderModal = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<TOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const feedOrders = useAppSelector((state) => state.feed.orders);
  const userOrders = useAppSelector((state) => state.userOrders.orders);

  useEffect(() => {
    if (!id) return;

    const orderNumber = parseInt(id, 10);

    const foundInFeed = feedOrders.find((o) => o.number === orderNumber);
    const foundInUserOrders = userOrders.find((o) => o.number === orderNumber);

    if (foundInFeed) {
      setOrder(foundInFeed);
      setIsLoading(false);
      return;
    }

    if (foundInUserOrders) {
      setOrder(foundInUserOrders);
      setIsLoading(false);
      return;
    }

    const fetchOrder = async (): Promise<void> => {
      try {
        const response = await getOrderByNumberRequest(orderNumber);
        if (response.orders && response.orders.length > 0) {
          setOrder(response.orders[0]);
        } else {
          setError('Заказ не найден');
        }
      } catch (e) {
        setError('Ошибка при получении заказа');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchOrder();
  }, [id, feedOrders, userOrders]);

  const handleCloseModal = (): void => {
    void navigate(-1);
  };

  if (isLoading) {
    return <div className="text text_type_main-default p-10">Загрузка...</div>;
  }

  if (error || !order) {
    return (
      <Modal onClose={handleCloseModal} header="Информация о заказе">
        <div className="text text_type_main-default p-10">
          {error && 'Заказ не найден'}
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={handleCloseModal} header="Информация о заказе">
      <OrderInfo order={order} />
    </Modal>
  );
};
