declare module 'jsonwebtoken' {
  export type Secret = string | Buffer;
  export interface SignOptions {
    expiresIn?: string | number;
    algorithm?: string;
    audience?: string | string[];
    issuer?: string;
    subject?: string;
  }

  export function sign(payload: any, secret: Secret, options?: SignOptions): string;
  export function verify(token: string, secret: Secret): any;
}

