// src/models/newbookingModel.js
const pool = require("../config/db");

/**
 * createNewBooking(data)
 * data = { case_id, policy_holder, policy_effective_date, policy_payment_term, tpa, broker_name, underwriting_clause }
 */
const createNewBooking = async (data) => {
  const {
    case_id,
    policy_holder,
    policy_effective_date,
    policy_payment_term,
    tpa,
    broker_name,
    underwriting_clause,
  } = data;

  const query = `INSERT INTO newbooking
    (case_id, policy_holder, policy_effective_date, policy_payment_term, tpa, broker_name, underwriting_clause)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`;

  const values = [
    case_id,
    policy_holder,
    policy_effective_date,
    policy_payment_term,
    tpa || null,
    broker_name || null,
    underwriting_clause || null
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const findBookingByCaseId = async (case_id) => {
  const { rows } = await pool.query("SELECT * FROM newbooking WHERE case_id = $1", [case_id]);
  return rows[0];
};

module.exports = { createNewBooking, findBookingByCaseId };
