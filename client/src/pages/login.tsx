import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'wouter';
import { HardHat, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import StatusBar from '@/components/status-bar';
import { RootState } from '../store';
import { sendOTP, setMobile, clearError } from '../store/authSlice';

export default function Login() {
  const [mobile, setMobileInput] = useState('');
  const dispatch = useDispatch();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isLoading, error, otpSent } = useSelector((state: RootState) => state.auth);

  const handleSendOTP = async () => {
    if (!mobile || mobile.length !== 10 || !/^[6-9]\d{9}$/.test(mobile)) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive",
      });
      return;
    }

    const fullMobile = `+91${mobile}`;
    dispatch(setMobile(fullMobile));
    
    try {
      await dispatch(sendOTP(fullMobile)).unwrap();
      toast({
        title: "OTP Sent",
        description: "Verification code sent to your mobile number",
      });
      setLocation('/otp');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (otpSent) {
      setLocation('/otp');
    }
  }, [otpSent, setLocation]);

  return (
    <div className="min-h-screen flex flex-col">
      <StatusBar />
      
      {/* Header */}
      <div className="bg-primary text-white px-6 py-8">
        <div className="text-center">
          <HardHat className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">ConstructScan</h1>
          <p className="text-orange-200 mt-2">Scan QR codes and earn points</p>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 px-6 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Enter your mobile number</h2>
          <p className="text-gray-600 text-sm">We'll send you a verification code</p>
        </div>

        <div className="mb-6">
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            Mobile Number
          </Label>
          <div className="flex">
            <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l-lg p-3 w-20 flex items-center justify-center">
              +91
            </div>
            <Input
              type="tel"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobileInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="flex-1 bg-gray-50 border border-l-0 border-gray-300 text-gray-900 text-sm rounded-r-lg rounded-l-none focus:ring-primary focus:border-primary"
              maxLength={10}
            />
          </div>
        </div>

        <Button
          onClick={handleSendOTP}
          disabled={isLoading || mobile.length !== 10}
          className="w-full bg-primary hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200 mb-4"
        >
          {isLoading ? (
            "Sending..."
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Verification Code
            </>
          )}
        </Button>

        {/* Quick Demo Login */}
        <Button
          onClick={() => {
            dispatch(setMobile('+919876543210'));
            // Simulate successful login
            const testUser = {
              id: 1,
              mobile: '+919876543210',
              totalPoints: 0,
              createdAt: new Date()
            };
            dispatch({ type: 'auth/verifyOTP/fulfilled', payload: testUser });
            setLocation('/home');
          }}
          variant="outline"
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition duration-200"
        >
          Quick Demo Login
        </Button>

        <div className="mt-8 text-center text-xs text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
}
