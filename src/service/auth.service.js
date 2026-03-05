import logger from '#config/logger.js';
import bcrypt from 'bcrypt';
import { db } from '#config/database.js';
import { eq } from 'drizzle-orm';
import { users } from '#models/user.model.js';

export const hashedPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    logger.error(`Error hashing the password: ${error}`);
    throw new Error('Error hashing the password', { cause: error });
  }
};

export const createUser = async ({ name, email, password, role = 'user' }) => {
  try {
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      throw new Error('User already exists');
    }
    const passwordHash = await hashedPassword(password);
    const [newUser] = await db.insert(users).values({ name, email, password: passwordHash, role }).returning({ id: users.id, name: users.name, email: users.email, role: users.role, createdAt: users.createdAt });
    logger.info(`User created ${newUser.name} with email: ${newUser.email}`);
    return newUser;
  } catch (error) {
    logger.error(`Error creating the user : ${error}`);
    throw new Error('Error creating the user', { cause: error });
  }
};


