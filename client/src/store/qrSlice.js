import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentQR: null,
  isScanning: false,
  isValidating: false,
  scanResult: null,
  error: null,
  swipeProgress: 0,
  validationComplete: false,
};

const qrSlice = createSlice({
  name: 'qr',
  initialState,
  reducers: {
    startScanning: (state) => {
      state.isScanning = true;
      state.error = null;
      state.currentQR = null;
      state.scanResult = null;
      state.validationComplete = false;
    },
    stopScanning: (state) => {
      state.isScanning = false;
    },
    setCurrentQR: (state, action) => {
      state.currentQR = action.payload;
      state.isScanning = false;
    },
    startValidation: (state) => {
      state.isValidating = true;
      state.swipeProgress = 0;
      state.validationComplete = false;
    },
    setSwipeProgress: (state, action) => {
      state.swipeProgress = action.payload;
    },
    completeValidation: (state, action) => {
      state.isValidating = false;
      state.validationComplete = true;
      state.scanResult = action.payload;
      state.swipeProgress = 100;
    },
    setScanError: (state, action) => {
      state.error = action.payload;
      state.isScanning = false;
      state.isValidating = false;
    },
    resetQRState: (state) => {
      state.currentQR = null;
      state.isScanning = false;
      state.isValidating = false;
      state.scanResult = null;
      state.error = null;
      state.swipeProgress = 0;
      state.validationComplete = false;
    },
  },
});

export const {
  startScanning,
  stopScanning,
  setCurrentQR,
  startValidation,
  setSwipeProgress,
  completeValidation,
  setScanError,
  resetQRState,
} = qrSlice.actions;

export default qrSlice.reducer;