import {
  selectIngredient,
  clearIngredient,
} from '@/services/selected-ingredient/actions';
import { useAppDispatch, useAppSelector } from '@/services/store';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { IngredientDetails } from '@components/ingredient-detailes/ingredient-detailes';
import { Modal } from '@components/modal/modal';

export const IngredientModal = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { ingredients } = useAppSelector((state) => state.ingredients);
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

  const handleCloseModal = (): void => {
    dispatch(clearIngredient());
    void navigate('/');
  };

  if (!currentIngredient) {
    return <></>;
  }

  return (
    <Modal onClose={handleCloseModal} header="Детали ингредиента">
      <IngredientDetails ingredient={currentIngredient} />
    </Modal>
  );
};
