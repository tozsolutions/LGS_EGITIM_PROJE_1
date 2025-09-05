import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Config {
  env: string;
  port: number;
  apiPrefix: string;
  skipDatabaseInit: boolean;
  
  // Database
  database: {
    type: string;
    path: string;
  };
  
  // JWT
  jwt: {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
  
  // Security
  security: {
    bcryptSaltRounds: number;
    rateLimitWindowMs: number;
    rateLimitMaxRequests: number;
  };
  
  // File Upload
  upload: {
    maxFileSize: number;
    uploadPath: string;
  };
  
  // Admin User
  admin: {
    email: string;
    password: string;
  };
  
  // Logging
  logging: {
    level: string;
    file: string;
  };
  
  // CORS
  cors: {
    origin: string;
  };
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  skipDatabaseInit: process.env.SKIP_DB === 'true',
  
  database: {
    type: process.env.DB_TYPE || 'sqlite',
    path: process.env.DB_PATH || './database.sqlite'
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  },
  
  security: {
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10)
  },
  
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
    uploadPath: process.env.UPLOAD_PATH || './public/uploads'
  },
  
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@lgs-egitim.com',
    password: process.env.ADMIN_PASSWORD || 'admin123'
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/app.log'
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001'
  }
};

// Validate required environment variables in production
if (config.env === 'production') {
  const requiredEnvVars = [
    'JWT_SECRET',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD'
  ];
  
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }
  
  if (config.jwt.secret === 'your-super-secret-jwt-key-change-in-production') {
    throw new Error('JWT_SECRET must be changed in production!');
  }
}

export default config;