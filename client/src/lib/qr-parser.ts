export function parseQRCode(qrCode: string): { isValid: boolean; points: number | null; error?: string } {
  if (!qrCode || qrCode.length !== 32) {
    return { isValid: false, points: null, error: "QR code must be 32 characters long" };
  }

  // Check if it's alphanumeric
  if (!/^[A-Z0-9]+$/i.test(qrCode)) {
    return { isValid: false, points: null, error: "QR code must contain only letters and numbers" };
  }

  const firstChar = qrCode[0];
  const lastChar = qrCode[31];

  // Check if first and last characters are numbers
  if (!/\d/.test(firstChar) || !/\d/.test(lastChar)) {
    return { isValid: false, points: null, error: "First and last characters must be numbers" };
  }

  const points = parseInt(firstChar + lastChar);

  return { isValid: true, points };
}

export function validateQRFormat(qrCode: string): boolean {
  return qrCode.length === 32 && /^[A-Z0-9]+$/i.test(qrCode) && /\d/.test(qrCode[0]) && /\d/.test(qrCode[31]);
}
