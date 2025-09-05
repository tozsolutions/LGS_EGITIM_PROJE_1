import knex, { Knex } from 'knex';
import config from './index';
import path from 'path';
import fs from 'fs';

const dbConfig: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: path.resolve(config.database.path)
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.join(__dirname, '../migrations'),
    loadExtensions: ['.ts', '.js']
  },
  seeds: {
    directory: path.join(__dirname, '../seeds'),
    loadExtensions: ['.ts', '.js']
  },
  pool: {
    afterCreate: (conn: any, done: any) => {
      // Enable foreign key constraints
      conn.run('PRAGMA foreign_keys = ON', done);
    }
  }
};

// Initialize database connection
const db = knex(dbConfig);

export { db, dbConfig };

// Database initialization and migration
export async function initializeDatabase(): Promise<void> {
  try {
    console.log('🔄 Initializing database...');
    
    // Run migrations
    await db.migrate.latest();
    console.log('✅ Database migrations completed');
    
    // Check if we need to run seeds (in development) and seeds exist
    if (config.env === 'development') {
      const seedsDir = dbConfig.seeds && 'directory' in dbConfig.seeds ? (dbConfig.seeds as any).directory : undefined;
      const hasSeedsDir = typeof seedsDir === 'string' && fs.existsSync(seedsDir);
      if (hasSeedsDir) {
        const seedFiles = fs.readdirSync(seedsDir).filter((f) => f.endsWith('.ts') || f.endsWith('.js'));
        if (seedFiles.length > 0) {
          const hasUsers = await db('users').select('id').first();
          if (!hasUsers) {
            await db.seed.run();
            console.log('✅ Database seeds completed');
          }
        }
      }
    }
    
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

// Graceful database shutdown
export async function closeDatabase(): Promise<void> {
  try {
    await db.destroy();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error closing database:', error);
  }
}

export default db;