import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Smartphone, ArrowRight, Construction } from 'lucide-react';
import { setMobile, setOTPSent, setOTPError, setUser } from '../store/authSlice.js';
import { apiRequest } from '../lib/queryClient.js';

// StatusBar Component
function StatusBar({ bgColor = "bg-primary" }) {
  return (
    <div className={`${bgColor} h-6 w-full flex items-center justify-center`}>
      <div className="flex items-center space-x-1">
        <div className="w-1 h-1 bg-white rounded-full"></div>
        <div className="w-1 h-1 bg-white rounded-full"></div>
        <div className="w-1 h-1 bg-white rounded-full"></div>
      </div>
    </div>
  );
}

function Login() {
  const dispatch = useDispatch();
  const [, setLocation] = useLocation();
  const { isAuthenticated, otpState } = useSelector((state) => state.auth);
  const [mobile, setMobileInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/home');
    }
  }, [isAuthenticated, setLocation]);

  const validateMobile = (number) => {
    const mobileRegex = /^\+91\d{10}$/;
    return mobileRegex.test(number);
  };

  const formatMobileInput = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // If it starts with 91, add +
    if (digits.startsWith('91') && digits.length <= 12) {
      return '+' + digits;
    }
    
    // If it doesn't start with 91, prepend +91
    if (digits.length <= 10) {
      return '+91' + digits;
    }
    
    return value;
  };

  const handleMobileChange = (e) => {
    const formatted = formatMobileInput(e.target.value);
    setMobileInput(formatted);
  };

  const handleSendOTP = async () => {
    if (!validateMobile(mobile)) {
      dispatch(setOTPError('Please enter a valid Indian mobile number'));
      return;
    }

    setIsLoading(true);
    dispatch(setOTPError(null));

    try {
      await apiRequest('/api/auth/otp-request', {
        method: 'POST',
        body: { mobile },
      });

      dispatch(setMobile(mobile));
      dispatch(setOTPSent(true));
      setLocation('/otp-verification');
    } catch (error) {
      dispatch(setOTPError(error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = () => {
    // Set demo user for testing
    const demoUser = {
      id: 1,
      mobile: '+919876543210',
      totalPoints: 0,
    };
    
    dispatch(setUser(demoUser));
    setLocation('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-primary/10">
      <StatusBar />
      
      {/* Header */}
      <div className="bg-primary text-white p-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Construction className="w-8 h-8" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">ConstructScan</h1>
        <p className="text-sm opacity-90">Scan. Earn. Build Your Rewards</p>
      </div>

      {/* Login Form */}
      <div className="container mx-auto p-6 pt-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5" />
              <span>Mobile Login</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={mobile}
                onChange={handleMobileChange}
                maxLength={13}
              />
              <p className="text-xs text-gray-500">
                Enter your Indian mobile number to receive OTP
              </p>
            </div>

            {otpState.error && (
              <Alert variant="destructive">
                <AlertDescription>{otpState.error}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleSendOTP}
              disabled={!validateMobile(mobile) || isLoading}
              className="w-full"
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            {/* Demo Access */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-3">
                For testing purposes
              </p>
              <Button 
                variant="outline" 
                onClick={handleQuickDemo}
                className="w-full"
              >
                Quick Demo Login
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="max-w-md mx-auto mt-8 space-y-4">
          <div className="text-center">
            <h3 className="font-medium text-gray-700 mb-4">Why ConstructScan?</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
              <div>
                <h4 className="font-medium text-sm">Scan & Earn</h4>
                <p className="text-xs text-gray-600">Scan QR codes on product bags to accumulate points</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
              <div>
                <h4 className="font-medium text-sm">Mobile Optimized</h4>
                <p className="text-xs text-gray-600">Designed for construction workers on the go</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
              <div>
                <h4 className="font-medium text-sm">Instant Rewards</h4>
                <p className="text-xs text-gray-600">Get instant point rewards for every valid scan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;