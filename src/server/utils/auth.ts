import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';

export class AuthUtils {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, config.security.bcryptSaltRounds);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateTokens(payload: object) {
    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    const refreshToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  static verifyToken(token: string): any {
    return jwt.verify(token, config.jwt.secret);
  }

  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Şifre en az 8 karakter olmalıdır');
    }

    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Şifre en az bir küçük harf içermelidir');
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Şifre en az bir büyük harf içermelidir');
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push('Şifre en az bir rakam içermelidir');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static generateRandomString(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}