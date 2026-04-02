import {
  selectIngredientCounts,
  useAppDispatch,
  useAppSelector,
} from '@/services/store';
import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

import { selectIngredient } from '@services/selected-ingredient/actions';

import { BurgerIngredient } from '../burger-ingridient/burger-ingredient';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = (): React.JSX.Element => {
  const [currentTab, setCurrentTab] = useState('bun');
  const ingredientCount = useAppSelector(selectIngredientCounts);
  const location = useLocation();
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { ingredients } = useAppSelector((state) => state.ingredients);

  const bunRef = useRef<HTMLHeadingElement>(null);
  const mainRef = useRef<HTMLHeadingElement>(null);
  const sauceRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const sections = [
    { ref: bunRef, id: 'bun' },
    { ref: mainRef, id: 'main' },
    { ref: sauceRef, id: 'sauce' },
  ];

  const handleTabClick = useCallback((val: string) => {
    setCurrentTab(val);

    sections.forEach(({ ref, id }) => {
      if (id === val) {
        ref.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  }, []);

  const handleScroll = useCallback(() => {
    let closestId = currentTab;
    let minDistance = Infinity;

    const containerTop = sectionRef.current?.getBoundingClientRect().top ?? 0;

    sections.forEach(({ ref, id }) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const distance = Math.abs(rect.top - containerTop);

        if (distance < minDistance) {
          minDistance = distance;
          closestId = id;
        }
      }
    });

    if (closestId !== currentTab) {
      setCurrentTab(closestId);
    }
  }, [currentTab]);

  useEffect(() => {
    const ingredientId = params.id;
    if (ingredientId && ingredients.length > 0) {
      const ingredient = ingredients.find((item) => item._id === ingredientId);
      if (ingredient) {
        dispatch(selectIngredient(ingredient));
      }
    }
  }, [params.id, ingredients, dispatch]);

  const renderIngredientsSection = (
    sectionIngredients: TIngredient[]
  ): React.JSX.Element => (
    <ul className={`${styles.ingredients_tab_content} pl-4 pr-1`}>
      {sectionIngredients.map((item) => (
        <BurgerIngredient
          key={item._id}
          ingredient={item}
          count={ingredientCount[item._id] || 0}
          onClick={() => {
            const ingredient = ingredients.find((i) => i._id === item._id);
            if (ingredient) {
              dispatch(selectIngredient(ingredient));
            }
            void navigate(`/ingredients/${item._id}`, {
              state: { backgroundLocation: location },
            });
          }}
        />
      ))}
    </ul>
  );

  return (
    <>
      <section className={styles.burger_ingredients}>
        <nav>
          <ul className={styles.menu}>
            <Tab
              value="bun"
              active={currentTab === 'bun'}
              onClick={() => {
                handleTabClick('bun');
              }}
            >
              Булки
            </Tab>
            <Tab
              value="main"
              active={currentTab === 'main'}
              onClick={() => {
                handleTabClick('main');
              }}
            >
              Начинки
            </Tab>
            <Tab
              value="sauce"
              active={currentTab === 'sauce'}
              onClick={() => {
                handleTabClick('sauce');
              }}
            >
              Соусы
            </Tab>
          </ul>
        </nav>
        <section
          ref={sectionRef}
          onScroll={handleScroll}
          className={`${styles.burger_ingredients_section} custom-scroll`}
        >
          <h2 ref={bunRef} className="text text_type_main-medium mt-10 mb-6">
            Булки
          </h2>
          {renderIngredientsSection(ingredients.filter((item) => item.type === 'bun'))}
          <h2 ref={mainRef} className="text text_type_main-medium mt-10 mb-6">
            Начинки
          </h2>
          {renderIngredientsSection(ingredients.filter((item) => item.type === 'main'))}
          <h2 ref={sauceRef} className="text text_type_main-medium mt-10 mb-6">
            Соусы
          </h2>
          {renderIngredientsSection(ingredients.filter((item) => item.type === 'sauce'))}
        </section>
      </section>
    </>
  );
};
