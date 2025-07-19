import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  otpState: {
    mobile: '',
    isOTPSent: false,
    isVerifying: false,
    error: null,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setMobile: (state, action) => {
      state.otpState.mobile = action.payload;
    },
    setOTPSent: (state, action) => {
      state.otpState.isOTPSent = action.payload;
    },
    setVerifying: (state, action) => {
      state.otpState.isVerifying = action.payload;
    },
    setOTPError: (state, action) => {
      state.otpState.error = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    updateUserPoints: (state, action) => {
      if (state.user) {
        state.user.totalPoints = action.payload;
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.otpState = {
        mobile: '',
        isOTPSent: false,
        isVerifying: false,
        error: null,
      };
    },
    clearOTPState: (state) => {
      state.otpState = {
        mobile: '',
        isOTPSent: false,
        isVerifying: false,
        error: null,
      };
    },
  },
});

export const {
  setMobile,
  setOTPSent,
  setVerifying,
  setOTPError,
  setUser,
  updateUserPoints,
  logout,
  clearOTPState,
} = authSlice.actions;

export default authSlice.reducer;