import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

export const setPriceAlert = createAsyncThunk(
  "alert/setPriceAlert",
  async (alertData) => {
    const response = await api.post("/prices/alert", alertData);
    return response.data;
  }
);

const alertSlice = createSlice({
  name: "alert",
  initialState: { alerts: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setPriceAlert.pending, (state) => {
        state.loading = true;
      })
      .addCase(setPriceAlert.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts.push(action.payload);
      })
      .addCase(setPriceAlert.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default alertSlice.reducer;
