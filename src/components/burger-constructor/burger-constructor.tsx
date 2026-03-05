import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import { Modal } from '../Modal/modal';
import { OrderDetailes } from '../order_detailes/order_detailes';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';
type TBurgerConstructorProps = {
  ingredients: TIngredient[];
};

export const BurgerConstructor = ({
  ingredients,
}: TBurgerConstructorProps): React.JSX.Element => {
  const [showModal, setShowModal] = useState(false);

  console.log(ingredients);
  const ingredientToDisplay = ingredients.filter((item) => item.type !== 'bun');

  return (
    <>
      <section className={`${styles.burger_constructor} pl-4`}>
        <div className="pl-8 pb-4 pr-4">
          <ConstructorElement
            isLocked
            price={200}
            text="Краторная булка N-200i (верх)"
            thumbnail="https://react-burger-ui-components.education-services.ru/assets/img-CFqVEZmj.png"
            type="top"
          />
        </div>
        <ul className={`${styles.list} custom-scroll pl-4`}>
          {ingredientToDisplay.map((item) => (
            <div className={`${styles.list_item}`} key={item._id}>
              <DragIcon type="primary" />
              <ConstructorElement
                text={item.name}
                price={item.price}
                thumbnail={item.image}
              />
            </div>
          ))}
        </ul>
        <div className="pl-8 pt-4 pr-4">
          <ConstructorElement
            isLocked
            price={200}
            text="Краторная булка N-200i (верх)"
            thumbnail="https://react-burger-ui-components.education-services.ru/assets/img-CFqVEZmj.png"
            type="bottom"
          />
        </div>
        <div className={`${styles.submit_info} mt-10`}>
          <span className="text text_type_digits-default mr-2">610</span>
          <CurrencyIcon type="primary" className="mr-10" />
          <Button
            htmlType="submit"
            size="medium"
            type="primary"
            onClick={() => {
              setShowModal(!showModal);
            }}
          >
            Оформить заказ
          </Button>
        </div>
      </section>
      {showModal && (
        <Modal onClose={() => setShowModal(!showModal)}>
          {<OrderDetailes id="034536" />}
        </Modal>
      )}
    </>
  );
};
