import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

export const fetchPriceHistory = createAsyncThunk(
  "history/fetchPriceHistory",
  async () => {
    const response = await api.get("/prices/hourly");
    return response.data;
  }
);

const historySlice = createSlice({
  name: "history",
  initialState: { history: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPriceHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPriceHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchPriceHistory.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default historySlice.reducer;
