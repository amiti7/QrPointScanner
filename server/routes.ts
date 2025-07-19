import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, verifyOTPSchema, scanQRSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Send OTP
  app.post("/api/auth/send-otp", async (req, res) => {
    try {
      const { mobile } = loginSchema.parse(req.body);
      
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      await storage.createOTP({ mobile, otp, expiresAt });

      // In production, send actual SMS here
      console.log(`OTP for ${mobile}: ${otp}`);

      res.json({ message: "OTP sent successfully" });
    } catch (error) {
      res.status(400).json({ message: "Invalid mobile number" });
    }
  });

  // Verify OTP and login
  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { mobile, otp } = verifyOTPSchema.parse(req.body);
      
      const otpRecord = await storage.getOTPByMobile(mobile);
      if (!otpRecord || otpRecord.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      if (otpRecord.expiresAt < new Date()) {
        return res.status(400).json({ message: "OTP expired" });
      }

      // Mark OTP as verified
      await storage.markOTPAsVerified(otpRecord.id);

      // Get or create user
      let user = await storage.getUserByMobile(mobile);
      if (!user) {
        user = await storage.createUser({ mobile });
      }

      res.json({ user });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // Get user profile
  app.get("/api/user/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ user });
    } catch (error) {
      res.status(400).json({ message: "Invalid user ID" });
    }
  });

  // Validate QR code
  app.post("/api/qr/validate", async (req, res) => {
    try {
      const { qrCode } = scanQRSchema.parse(req.body);
      const userId = parseInt(req.body.userId);

      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }

      // Parse points from QR code (first and last characters)
      const firstChar = qrCode[0];
      const lastChar = qrCode[31];
      
      if (!/\d/.test(firstChar) || !/\d/.test(lastChar)) {
        return res.status(400).json({ message: "Invalid QR code format" });
      }

      const points = parseInt(firstChar + lastChar);

      // Check if QR code exists and is valid
      const qrRecord = await storage.getQRCode(qrCode);
      if (!qrRecord) {
        return res.status(400).json({ message: "Invalid QR code" });
      }

      if (!qrRecord.isActive) {
        return res.status(400).json({ message: "QR series not active" });
      }

      if (qrRecord.scannedBy) {
        return res.status(400).json({ message: "QR code already scanned" });
      }

      // Mark QR as scanned and update user points
      await storage.markQRCodeAsScanned(qrCode, userId);
      const updatedUser = await storage.updateUserPoints(userId, points);

      res.json({ 
        message: "QR code validated successfully", 
        points,
        totalPoints: updatedUser.totalPoints 
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
