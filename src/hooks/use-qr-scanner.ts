import { useRef, useEffect, useState } from 'react';
import { startCamera, stopCamera, decodeQRCode } from '../lib/camera';

export function useQRScanner(onQRDetected: (qrCode: string) => void) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startScanning = async () => {
    try {
      setError(null);
      if (videoRef.current) {
        await startCamera(videoRef.current);
        setIsScanning(true);
        
        // Start QR detection loop
        scanIntervalRef.current = setInterval(() => {
          if (videoRef.current && canvasRef.current) {
            const qrCode = decodeQRCode(videoRef.current, canvasRef.current);
            if (qrCode && qrCode.length === 32) {
              onQRDetected(qrCode);
              stopScanning();
            }
          }
        }, 500); // Faster scanning at 500ms
      }
    } catch (err) {
      setError('Failed to access camera. Please ensure camera permissions are granted.');
    }
  };

  const stopScanning = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (videoRef.current) {
      stopCamera(videoRef.current);
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return {
    videoRef,
    canvasRef,
    isScanning,
    error,
    startScanning,
    stopScanning,
  };
}
