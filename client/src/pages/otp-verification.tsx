import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import StatusBar from '@/components/status-bar';
import { RootState } from '../store';
import { verifyOTP, sendOTP, setMobile } from '../store/authSlice';

export default function OTPVerification() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const dispatch = useDispatch();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { mobile, isLoading, error, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!mobile) {
      setLocation('/');
      return;
    }
    if (user) {
      setLocation('/home');
    }
  }, [mobile, user, setLocation]);

  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a complete 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    try {
      await dispatch(verifyOTP({ mobile, otp: otpString })).unwrap();
      toast({
        title: "Login Successful",
        description: "Welcome to ConstructScan!",
      });
      setLocation('/home');
    } catch (error) {
      toast({
        title: "Invalid OTP",
        description: "Please check your OTP and try again",
        variant: "destructive",
      });
    }
  };

  const handleResendOTP = async () => {
    try {
      await dispatch(sendOTP(mobile)).unwrap();
      setOtp(['', '', '', '', '', '']);
      toast({
        title: "OTP Resent",
        description: "New verification code sent to your mobile number",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChangeNumber = () => {
    dispatch(setMobile(''));
    setLocation('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <StatusBar />
      
      {/* Header with Back Button */}
      <div className="bg-primary text-white px-6 py-4 flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setLocation('/')}
          className="mr-4 text-white hover:text-gray-200 hover:bg-transparent p-0"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-bold">Verify Phone Number</h1>
      </div>

      {/* OTP Form */}
      <div className="flex-1 px-6 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Enter verification code</h2>
          <p className="text-gray-600 text-sm">
            We've sent a 6-digit code to{' '}
            <span className="font-medium">{mobile}</span>
          </p>
        </div>

        {/* OTP Input */}
        <div className="flex justify-center space-x-3 mb-6">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOTPChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            />
          ))}
        </div>

        <Button
          onClick={handleVerifyOTP}
          disabled={isLoading || otp.join('').length !== 6}
          className="w-full bg-primary hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200 mb-4"
        >
          {isLoading ? "Verifying..." : "Verify Code"}
        </Button>

        <div className="text-center">
          <Button
            variant="ghost"
            onClick={handleResendOTP}
            disabled={isLoading}
            className="text-primary hover:text-orange-600 text-sm font-medium"
          >
            Resend Code
          </Button>
        </div>

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={handleChangeNumber}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            Wrong number? Change it
          </Button>
        </div>
      </div>
    </div>
  );
}
