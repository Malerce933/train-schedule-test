import { pool } from './db';

export async function createUser(email: string, password: string): Promise<{ id: string, email: string }> {
    const query = `
      INSERT INTO train_schedule.users (email, password)
      VALUES ($1, $2)
      RETURNING id, email;
    `;
  
    try {
      const result = await pool.query(query, [email, password]);
      return result.rows[0]; 
    } catch (err) {
      console.error("Error creating user:", err);
      throw new Error("Database error while creating user.");
    }
  }
  

export async function getUserByEmail(email: string): Promise<{ id: string, email: string, password: string } | null> {
    const query = `
      SELECT id, email, password FROM train_schedule.users
      WHERE email = $1;
    `;
    
    try {
      const result = await pool.query(query, [email]);
      return result.rows[0] || null;
    } catch (err) {
      console.error("Error fetching user by email:", err);
      throw new Error("Database error while fetching user.");
    }
  }
  
