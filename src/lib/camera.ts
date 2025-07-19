import jsQR from 'jsqr';

export async function startCamera(videoElement: HTMLVideoElement): Promise<void> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { 
        facingMode: 'environment', // Use back camera
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    });
    
    videoElement.srcObject = stream;
    await videoElement.play();
  } catch (error) {
    console.error('Error accessing camera:', error);
    throw new Error('Camera access denied or not available');
  }
}

export function stopCamera(videoElement: HTMLVideoElement): void {
  const stream = videoElement.srcObject as MediaStream;
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    videoElement.srcObject = null;
  }
}

export function decodeQRCode(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement): string | null {
  const context = canvasElement.getContext('2d');
  if (!context) return null;

  // Set canvas size to match video
  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;

  // Draw current video frame to canvas
  context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

  // Get image data
  const imageData = context.getImageData(0, 0, canvasElement.width, canvasElement.height);

  // Use jsQR to decode QR code
  const code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: "dontInvert",
  });

  if (code) {
    return code.data;
  }
  
  return null;
}
