import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Exam attempts
  await knex.schema.createTable('exam_attempts', (table) => {
    table.increments('id').primary();
    table.integer('exam_id').unsigned().notNullable().references('id').inTable('exams').onDelete('CASCADE');
    table.integer('student_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.decimal('score', 5, 2).defaultTo(0);
    table.decimal('percentage', 5, 2).defaultTo(0);
    table.integer('time_spent_seconds').defaultTo(0);
    table.timestamp('started_at').defaultTo(knex.fn.now());
    table.timestamp('completed_at').nullable();
    table.timestamps(true, true);
    
    // Indexes
    table.index(['exam_id']);
    table.index(['student_id']);
    table.index(['completed_at']);
    table.unique(['exam_id', 'student_id']); // One attempt per student per exam
  });

  // Exam answers
  await knex.schema.createTable('exam_answers', (table) => {
    table.increments('id').primary();
    table.integer('attempt_id').unsigned().notNullable().references('id').inTable('exam_attempts').onDelete('CASCADE');
    table.integer('question_id').unsigned().notNullable().references('id').inTable('questions').onDelete('CASCADE');
    table.json('selected_options').nullable(); // Array of selected option IDs
    table.boolean('is_correct').defaultTo(false);
    table.decimal('points_earned', 5, 2).defaultTo(0);
    table.integer('time_spent_seconds').defaultTo(0);
    table.timestamps(true, true);
    
    table.unique(['attempt_id', 'question_id']);
    table.index(['attempt_id']);
  });

  // Study materials
  await knex.schema.createTable('study_materials', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.enum('subject', ['turkce', 'matematik', 'fen_bilimleri', 'sosyal_bilgiler', 'ingilizce', 'din_kulturu']).notNullable();
    table.enum('type', ['text', 'pdf', 'video', 'audio', 'image']).notNullable();
    table.text('content').nullable();
    table.string('file_path').nullable();
    table.string('file_name').nullable();
    table.integer('file_size').nullable();
    table.boolean('is_active').defaultTo(true);
    table.integer('created_by').unsigned().notNullable().references('id').inTable('users');
    table.timestamps(true, true);
    
    // Indexes
    table.index(['subject']);
    table.index(['type']);
    table.index(['is_active']);
  });

  // Activity logs
  await knex.schema.createTable('activity_logs', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('action').notNullable();
    table.text('details').nullable();
    table.string('ip_address').nullable();
    table.string('user_agent').nullable();
    table.timestamps(true, true);
    
    // Indexes
    table.index(['user_id']);
    table.index(['action']);
    table.index(['created_at']);
  });

  // Refresh tokens
  await knex.schema.createTable('refresh_tokens', (table) => {
    table.increments('id').primary();
    table.string('token').notNullable().unique();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('expires_at').notNullable();
    table.boolean('is_revoked').defaultTo(false);
    table.timestamps(true, true);
    
    table.index(['token']);
    table.index(['user_id']);
    table.index(['expires_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('refresh_tokens');
  await knex.schema.dropTableIfExists('activity_logs');
  await knex.schema.dropTableIfExists('study_materials');
  await knex.schema.dropTableIfExists('exam_answers');
  await knex.schema.dropTableIfExists('exam_attempts');
}