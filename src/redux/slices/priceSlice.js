import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

export const fetchPrices = createAsyncThunk("price/fetchPrices", async () => {
  const response = await api.get("/prices/hourly");
  return response.data;
});

const priceSlice = createSlice({
  name: "price",
  initialState: { data: {}, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPrices.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPrices.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default priceSlice.reducer;
