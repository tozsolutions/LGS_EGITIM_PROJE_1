import knex, { Knex } from 'knex';
import config from './index';
import path from 'path';
import bcrypt from 'bcryptjs';

// Determine runtime extension (ts when running via ts-node, js when compiled)
const runtimeExtension = path.extname(__filename).replace('.', '') || 'js';

const dbConfig: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: path.resolve(config.database.path)
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.join(__dirname, '../migrations'),
    extension: runtimeExtension
  },
  seeds: {
    directory: path.join(__dirname, '../seeds'),
    extension: runtimeExtension
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
    try {
      await db.migrate.latest();
      console.log('✅ Database migrations completed');
    } catch (migrationError) {
      console.warn('⚠️ Migrations failed or not found, continuing with programmatic schema init:', migrationError);
    }

    // Ensure base tables exist (programmatic fallback)
    const usersTableExists = await db.schema.hasTable('users');
    if (!usersTableExists) {
      await db.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('email').notNullable().unique();
        table.string('username').notNullable().unique();
        table.string('firstName').notNullable();
        table.string('lastName').notNullable();
        table.string('role').notNullable().defaultTo('student');
        table.boolean('isActive').notNullable().defaultTo(true);
        table.string('password').notNullable();
        table.timestamp('createdAt').notNullable().defaultTo(db.fn.now());
        table.timestamp('updatedAt').notNullable().defaultTo(db.fn.now());
      });
      console.log('✅ Created table: users');
    }

    // Provision default admin user if missing (safe idempotent)
    const adminEmail = config.admin.email;
    const existingAdmin = await db('users').where({ email: adminEmail }).first();
    if (!existingAdmin) {
      const hashed = await bcrypt.hash(config.admin.password, config.security.bcryptSaltRounds);
      await db('users').insert({
        email: adminEmail,
        username: adminEmail.split('@')[0],
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true,
        password: hashed,
      });
      console.log(`✅ Seeded default admin user: ${adminEmail}`);
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