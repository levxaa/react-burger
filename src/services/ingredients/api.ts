import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { TIngredient } from '@/utils/types';

type IngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};

export const ingredientsApi = createApi({
  reducerPath: 'ingredientsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://new-stellarburgers.education-services.ru/api',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getIngredients: builder.query<IngredientsResponse, void>({
      query: () => ({ url: '/ingredients' }),
    }),
  }),
});

export const { useGetIngredientsQuery } = ingredientsApi;
