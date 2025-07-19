import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'wouter';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBar from '@/components/status-bar';
import { RootState } from '../store';
import { clearQRState } from '../store/qrSlice';

export default function Success() {
  const dispatch = useDispatch();
  const [, setLocation] = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const { points } = useSelector((state: RootState) => state.qr);

  useEffect(() => {
    if (!user || !points) {
      setLocation('/home');
    }
  }, [user, points, setLocation]);

  const handleContinue = () => {
    dispatch(clearQRState());
    setLocation('/home');
  };

  if (!user || !points) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <StatusBar bgColor="bg-green-600" />
      
      {/* Success Content */}
      <div className="flex-1 bg-gradient-to-b from-green-50 to-white px-6 py-12 flex flex-col items-center justify-center text-center">
        {/* Success Animation */}
        <div className="bg-green-100 rounded-full w-32 h-32 flex items-center justify-center mb-8 pulse-success">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">Success!</h1>
        <p className="text-lg text-gray-600 mb-2">You've earned</p>
        <p className="text-4xl font-bold text-green-600 mb-6">+{points} Points</p>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 w-full max-w-sm">
          <p className="text-gray-600 text-sm mb-2">Total Points</p>
          <p className="text-2xl font-bold text-primary">{user.totalPoints}</p>
        </div>

        <Button
          onClick={handleContinue}
          className="bg-primary hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
