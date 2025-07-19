import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'wouter';
import { X, Zap, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBar from '@/components/status-bar';
import { useQRScanner } from '../hooks/use-qr-scanner';
import { RootState } from '../store';
import { startScanning, stopScanning, setQRCode } from '../store/qrSlice';
import { parseQRCode } from '../lib/qr-parser';
import { useToast } from '@/hooks/use-toast';

export default function QRScanner() {
  const dispatch = useDispatch();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isScanning } = useSelector((state: RootState) => state.qr);

  const handleQRDetected = (qrCode: string) => {
    const { isValid, points, error } = parseQRCode(qrCode);
    
    if (!isValid) {
      toast({
        title: "Invalid QR Code",
        description: error || "Please scan a valid construction QR code",
        variant: "destructive",
      });
      return;
    }

    dispatch(setQRCode(qrCode));
    dispatch(stopScanning());
    setLocation('/validate');
  };

  const { videoRef, canvasRef, isScanning: cameraActive, error, startScanning: startCamera, stopScanning: stopCamera } = useQRScanner(handleQRDetected);

  useEffect(() => {
    if (!user) {
      setLocation('/home');
      return;
    }

    dispatch(startScanning());
    startCamera();

    return () => {
      dispatch(stopScanning());
      stopCamera();
    };
  }, []);

  const handleClose = () => {
    dispatch(stopScanning());
    stopCamera();
    setLocation('/home');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <StatusBar bgColor="bg-black" />
      
      {/* Scanner Demo */}
      <div className="flex-1 relative bg-gradient-to-b from-gray-900 to-black">
        {/* Demo Scanner Area */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
          {/* Scanning Frame */}
          <div className="w-64 h-64 border-4 border-white rounded-lg relative mb-8">
            {/* Corner indicators */}
            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
            
            {/* Scanning line animation */}
            <div className="absolute top-0 left-0 w-full h-1 bg-primary opacity-75 scan-line"></div>
            
            {/* Demo content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center">
                <QrCode className="w-16 h-16 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Demo Scanner</p>
              </div>
            </div>
          </div>
          
          <p className="text-white text-center font-medium mb-6">
            Click test buttons to simulate QR scans
          </p>
          
          {/* Test QR Buttons */}
          <div className="space-y-3 w-full max-w-sm">
            <Button
              onClick={() => handleQRDetected("1AAAICP0166JM16PHE5PQNM988JS7260")}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Test QR: 10 Points
            </Button>
            <Button
              onClick={() => handleQRDetected("2BBBICP0166JM16PHE5PQNM988JS7251")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Test QR: 25 Points  
            </Button>
            <Button
              onClick={() => handleQRDetected("5CCCICP0166JM16PHE5PQNM988JS7265")}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Test QR: 50 Points
            </Button>
          </div>
        </div>

        {/* Header Controls */}
        <div className="absolute top-4 left-0 right-0 px-6 flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-white hover:text-gray-200 hover:bg-black/20 p-2"
          >
            <X className="w-6 h-6" />
          </Button>
          <h1 className="text-white font-bold">Scan QR Code</h1>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-gray-200 hover:bg-black/20 p-2"
          >
            <Zap className="w-6 h-6" />
          </Button>
        </div>

        {/* Bottom Instructions */}
        <div className="absolute bottom-8 left-0 right-0 px-6">
          <div className="bg-black bg-opacity-50 rounded-lg p-4 text-center">
            <p className="text-white text-sm">
              {error ? error : "Scan a 32-character QR code to earn points"}
            </p>
            <p className="text-orange-200 text-xs mt-1">
              {cameraActive ? "Looking for valid construction QR codes..." : "Starting camera..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
