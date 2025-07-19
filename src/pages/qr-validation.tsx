import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'wouter';
import { ArrowLeft, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBar from '@/components/status-bar';
import SwipeButton from '@/components/swipe-button';
import { RootState } from '../store';
import { validateQRCode } from '../store/qrSlice';
import { updateUserPoints } from '../store/authSlice';
import { useToast } from '@/hooks/use-toast';

export default function QRValidation() {
  const dispatch = useDispatch();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useSelector((state: RootState) => state.auth);
  const { currentQRCode, points, isValidating } = useSelector((state: RootState) => state.qr);

  if (!user || !currentQRCode || !points) {
    setLocation('/home');
    return null;
  }

  const handleValidate = async () => {
    try {
      const result = await dispatch(validateQRCode({ 
        qrCode: currentQRCode, 
        userId: user.id 
      })).unwrap();
      
      dispatch(updateUserPoints(result.totalPoints));
      setLocation('/success');
    } catch (error: any) {
      setLocation('/error');
    }
  };

  const handleGoBack = () => {
    setLocation('/home');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <StatusBar />
      
      {/* Header */}
      <div className="bg-primary text-white px-6 py-4 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGoBack}
          className="mr-4 text-white hover:text-gray-200 hover:bg-transparent p-0"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-bold">Validate QR Code</h1>
      </div>

      {/* Validation Content */}
      <div className="flex-1 px-6 py-8 flex flex-col">
        {/* QR Code Info */}
        <div className="text-center mb-8">
          <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">QR Code Found!</h2>
          <p className="text-gray-600 mt-2">This QR code will add points to your account</p>
        </div>

        {/* Points Display */}
        <div className="bg-gradient-to-r from-primary to-orange-600 rounded-xl p-6 text-white text-center mb-8">
          <p className="text-lg font-medium">Points to be added</p>
          <p className="text-4xl font-bold mt-2">+{points}</p>
          <p className="text-orange-200 text-sm mt-2 break-all">
            QR Code: {currentQRCode}
          </p>
        </div>

        {/* Swipe Button */}
        <div className="flex-1 flex items-end">
          <div className="w-full">
            <SwipeButton
              onComplete={handleValidate}
              disabled={isValidating}
              text="Swipe the trowel to validate"
              icon={
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2c0 .55.45 1 1 1h16c.55 0 1-.45 1-1zM12 10l8 5H4l8-5z"/>
                </svg>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
