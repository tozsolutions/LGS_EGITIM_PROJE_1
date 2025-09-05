import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';

import config from './config';
import logger from './utils/logger';
import { HTTP_STATUS } from '../shared/constants';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import questionRoutes from './routes/questions';
import examRoutes from './routes/exams';
import materialRoutes from './routes/materials';
import analyticsRoutes from './routes/analytics';

class Server {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
    this.createDirectories();
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS
    this.app.use(cors({
      origin: config.cors.origin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.security.rateLimitWindowMs,
      max: config.security.rateLimitMaxRequests,
      message: {
        success: false,
        message: 'Çok fazla istek gönderildi. Lütfen bekleyiniz.',
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use(limiter);

    // Compression
    this.app.use(compression());

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Static files
    this.app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));
    this.app.use('/static', express.static(path.join(process.cwd(), 'public/static')));

    // Request logging
    this.app.use((req, _res, next) => {
      logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        query: req.query,
      });
      next();
    });
  }

  private setupRoutes(): void {
    const apiPrefix = config.apiPrefix;

    // Health check
    this.app.get('/health', (_req, res) => {
      res.json({
        success: true,
        message: 'LGS Eğitim Platformu API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      });
    });

    // API routes
    this.app.use(`${apiPrefix}/auth`, authRoutes);
    this.app.use(`${apiPrefix}/users`, userRoutes);
    this.app.use(`${apiPrefix}/questions`, questionRoutes);
    this.app.use(`${apiPrefix}/exams`, examRoutes);
    this.app.use(`${apiPrefix}/materials`, materialRoutes);
    this.app.use(`${apiPrefix}/analytics`, analyticsRoutes);

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'API endpoint bulunamadı',
        path: req.originalUrl,
      });
    });
  }

  private setupErrorHandling(): void {
    // Global error handler
    this.app.use((error: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
      logger.error('Unhandled error:', {
        error: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
        ip: req.ip,
      });

      // Don't leak error details in production
      const isDevelopment = config.env === 'development';
      
      res.status(error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: isDevelopment ? error.message : 'Sunucu hatası oluştu',
        ...(isDevelopment && { stack: error.stack }),
      });
    });
  }

  private createDirectories(): void {
    // Create required directories
    const directories = [
      'public/uploads',
      'public/static',
      'logs'
    ];

    directories.forEach(dir => {
      const fullPath = path.join(process.cwd(), dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        logger.info(`Created directory: ${fullPath}`);
      }
    });
  }

  public async start(): Promise<void> {
    try {
      // Initialize database (optional)
      if (!config.skipDatabaseInit) {
        const { initializeDatabase } = await import('./config/database');
        await initializeDatabase();
      }

      // Start server
      const port = config.port;
      this.app.listen(port, () => {
        logger.info(`🚀 Server started on port ${port}`);
        logger.info(`📚 LGS Eğitim Platformu API is ready!`);
        logger.info(`🔗 Health check: http://localhost:${port}/health`);
        logger.info(`📖 API docs: http://localhost:${port}${config.apiPrefix}`);
      });

      // Graceful shutdown
      process.on('SIGTERM', this.shutdown);
      process.on('SIGINT', this.shutdown);

    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private shutdown = async (): Promise<void> => {
    logger.info('🔄 Shutting down server...');
    
    try {
      if (!config.skipDatabaseInit) {
        const { closeDatabase } = await import('./config/database');
        await closeDatabase();
      }
      logger.info('✅ Server shutdown complete');
      process.exit(0);
    } catch (error) {
      logger.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  };

  public getApp(): express.Application {
    return this.app;
  }
}

export default Server;