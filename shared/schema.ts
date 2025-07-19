import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  mobile: text("mobile").notNull().unique(),
  totalPoints: integer("total_points").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const qrCodes = pgTable("qr_codes", {
  id: text("id").primaryKey(), // 32-character alphanumeric code
  points: integer("points").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  scannedBy: integer("scanned_by").references(() => users.id),
  scannedAt: timestamp("scanned_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const otpVerifications = pgTable("otp_verifications", {
  id: serial("id").primaryKey(),
  mobile: text("mobile").notNull(),
  otp: text("otp").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  mobile: true,
});

export const insertQRCodeSchema = createInsertSchema(qrCodes).pick({
  id: true,
  points: true,
});

export const insertOTPSchema = createInsertSchema(otpVerifications).pick({
  mobile: true,
  otp: true,
});

export const loginSchema = z.object({
  mobile: z.string().regex(/^\+91[6-9]\d{9}$/, "Invalid Indian mobile number"),
});

export const verifyOTPSchema = z.object({
  mobile: z.string().regex(/^\+91[6-9]\d{9}$/, "Invalid Indian mobile number"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const scanQRSchema = z.object({
  qrCode: z.string().length(32, "QR code must be 32 characters"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertQRCode = z.infer<typeof insertQRCodeSchema>;
export type QRCode = typeof qrCodes.$inferSelect;
export type InsertOTP = z.infer<typeof insertOTPSchema>;
export type OTPVerification = typeof otpVerifications.$inferSelect;
