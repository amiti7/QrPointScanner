import { users, qrCodes, otpVerifications, type User, type InsertUser, type QRCode, type InsertQRCode, type OTPVerification, type InsertOTP } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByMobile(mobile: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(id: number, points: number): Promise<User>;

  // QR Code operations
  getQRCode(id: string): Promise<QRCode | undefined>;
  createQRCode(qrCode: InsertQRCode): Promise<QRCode>;
  markQRCodeAsScanned(id: string, userId: number): Promise<QRCode>;

  // OTP operations
  createOTP(otp: InsertOTP & { expiresAt: Date }): Promise<OTPVerification>;
  getOTPByMobile(mobile: string): Promise<OTPVerification | undefined>;
  markOTPAsVerified(id: number): Promise<OTPVerification>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private qrCodes: Map<string, QRCode>;
  private otpVerifications: Map<number, OTPVerification>;
  private currentUserId: number;
  private currentOTPId: number;

  constructor() {
    this.users = new Map();
    this.qrCodes = new Map();
    this.otpVerifications = new Map();
    this.currentUserId = 1;
    this.currentOTPId = 1;

    // Pre-populate some valid QR codes for testing
    this.createQRCode({ id: "1AAAICP0166JM16PHE5PQNM988JS7260", points: 10 });
    this.createQRCode({ id: "2BBBICP0166JM16PHE5PQNM988JS7251", points: 25 });
    this.createQRCode({ id: "5CCCICP0166JM16PHE5PQNM988JS7265", points: 50 });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByMobile(mobile: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.mobile === mobile);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      totalPoints: 0,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserPoints(id: number, additionalPoints: number): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = {
      ...user,
      totalPoints: user.totalPoints + additionalPoints,
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getQRCode(id: string): Promise<QRCode | undefined> {
    return this.qrCodes.get(id);
  }

  async createQRCode(insertQRCode: InsertQRCode): Promise<QRCode> {
    const qrCode: QRCode = {
      ...insertQRCode,
      isActive: true,
      scannedBy: null,
      scannedAt: null,
      createdAt: new Date(),
    };
    this.qrCodes.set(insertQRCode.id, qrCode);
    return qrCode;
  }

  async markQRCodeAsScanned(id: string, userId: number): Promise<QRCode> {
    const qrCode = this.qrCodes.get(id);
    if (!qrCode) {
      throw new Error("QR code not found");
    }
    const updatedQRCode = {
      ...qrCode,
      scannedBy: userId,
      scannedAt: new Date(),
    };
    this.qrCodes.set(id, updatedQRCode);
    return updatedQRCode;
  }

  async createOTP(otpData: InsertOTP & { expiresAt: Date }): Promise<OTPVerification> {
    // Remove any existing OTP for this mobile
    const existing = Array.from(this.otpVerifications.values()).find(
      otp => otp.mobile === otpData.mobile && !otp.verified
    );
    if (existing) {
      this.otpVerifications.delete(existing.id);
    }

    const id = this.currentOTPId++;
    const otp: OTPVerification = {
      ...otpData,
      id,
      verified: false,
      createdAt: new Date(),
    };
    this.otpVerifications.set(id, otp);
    return otp;
  }

  async getOTPByMobile(mobile: string): Promise<OTPVerification | undefined> {
    return Array.from(this.otpVerifications.values()).find(
      otp => otp.mobile === mobile && !otp.verified && otp.expiresAt > new Date()
    );
  }

  async markOTPAsVerified(id: number): Promise<OTPVerification> {
    const otp = this.otpVerifications.get(id);
    if (!otp) {
      throw new Error("OTP not found");
    }
    const updatedOTP = {
      ...otp,
      verified: true,
    };
    this.otpVerifications.set(id, updatedOTP);
    return updatedOTP;
  }
}

export const storage = new MemStorage();
