import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';

import authReducer from './auth/reducer';
import constructorReducer from './burger-constructor/reducer';
import { feedReducer } from './feed/reducer';
import ingredientsReducer from './ingredients/reducer';
import { feedMiddleware, userOrdersMiddleware } from './middleware/socket-middleware';
import orderReducer from './order/reducer';
import ingredientReducer from './selected-ingredient/reducer';
import { userOrdersReducer } from './user-orders/reducer';

export const rootReducer = combineReducers({
  auth: authReducer,
  burgerConstructor: constructorReducer,
  ingredient: ingredientReducer,
  ingredients: ingredientsReducer,
  order: orderReducer,
  feed: feedReducer,
  userOrders: userOrdersReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(feedMiddleware, userOrdersMiddleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export * from './burger-constructor/selector';
