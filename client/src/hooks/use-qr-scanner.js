import { useRef, useState, useCallback, useEffect } from 'react';
import { startCamera, stopCamera, decodeQRCode } from '../lib/camera.js';

export function useQRScanner(onQRDetected) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const scanIntervalRef = useRef(null);

  const startScanning = useCallback(async () => {
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
  }, [onQRDetected]);

  const stopScanning = useCallback(() => {
    setIsScanning(false);
    
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    if (videoRef.current) {
      stopCamera(videoRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, [stopScanning]);

  return {
    videoRef,
    canvasRef,
    isScanning,
    error,
    startScanning,
    stopScanning,
  };
}