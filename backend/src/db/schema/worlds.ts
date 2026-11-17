import { pgTable, text, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const worldsTable = pgTable('worlds', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  width: integer('width').notNull(),
  depth: integer('depth').notNull(),
  environment: jsonb('environment').notNull(), // Stores temperature, sunlight, water cycles
  organisms: jsonb('organisms').notNull(),     // Stores serializable array of plants, rabbits, foxes
  simulation: jsonb('simulation').notNull(),   // Stores tick/speed variables
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
