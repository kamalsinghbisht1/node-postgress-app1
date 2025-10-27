// src/controllers/newbookingController.js
const { createNewBooking, findBookingByCaseId } = require("../models/newbookingModel");

const createNewBookingController = async (req, res) => {
  try {
    const {
      case_id,
      policy_holder,
      policy_effective_date,
      policy_payment_term,
      tpa,
      broker_name,
      underwriting_clause,
    } = req.body;

    // Collect missing/invalid fields
    const errors = [];

    if (!case_id || String(case_id).trim() === "") {
      errors.push({ field: "case_id", message: "Case ID is required" });
    }
    if (!policy_holder || String(policy_holder).trim() === "") {
      errors.push({ field: "policy_holder", message: "Policy holder is required" });
    }
    if (!policy_effective_date || String(policy_effective_date).trim() === "") {
      errors.push({ field: "policy_effective_date", message: "Policy effective date is required" });
    } else {
      // basic date format check (YYYY-MM-DD) - optional but helpful
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(String(policy_effective_date))) {
        errors.push({ field: "policy_effective_date", message: "Policy effective date must be YYYY-MM-DD" });
      }
    }
    if (!policy_payment_term || String(policy_payment_term).trim() === "") {
      errors.push({ field: "policy_payment_term", message: "Policy payment term is required" });
    }

    // If any validation errors, return 400 with details
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors, // array of { field, message }
      });
    }

    // ✅ Check for duplicate case_id
    const existing = await findBookingByCaseId(case_id);
    if (existing) {
      return res.status(409).json({ success: false, message: "case_id already exists" });
    }

    // ✅ Create new record
    const booking = await createNewBooking({
      case_id,
      policy_holder,
      policy_effective_date,
      policy_payment_term,
      tpa,
      broker_name,
      underwriting_clause
    });

    res.status(201).json({ success: true, booking });

  } catch (err) {
    console.error("❌ Error creating booking:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { createNewBookingController };





