import 'react';

import type { TIngredient } from '@utils/types';

import styles from './ingredient_detailes.module.css';

type TIngredientDetailsProps = {
  ingredient: TIngredient | undefined;
};

export const IngredientDetails = ({
  ingredient,
}: TIngredientDetailsProps): React.JSX.Element => {
  const renderInfo = (desc: string, val: number): React.JSX.Element => (
    <ul className={styles.field as string}>
      <span className="text text_type_main-default text_color_inactive">{desc}</span>
      <span className="text text_type_main-default text_color_inactive">{val}</span>
    </ul>
  );

  if (!ingredient) {
    return (
      <div>
        <span className="text text_type_main-medium">Ингредиент не найден</span>
      </div>
    );
  }

  return (
    <div className={styles.ingredient}>
      <img src={ingredient.image} className="mb-4" />
      <span className={`text text text_type_main-medium mb-8`}>{ingredient.name}</span>
      <ul className={styles.detailed_info}>
        {renderInfo('Калории, ккал', ingredient.calories)}
        {renderInfo('Белки, г', ingredient.proteins)}
        {renderInfo('Жири, г', ingredient.fat)}
        {renderInfo('Углеводы, г', ingredient.carbohydrates)}
      </ul>
    </div>
  );
};
