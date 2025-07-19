import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Award, Home, RotateCcw } from 'lucide-react';
import { resetQRState } from '../store/qrSlice.js';

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

function Success() {
  const dispatch = useDispatch();
  const [, setLocation] = useLocation();
  const { scanResult } = useSelector((state) => state.qr);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!scanResult || !user) {
      setLocation('/home');
    }
  }, [scanResult, user, setLocation]);

  const handleGoHome = () => {
    dispatch(resetQRState());
    setLocation('/home');
  };

  const handleScanAgain = () => {
    dispatch(resetQRState());
    setLocation('/qr-scanner');
  };

  if (!scanResult) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <StatusBar bgColor="bg-green-600" />
      
      {/* Success Animation */}
      <div className="flex items-center justify-center pt-20 pb-8">
        <div className="relative">
          {/* Animated Success Icon */}
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          {/* Floating Points */}
          <div className="absolute -top-4 -right-4 bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center animate-pulse">
            <span className="text-sm font-bold">+{scanResult.points}</span>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <div className="text-center px-6 mb-8">
        <h1 className="text-2xl font-bold text-green-800 mb-2">
          Points Earned!
        </h1>
        <p className="text-green-600">
          Your QR code scan was successful
        </p>
      </div>

      {/* Results Card */}
      <div className="container mx-auto px-6 space-y-6">
        <Card className="border-green-200 bg-white/80 backdrop-blur">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Points Earned */}
              <div className="text-center p-6 bg-gradient-to-r from-green-500 to-primary rounded-lg text-white">
                <div className="flex items-center justify-center mb-2">
                  <Award className="w-8 h-8 mr-2" />
                  <span className="text-3xl font-bold">+{scanResult.points}</span>
                </div>
                <p className="text-sm opacity-90">Points Added</p>
              </div>

              {/* Total Points */}
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Total Points:</span>
                <Badge variant="secondary" className="bg-primary text-white text-lg px-3 py-1">
                  <Award className="w-4 h-4 mr-1" />
                  {scanResult.totalPoints}
                </Badge>
              </div>

              {/* Success Message */}
              <div className="text-center py-4">
                <p className="text-green-600 font-medium">
                  {scanResult.message}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handleGoHome}
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Button>
          
          <Button 
            onClick={handleScanAgain}
            variant="outline"
            className="w-full border-green-300 text-green-700 hover:bg-green-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Scan Another QR Code
          </Button>
        </div>

        {/* Celebration Message */}
        <div className="text-center pt-6">
          <div className="inline-flex items-center space-x-2 text-green-600">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            <span className="text-sm font-medium">Keep scanning to earn more points!</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Success;