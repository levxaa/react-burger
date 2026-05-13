import { createSlice } from '@reduxjs/toolkit';

import type { TOrdersResponse } from '../../utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';

type FeedState = {
  orders: TOrdersResponse['orders'];
  total: number;
  totalToday: number;
  isConnected: boolean;
  error: string | null;
};

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isConnected: false,
  error: null,
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    // Actions для middleware
    connect: (state) => {
      state.error = null;
    },
    disconnect: (state) => {
      state.isConnected = false;
    },

    // Actions от middleware
    onOpen: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
      state.error = null;
    },
    onMessage: (state, action: PayloadAction<TOrdersResponse>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.error = null;
    },
    onError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isConnected = false;
    },
    onClose: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
  },
});

export const { connect, disconnect, onOpen, onMessage, onError, onClose } =
  feedSlice.actions;
export const feedReducer = feedSlice.reducer;
