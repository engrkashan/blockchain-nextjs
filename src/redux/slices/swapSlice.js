import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

export const calculateSwapRate = createAsyncThunk(
  "swap/calculateSwapRate",
  async ({ ethAmount }) => {
    const response = await api.post("/prices/swap-rate", { ethAmount });
    return response.data;
  }
);

const swapSlice = createSlice({
  name: "swap",
  initialState: { rate: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(calculateSwapRate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateSwapRate.fulfilled, (state, action) => {
        state.loading = false;
        state.rate = action.payload;
      })
      .addCase(calculateSwapRate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default swapSlice.reducer;
