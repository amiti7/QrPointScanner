import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'wouter';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBar from '@/components/status-bar';
import { RootState } from '../store';
import { clearQRState, clearError } from '../store/qrSlice';

export default function ErrorPage() {
  const dispatch = useDispatch();
  const [, setLocation] = useLocation();
  const { error } = useSelector((state: RootState) => state.qr);

  const handleGoHome = () => {
    dispatch(clearQRState());
    dispatch(clearError());
    setLocation('/home');
  };

  const handleScanAgain = () => {
    dispatch(clearError());
    setLocation('/scan');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <StatusBar bgColor="bg-red-600" />
      
      {/* Error Content */}
      <div className="flex-1 bg-gradient-to-b from-red-50 to-white px-6 py-12 flex flex-col items-center justify-center text-center">
        {/* Error Icon */}
        <div className="bg-red-100 rounded-full w-32 h-32 flex items-center justify-center mb-8">
          <AlertTriangle className="w-16 h-16 text-red-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">Oops!</h1>
        <p className="text-lg text-gray-600 mb-8 px-4">
          {error || "Something went wrong while processing your QR code"}
        </p>
        
        <div className="space-y-3 w-full max-w-sm">
          <Button
            onClick={handleGoHome}
            className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            Go to Home
          </Button>
          <Button
            onClick={handleScanAgain}
            variant="outline"
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            Scan Another QR
          </Button>
        </div>
      </div>
    </div>
  );
}
