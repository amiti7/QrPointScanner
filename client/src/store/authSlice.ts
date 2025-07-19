import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiRequest } from '../lib/queryClient';
import type { User } from '@shared/schema';

interface AuthState {
  user: User | null;
  mobile: string;
  isLoading: boolean;
  error: string | null;
  otpSent: boolean;
}

const initialState: AuthState = {
  user: null,
  mobile: '',
  isLoading: false,
  error: null,
  otpSent: false,
};

export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async (mobile: string) => {
    const response = await apiRequest('POST', '/api/auth/send-otp', { mobile });
    return mobile;
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ mobile, otp }: { mobile: string; otp: string }) => {
    const response = await apiRequest('POST', '/api/auth/verify-otp', { mobile, otp });
    const data = await response.json();
    return data.user;
  }
);

export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (userId: number) => {
    const response = await apiRequest('GET', `/api/user/${userId}`);
    const data = await response.json();
    return data.user;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setMobile: (state, action: PayloadAction<string>) => {
      state.mobile = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.mobile = '';
      state.otpSent = false;
      state.error = null;
    },
    updateUserPoints: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.totalPoints = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mobile = action.payload;
        state.otpSent = true;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to send OTP';
      })
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.otpSent = false;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Invalid OTP';
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { setMobile, clearError, logout, updateUserPoints } = authSlice.actions;
export default authSlice.reducer;
