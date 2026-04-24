import { useAppSelector } from '@/services/store';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import styles from './home.module.css';

export const Home = (): React.JSX.Element => {
  const { loading, error } = useAppSelector((state) => state.ingredients);

  return (
    <div className={styles.home}>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <main className={`${styles.main} pl-5 pr-5`}>
          {error ? (
            <h2>Упс, что то пошло не так...</h2>
          ) : (
            <DndProvider backend={HTML5Backend}>
              <BurgerIngredients />
              <BurgerConstructor />
            </DndProvider>
          )}
        </main>
      )}
    </div>
  );
};
