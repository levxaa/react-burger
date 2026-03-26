import { createAction } from '@reduxjs/toolkit';

import type { TIngredient } from '@utils/types';

export const selectIngredient = createAction<TIngredient>('ingredient/selectIngredient');
export const clearIngredient = createAction('ingredient/clearIngredient');
