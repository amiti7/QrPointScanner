import { Router } from 'express';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { createMemStorage } from './storage.js';

const router = Router();
const storage = createMemStorage();

// Validation schemas
const otpRequestSchema = z.object({
  mobile: z.string().regex(/^\+91\d{10}$/, 'Mobile number must be in format +91XXXXXXXXXX'),
});

const otpVerifySchema = z.object({
  mobile: z.string().regex(/^\+91\d{10}$/, 'Mobile number must be in format +91XXXXXXXXXX'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

const qrValidateSchema = z.object({
  qrCode: z.string().length(32, 'QR code must be 32 characters'),
  userId: z.number().int().positive(),
});

// Helper function to generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper function to calculate points from QR code
function calculatePoints(qrCode) {
  const firstChar = qrCode[0];
  const lastChar = qrCode[qrCode.length - 1];
  
  // Convert to numbers if they are digits, otherwise use ASCII values
  const firstValue = isNaN(firstChar) ? firstChar.charCodeAt(0) % 10 : parseInt(firstChar);
  const lastValue = isNaN(lastChar) ? lastChar.charCodeAt(0) % 10 : parseInt(lastChar);
  
  return firstValue + lastValue;
}

// OTP request endpoint
router.post('/auth/otp-request', async (req, res) => {
  try {
    const { mobile } = otpRequestSchema.parse(req.body);
    
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    
    await storage.createOTPVerification({ 
      mobile, 
      otp, 
      expiresAt, 
      verified: false 
    });
    
    console.log(`OTP for ${mobile}: ${otp}`); // In production, send SMS
    
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: fromZodError(error).toString() });
    }
    console.error('OTP request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// OTP verification endpoint
router.post('/auth/otp-verify', async (req, res) => {
  try {
    const { mobile, otp } = otpVerifySchema.parse(req.body);
    
    const verification = await storage.getOTPVerification(mobile, otp);
    
    if (!verification || verification.verified || new Date() > verification.expiresAt) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    
    // Mark OTP as verified
    await storage.updateOTPVerification(verification.id, { verified: true });
    
    // Find or create user
    let user = await storage.getUserByMobile(mobile);
    if (!user) {
      user = await storage.createUser({ mobile, totalPoints: 0 });
    }
    
    // Set session
    req.session.userId = user.id;
    
    res.json({ 
      message: 'Login successful',
      user: {
        id: user.id,
        mobile: user.mobile,
        totalPoints: user.totalPoints
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: fromZodError(error).toString() });
    }
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user profile
router.get('/user/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ 
      user: {
        id: user.id,
        mobile: user.mobile,
        totalPoints: user.totalPoints
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// QR code validation
router.post('/qr/validate', async (req, res) => {
  try {
    const { qrCode, userId } = qrValidateSchema.parse(req.body);
    
    // Check if QR code already exists
    const existingQR = await storage.getQRCode(qrCode);
    if (existingQR) {
      return res.status(409).json({ message: 'QR code already scanned' });
    }
    
    // Get user
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Calculate points
    const points = calculatePoints(qrCode);
    
    // Create QR code record
    await storage.createQRCode({ code: qrCode, points, scannedBy: userId });
    
    // Update user points
    const newTotalPoints = user.totalPoints + points;
    await storage.updateUser(userId, { totalPoints: newTotalPoints });
    
    res.json({ 
      message: 'QR code validated successfully',
      points,
      totalPoints: newTotalPoints
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: fromZodError(error).toString() });
    }
    console.error('QR validation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout
router.post('/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

export default router;