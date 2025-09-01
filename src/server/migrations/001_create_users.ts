import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Users table
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email').notNullable().unique();
    table.string('username').notNullable().unique();
    table.string('password_hash').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.enum('role', ['admin', 'teacher', 'student']).notNullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamp('last_login_at').nullable();
    table.timestamps(true, true);
    
    // Indexes
    table.index(['email']);
    table.index(['username']);
    table.index(['role']);
  });

  // Students additional info
  await knex.schema.createTable('student_profiles', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('grade').notNullable(); // LGS is for 8th graders primarily
    table.string('school').nullable();
    table.string('parent_email').nullable();
    table.integer('total_exams_taken').defaultTo(0);
    table.decimal('average_score', 5, 2).defaultTo(0);
    table.timestamps(true, true);
    
    table.unique(['user_id']);
  });

  // Teachers additional info
  await knex.schema.createTable('teacher_profiles', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.enum('subject', ['turkce', 'matematik', 'fen_bilimleri', 'sosyal_bilgiler', 'ingilizce', 'din_kulturu']).notNullable();
    table.integer('experience_years').defaultTo(0);
    table.string('qualification').nullable();
    table.timestamps(true, true);
    
    table.unique(['user_id']);
  });

  // Admin permissions
  await knex.schema.createTable('admin_permissions', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.enum('permission', ['manage_users', 'manage_questions', 'manage_exams', 'view_analytics', 'manage_content']).notNullable();
    table.timestamps(true, true);
    
    table.unique(['user_id', 'permission']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('admin_permissions');
  await knex.schema.dropTableIfExists('teacher_profiles');
  await knex.schema.dropTableIfExists('student_profiles');
  await knex.schema.dropTableIfExists('users');
}