// Simple memory storage for OTPs
// In a production app, this should be a DB or Redis.

export const otpStorage: Record<string, { otp: string, expires: number }> = {};
