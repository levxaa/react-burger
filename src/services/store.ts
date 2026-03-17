import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';

import constructorReducer from './burger-constructor/reducer';
import ingredientsReducer from './ingredients/reducer';
import orderReducer from './order/reducer';
import ingredientReducer from './selected-ingredient/reducer';

export const rootReducer = combineReducers({
  burgerConstructor: constructorReducer,
  ingredient: ingredientReducer,
  ingredients: ingredientsReducer,
  order: orderReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export * from './burger-constructor/selector';
