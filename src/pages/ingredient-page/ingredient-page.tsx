import { selectIngredient } from '@/services/selected-ingredient/actions';
import { useAppDispatch, useAppSelector } from '@/services/store';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { IngredientDetails } from '@components/ingredient-detailes/ingredient-detailes';

import styles from './ingredient-page.module.css';

export const IngredientPage = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { ingredients, error } = useAppSelector((state) => state.ingredients);
  const currentIngredient = useAppSelector(
    (state) => state.ingredient.selectedIngredient
  );

  useEffect(() => {
    if (id && ingredients.length > 0) {
      const ingredient = ingredients.find((item) => item._id === id);
      if (ingredient) {
        dispatch(selectIngredient(ingredient));
      }
    }
  }, [id, ingredients, dispatch]);

  if (error) {
    return (
      <div className={styles.page}>
        <h2>Упс, что то пошло не так...</h2>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <IngredientDetails ingredient={currentIngredient} />
      </main>
    </div>
  );
};
