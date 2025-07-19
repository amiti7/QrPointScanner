import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiRequest } from '../lib/queryClient';

interface QRState {
  currentQRCode: string | null;
  points: number | null;
  isScanning: boolean;
  isValidating: boolean;
  error: string | null;
  success: boolean;
}

const initialState: QRState = {
  currentQRCode: null,
  points: null,
  isScanning: false,
  isValidating: false,
  error: null,
  success: false,
};

export const validateQRCode = createAsyncThunk(
  'qr/validate',
  async ({ qrCode, userId }: { qrCode: string; userId: number }) => {
    const response = await apiRequest('POST', '/api/qr/validate', { qrCode, userId });
    const data = await response.json();
    return data;
  }
);

const qrSlice = createSlice({
  name: 'qr',
  initialState,
  reducers: {
    startScanning: (state) => {
      state.isScanning = true;
      state.error = null;
      state.success = false;
    },
    stopScanning: (state) => {
      state.isScanning = false;
    },
    setQRCode: (state, action: PayloadAction<string>) => {
      state.currentQRCode = action.payload;
      // Parse points from QR code
      const firstChar = action.payload[0];
      const lastChar = action.payload[31];
      if (/\d/.test(firstChar) && /\d/.test(lastChar)) {
        state.points = parseInt(firstChar + lastChar);
      }
    },
    clearQRState: (state) => {
      state.currentQRCode = null;
      state.points = null;
      state.error = null;
      state.success = false;
      state.isValidating = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateQRCode.pending, (state) => {
        state.isValidating = true;
        state.error = null;
      })
      .addCase(validateQRCode.fulfilled, (state, action) => {
        state.isValidating = false;
        state.success = true;
        state.points = action.payload.points;
      })
      .addCase(validateQRCode.rejected, (state, action) => {
        state.isValidating = false;
        state.error = action.error.message || 'Failed to validate QR code';
      });
  },
});

export const { startScanning, stopScanning, setQRCode, clearQRState, clearError } = qrSlice.actions;
export default qrSlice.reducer;
