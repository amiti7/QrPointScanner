import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap } from 'lucide-react';
import { startScanning, stopScanning, setCurrentQR } from '../store/qrSlice.js';
import { useQRScanner } from '../hooks/use-qr-scanner.js';

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

function QRScanner() {
  const dispatch = useDispatch();
  const [, setLocation] = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleQRDetected = (qrCode) => {
    console.log('QR Code detected:', qrCode);
    if (qrCode && qrCode.length === 32) {
      dispatch(setCurrentQR(qrCode));
      setLocation('/qr-validation');
    }
  };

  const { videoRef, canvasRef, isScanning: cameraActive, error, startScanning: startCamera, stopScanning: stopCamera } = useQRScanner(handleQRDetected);

  useEffect(() => {
    if (!user) {
      setLocation('/home');
      return;
    }

    let mounted = true;
    
    const initializeScanner = async () => {
      if (mounted) {
        dispatch(startScanning());
        await startCamera();
      }
    };

    initializeScanner();

    return () => {
      mounted = false;
      dispatch(stopScanning());
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <StatusBar bgColor="bg-black" />
      
      {/* Camera View */}
      <div className="flex-1 relative bg-black">
        {/* Video element for camera feed */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
        />
        
        {/* Hidden canvas for QR processing */}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Scanner Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Scanning Frame */}
            <div className="w-64 h-64 border-4 border-white rounded-lg relative">
              {/* Corner indicators */}
              <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
              <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
              
              {/* Scanning line animation */}
              {cameraActive && (
                <div className="absolute top-0 left-0 w-full h-1 bg-primary opacity-75 scan-line"></div>
              )}
            </div>
            
            <p className="text-white text-center mt-6 font-medium">
              Position QR code within the frame
            </p>
          </div>
        </div>

        {/* Top Navigation */}
        <div className="absolute top-8 left-0 right-0 px-6 z-10">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation('/home')}
              className="bg-black bg-opacity-50 text-white hover:bg-black hover:bg-opacity-70"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            
            <div className="bg-black bg-opacity-50 rounded-lg px-3 py-1">
              <p className="text-white text-sm font-medium">QR Scanner</p>
            </div>
            
            <div className="w-10"></div> {/* Spacer */}
          </div>
        </div>

        {/* Flash/Torch Toggle (if supported) */}
        <div className="absolute top-24 right-6 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="bg-black bg-opacity-50 text-white hover:bg-black hover:bg-opacity-70"
            onClick={() => {
              // Flash toggle functionality would go here
              console.log('Flash toggle - not implemented yet');
            }}
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
            {/* Test QR Code for scanning */}
            {cameraActive && (
              <div className="mt-3">
                <p className="text-xs text-gray-300 mb-2">Test QR Code:</p>
                <p className="text-xs font-mono text-green-300 break-all">
                  1AAAICP0166JM16PHE5PQNM988JS7260
                </p>
                <p className="text-xs text-gray-400">
                  Generate this QR code on another device to test scanning
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRScanner;