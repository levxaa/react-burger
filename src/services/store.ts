import { configureStore } from '@reduxjs/toolkit';

import { ingredientsApi } from './ingredients/api.ts';

export const store = configureStore({
  reducer: {
    [ingredientsApi.reducerPath]: ingredientsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ingredientsApi.middleware),
});
