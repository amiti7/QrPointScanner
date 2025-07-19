import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatMobile(mobile) {
  if (!mobile) return '';
  // Format +919876543210 to +91 98765 43210
  return mobile.replace(/(\+91)(\d{5})(\d{5})/, '$1 $2 $3');
}

export function validateQRCode(code) {
  // QR codes should be 32 characters, alphanumeric
  const qrRegex = /^[A-Z0-9]{32}$/;
  return qrRegex.test(code);
}

export function calculateQRPoints(qrCode) {
  if (!validateQRCode(qrCode)) return 0;
  
  const firstChar = qrCode[0];
  const lastChar = qrCode[qrCode.length - 1];
  
  // Convert to numbers if they are digits, otherwise use ASCII values modulo 10
  const firstValue = isNaN(firstChar) ? firstChar.charCodeAt(0) % 10 : parseInt(firstChar);
  const lastValue = isNaN(lastChar) ? lastChar.charCodeAt(0) % 10 : parseInt(lastChar);
  
  return firstValue + lastValue;
}