import {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} from '@/services/burger-constructor/reducer';
import { createOrder, clearOrder } from '@/services/order/reducer';
import {
  Button,
  ConstructorElement,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useMemo, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useNavigate, useLocation } from 'react-router-dom';

import { useModal } from '@hooks/useModal';
import { useAppSelector, useAppDispatch } from '@services/store';

import { DraggableIngredient } from '../draggable-ingredient/draggable-ingredient';
import { Modal } from '../modal/modal';
import { OrderDetailes } from '../order-detailes/order-detailes';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

const IngredientType = {
  INGREDIENT: 'ingredient',
  BUN: 'bun',
} as const;

export const BurgerConstructor = (): React.JSX.Element => {
  const { isModalOpen, openModal, closeModal } = useModal();
  const [orderNumber, setOrderNumber] = useState<number | undefined>(undefined);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { bun, ingredients: constructorIngredients } = useAppSelector(
    (state) => state.burgerConstructor
  );
  const { loading, error } = useAppSelector((state) => state.order);
  const { isAuth } = useAppSelector((state) => state.auth);

  const totalPrice = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = constructorIngredients.reduce(
      (sum, item) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, constructorIngredients]);

  const [{ isOver }, dropRef] = useDrop({
    accept: [IngredientType.INGREDIENT, IngredientType.BUN],
    drop: (item: TIngredient) => {
      if (item.type === 'bun') {
        dispatch(setBun(item));
      } else {
        dispatch(addIngredient(item));
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  console.log(isOver);

  const handleOrder = useCallback(() => {
    if (!isAuth) {
      void navigate('/login', { state: { from: location } });
      return;
    }

    if (!bun) {
      alert('Выберите булку!');
      return;
    }

    const ingredientIds = [
      bun._id,
      ...constructorIngredients.map((item) => item._id),
      bun._id,
    ];
    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then((result) => {
        setOrderNumber(result.number);
        openModal();
      })
      .catch((err) => {
        console.error('Order failed:', err);
        alert(err);
      });
  }, [isAuth, bun, constructorIngredients, dispatch, navigate, location, openModal]);

  const handleCloseModal = useCallback(() => {
    closeModal();
    setOrderNumber(undefined);
    dispatch(clearOrder());
    dispatch(clearConstructor());
  }, [closeModal, dispatch]);

  const handleRemoveIngredient = useCallback(
    (id: string) => {
      dispatch(removeIngredient(id));
    },
    [dispatch]
  );

  const renderIngredientsPlaceholder = (
    type: 'top' | 'bottom' | 'middle',
    text: string
  ): React.JSX.Element => (
    <div className={`${styles.placeholder} ${type} ml-8 mr-8`}>
      <span className="text text_type_main-default text_color_inactive">{text}</span>
    </div>
  );

  return (
    <>
      <section
        ref={dropRef as unknown as React.Ref<HTMLLIElement>}
        className={`${styles.burger_constructor} pl-4`}
      >
        <div className="pl-8 pb-4 pr-4">
          {bun ? (
            <ConstructorElement
              isLocked
              type="top"
              text={`${bun.name} (верх)`}
              price={bun.price}
              thumbnail={bun.image}
            />
          ) : (
            renderIngredientsPlaceholder('top', 'Перетащите сюда булку')
          )}
        </div>
        <ul className={`${styles.list} custom-scroll pl-4`}>
          {constructorIngredients.length > 0
            ? constructorIngredients.map((item, index) => (
                <DraggableIngredient
                  key={item.id}
                  item={item}
                  index={index}
                  onRemove={handleRemoveIngredient}
                  moveIngredient={moveIngredient}
                />
              ))
            : renderIngredientsPlaceholder('middle', 'Перетаскивайте ингредиенты сюда')}
        </ul>
        <div className="pl-8 pt-4 pr-4">
          {bun ? (
            <ConstructorElement
              isLocked
              type="bottom"
              text={`${bun.name} (низ)`}
              price={bun.price}
              thumbnail={bun.image}
            />
          ) : (
            renderIngredientsPlaceholder('bottom', 'Перетащите сюда булку')
          )}
        </div>
        <div className={`${styles.submit_info} mt-10`}>
          <span className="text text_type_digits-default mr-2">{totalPrice}</span>
          <CurrencyIcon type="primary" className="mr-10" />
          <Button
            htmlType="submit"
            size="medium"
            type="primary"
            onClick={handleOrder}
            disabled={!bun}
          >
            Оформить заказ
          </Button>
        </div>
      </section>
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          {error ? (
            <span>Упс, что то пошло не так...</span>
          ) : (
            <OrderDetailes orderNumber={orderNumber} isLoading={loading} />
          )}
        </Modal>
      )}
    </>
  );
};
