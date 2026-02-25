import {pgTable, serial, timestamp, varchar} from 'drizzle-orm/pg-core';

export const users = pgTable('users',{
  id: serial('id').primaryKey(),
  name: varchar('name',{length:255}).notNull(),
  email: varchar('name',{length:255}).notNull().unique(),
  password: varchar('name',{length:255}).notNull(),
  role: varchar('role',{length:255}).notNull().default('user'),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),

});