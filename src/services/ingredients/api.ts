import { BASE_URL } from '@/utils/constants';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { TIngredient } from '@/utils/types';
type IngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};

type OrderRequest = {
  ingredients: string[];
};

type OrderResponse = {
  success: boolean;
  name: string;
  order: {
    number: number;
  };
};

export const ingredientsApi = createApi({
  reducerPath: 'ingredientsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getIngredients: builder.query<IngredientsResponse, void>({
      query: () => ({ url: '/ingredients' }),
    }),
    createOrder: builder.mutation<OrderResponse, OrderRequest>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetIngredientsQuery, useCreateOrderMutation } = ingredientsApi;
