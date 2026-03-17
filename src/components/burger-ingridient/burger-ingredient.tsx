import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredient.module.css';

type TBurgerIngredientProps = {
  ingredient: TIngredient;
  count?: number;
  onClick?: () => void;
};

const IngredientType = {
  INGREDIENT: 'ingredient',
  BUN: 'bun',
} as const;

export const BurgerIngredient = ({
  ingredient,
  count = 0,
  onClick,
}: TBurgerIngredientProps): React.JSX.Element => {
  const [{ isDragging }, dragRef] = useDrag({
    type: ingredient.type === 'bun' ? IngredientType.BUN : IngredientType.INGREDIENT,
    item: ingredient,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <li
      ref={dragRef as unknown as React.Ref<HTMLLIElement>}
      className={styles.burger_ingredient}
      onClick={onClick}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {count > 0 && <Counter count={count} size="default" extraClass={styles.counter} />}
      <img src={ingredient.image} alt={ingredient.name} />
      <div className={styles.info}>
        <div className={`${styles.price} mt-1 mb-1`}>
          <span className="text text_type_digits-default mr-2">{ingredient.price}</span>
          <CurrencyIcon type="primary" />
        </div>
        <p className="text text_type_main-default">{ingredient.name}</p>
      </div>
    </li>
  );
};
