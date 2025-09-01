import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Questions table
  await knex.schema.createTable('questions', (table) => {
    table.increments('id').primary();
    table.enum('subject', ['turkce', 'matematik', 'fen_bilimleri', 'sosyal_bilgiler', 'ingilizce', 'din_kulturu']).notNullable();
    table.string('topic').notNullable();
    table.enum('difficulty', ['easy', 'medium', 'hard']).notNullable();
    table.text('content').notNullable();
    table.text('explanation').nullable();
    table.integer('points').defaultTo(1);
    table.integer('time_limit').defaultTo(60); // seconds
    table.integer('created_by').unsigned().notNullable().references('id').inTable('users');
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    // Indexes
    table.index(['subject']);
    table.index(['difficulty']);
    table.index(['topic']);
    table.index(['is_active']);
  });

  // Question options
  await knex.schema.createTable('question_options', (table) => {
    table.increments('id').primary();
    table.integer('question_id').unsigned().notNullable().references('id').inTable('questions').onDelete('CASCADE');
    table.text('text').notNullable();
    table.boolean('is_correct').defaultTo(false);
    table.integer('order_index').defaultTo(0);
    table.timestamps(true, true);
    
    table.index(['question_id']);
  });

  // Exams table
  await knex.schema.createTable('exams', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('description').nullable();
    table.integer('duration_minutes').notNullable();
    table.integer('total_questions').notNullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamp('start_date').nullable();
    table.timestamp('end_date').nullable();
    table.integer('created_by').unsigned().notNullable().references('id').inTable('users');
    table.timestamps(true, true);
    
    // Indexes
    table.index(['is_active']);
    table.index(['start_date', 'end_date']);
  });

  // Exam questions (many-to-many relationship)
  await knex.schema.createTable('exam_questions', (table) => {
    table.increments('id').primary();
    table.integer('exam_id').unsigned().notNullable().references('id').inTable('exams').onDelete('CASCADE');
    table.integer('question_id').unsigned().notNullable().references('id').inTable('questions').onDelete('CASCADE');
    table.integer('order_index').notNullable();
    table.timestamps(true, true);
    
    table.unique(['exam_id', 'question_id']);
    table.index(['exam_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('exam_questions');
  await knex.schema.dropTableIfExists('exams');
  await knex.schema.dropTableIfExists('question_options');
  await knex.schema.dropTableIfExists('questions');
}