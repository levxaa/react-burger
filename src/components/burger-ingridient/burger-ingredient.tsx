import 'react';
import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredient.module.css';

type TBurgerIngredientProps = {
  ingredient: TIngredient;
  count?: number;
  onClick?: () => void;
};

export const BurgerIngredient = ({
  ingredient,
  count = 0,
  onClick,
}: TBurgerIngredientProps): React.JSX.Element => {
  return (
    <li className={styles.burger_ingredient} key={ingredient._id} onClick={onClick}>
      {count > 0 && <Counter count={count} size="default" extraClass={styles.counter} />}
      <img className="pl-4" src={ingredient.image} />
      <div className={styles.info}>
        <div className={`${styles.price} mt-1 mb-1`}>
          <span className="text text_type_digits-default mr-2">{ingredient.price}</span>
          <CurrencyIcon type="primary" />
        </div>
        <p className={`text text_type_main-default`}>{ingredient.name}</p>
      </div>
    </li>
  );
};
