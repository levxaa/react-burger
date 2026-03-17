import { BASE_URL } from '@/utils/constants';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

type OrderState = {
  order: { number: number; name: string } | null;
  loading: boolean;
  error: string | null;
};

const initialState: OrderState = {
  order: null,
  loading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[], { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      });
      const data = (await response.json()) as {
        success: boolean;
        order: { number: number };
        name: string;
      };

      if (!data.success) {
        throw new Error('Failed to create order');
      }

      return { number: data.order.number, name: data.name };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Unknown error';
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
