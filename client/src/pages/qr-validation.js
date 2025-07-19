import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Award, ChevronRight } from 'lucide-react';
import { startValidation, setSwipeProgress, completeValidation, setScanError } from '../store/qrSlice.js';
import { updateUserPoints } from '../store/authSlice.js';
import { calculateQRPoints } from '../lib/utils.js';
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

function QRValidation() {
  const dispatch = useDispatch();
  const [, setLocation] = useLocation();
  const { currentQR, swipeProgress, isValidating } = useSelector((state) => state.qr);
  const { user } = useSelector((state) => state.auth);
  
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);

  const points = currentQR ? calculateQRPoints(currentQR) : 0;

  useEffect(() => {
    if (!currentQR || !user) {
      setLocation('/home');
    }
  }, [currentQR, user, setLocation]);

  const handleValidation = async () => {
    if (!currentQR || !user) return;

    dispatch(startValidation());

    try {
      const response = await apiRequest('/api/qr/validate', {
        method: 'POST',
        body: {
          qrCode: currentQR,
          userId: user.id,
        },
      });

      dispatch(completeValidation(response));
      dispatch(updateUserPoints(response.totalPoints));
      setLocation('/success');
    } catch (error) {
      dispatch(setScanError(error.message));
      setTimeout(() => setLocation('/home'), 2000);
    }
  };

  // Touch/Mouse event handlers for swipe
  const handleStart = (clientX) => {
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
  };

  const handleMove = (clientX) => {
    if (!isDragging) return;
    
    setCurrentX(clientX);
    const deltaX = clientX - startX;
    const containerWidth = 280; // Approximate width of swipe container
    const progress = Math.max(0, Math.min(100, (deltaX / containerWidth) * 100));
    
    dispatch(setSwipeProgress(progress));

    // Auto-validate when swiped 80% or more
    if (progress >= 80 && !isValidating) {
      setIsDragging(false);
      handleValidation();
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
    
    // If not swiped enough, reset
    if (swipeProgress < 80) {
      dispatch(setSwipeProgress(0));
    }
  };

  // Mouse events
  const handleMouseDown = (e) => handleStart(e.clientX);
  const handleMouseMove = (e) => handleMove(e.clientX);
  const handleMouseUp = () => handleEnd();

  // Touch events
  const handleTouchStart = (e) => handleStart(e.touches[0].clientX);
  const handleTouchMove = (e) => handleMove(e.touches[0].clientX);
  const handleTouchEnd = () => handleEnd();

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, startX]);

  if (!currentQR) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-primary/5">
      <StatusBar />
      
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/qr-scanner')}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="font-bold text-lg">QR Validation</h1>
            <p className="text-sm opacity-90">Confirm your scan</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6 space-y-6">
        {/* QR Code Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Scanned QR Code</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Valid
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">QR Code:</p>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">
                  {currentQR}
                </p>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg">
                <span className="font-medium">Points to Earn:</span>
                <Badge variant="secondary" className="bg-primary text-white text-lg px-3 py-1">
                  <Award className="w-4 h-4 mr-1" />
                  {points}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Swipe to Confirm */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="font-medium text-gray-700">Ready to earn points?</h3>
              
              {/* Swipe Button */}
              <div className="relative">
                <div className="w-full h-16 bg-gray-200 rounded-full overflow-hidden relative">
                  {/* Progress Bar */}
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-200"
                    style={{ width: `${swipeProgress}%` }}
                  />
                  
                  {/* Swipe Button */}
                  <div
                    className="absolute top-2 left-2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer select-none transform transition-transform duration-200"
                    style={{ 
                      transform: `translateX(${(swipeProgress / 100) * (280 - 48)}px)`,
                      transition: isDragging ? 'none' : 'transform 0.2s ease'
                    }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                  >
                    {isValidating ? (
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ChevronRight className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  
                  {/* Instruction Text */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-gray-600 font-medium select-none">
                      {swipeProgress > 20 ? `${Math.round(swipeProgress)}%` : 'Swipe to confirm →'}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500">
                Swipe the trowel icon to the right to confirm and earn your points
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Manual Confirm Button (fallback) */}
        <Button 
          onClick={handleValidation}
          disabled={isValidating}
          variant="outline"
          className="w-full"
        >
          {isValidating ? 'Validating...' : 'Tap to Confirm (Alternative)'}
        </Button>
      </div>
    </div>
  );
}

export default QRValidation;