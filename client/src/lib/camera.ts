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

  // Simple QR code detection simulation
  // In a real implementation, you would use a QR code library like jsQR
  // For now, we'll simulate detection after a delay and return a test QR code
  
  // This is a placeholder - in production, use jsQR or similar library
  // For demo purposes, we'll return a valid test QR code after some time
  const testQRCodes = [
    "1AAAICP0166JM16PHE5PQNM988JS7260",
    "2BBBICP0166JM16PHE5PQNM988JS7251",
    "5CCCICP0166JM16PHE5PQNM988JS7265"
  ];
  
  // Simulate QR detection with random delay
  const random = Math.random();
  if (random > 0.95) { // 5% chance per scan cycle
    return testQRCodes[Math.floor(Math.random() * testQRCodes.length)];
  }
  
  return null;
}
