// src/models/userModel.js
import pool from "../config/db.js";

// 🔍 Find user by email (for login)
export const findUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT u.id, u.email, u.password, r.name AS role
     FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE u.email = $1`,
    [email]
  );
  return result.rows[0];
};

// ➕ Create a new user (used if you add register later)
export const createUser = async (email, passwordHash, roleId) => {
  const result = await pool.query(
    `INSERT INTO users (email, password, role_id)
     VALUES ($1, $2, $3)
     RETURNING id, email, role_id`,
    [email, passwordHash, roleId]
  );
  return result.rows[0];
};

// 🔎 Find role by name (to map role names to IDs)
export const findRoleByName = async (roleName) => {
  const result = await pool.query(
    "SELECT id FROM roles WHERE name = $1",
    [roleName]
  );
  return result.rows[0];
};
