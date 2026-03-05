import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
//import { ingredients } from '@utils/ingredients';
import { INGREDIENTS_URL } from '@utils/constants';

import type { TIngredient } from '@/utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const [error, setError] = useState('');
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getIngredients = async (): Promise<{
    success: boolean;
    data: TIngredient[];
  }> => {
    const response = await fetch(`${INGREDIENTS_URL}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch ingredients: ${response.status}`);
    }
    const result = (await response.json()) as { success: boolean; data: TIngredient[] };
    return result;
  };

  useEffect(() => {
    setIsLoading(true);
    getIngredients()
      .then((result) => {
        console.log('Response: ', result);
        setIngredients(result.data);
      })
      .catch((er) => {
        const errorMessage = er instanceof Error ? er.message : String(er);
        setError(errorMessage);
        console.error('Failed to fetch ingredients:', error);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      {isLoading ? (
        <Preloader />
      ) : (
        <main className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients ingredients={ingredients} />
          <BurgerConstructor ingredients={ingredients} />
        </main>
      )}
    </div>
  );
};

export default App;
