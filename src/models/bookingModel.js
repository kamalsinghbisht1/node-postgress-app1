import pool from "../config/db.js";

// 🔹 Update existing step data
export const updateBookingStep = async (case_id, column, data, current_step) => {
  const query = `
    UPDATE newbookingprocess
    SET ${column} = $1,
        current_step = $2,
        updated_at = NOW()
    WHERE case_id = $3
    RETURNING *;
  `;
  const result = await pool.query(query, [data, current_step, case_id]);
  return result;
};

// 🔹 Insert new booking record
export const insertBookingStep = async (case_id, column, data, current_step) => {
  const query = `
    INSERT INTO newbookingprocess (case_id, ${column}, current_step, created_at, updated_at)
    VALUES ($1, $2, $3, NOW(), NOW())
    RETURNING *;
  `;
  const result = await pool.query(query, [case_id, data, current_step]);
  return result;
};

// 🔹 Get booking step data
export const getBookingStepData = async (case_id, column) => {
  const query = `
    SELECT ${column}, current_step
    FROM newbookingprocess
    WHERE case_id = $1;
  `;
  const result = await pool.query(query, [case_id]);
  return result;
};
