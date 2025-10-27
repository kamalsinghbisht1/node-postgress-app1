const express = require("express");
const { createNewBookingController } = require("../controllers/newbookingController");
const auth = require("../middleware/auth"); // 🔒 JWT middleware

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: NewBooking
 *   description: API endpoints for managing new bookings
 */

/**
 * @swagger
 * /api/newbooking/initiation:       # ✅ important: use the full route (with /api)
 *   post:
 *     summary: Create a new booking
 *     description: Creates a new booking record in the database. Requires JWT authentication.
 *     tags: [NewBooking]
 *     security:
 *       - bearerAuth: []            # 🔒 enables Authorize button for JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - case_id
 *               - policy_holder
 *               - policy_effective_date
 *               - policy_payment_term
 *             properties:
 *               case_id:
 *                 type: string
 *                 example: "CASE123"
 *               policy_holder:
 *                 type: string
 *                 example: "John Doe"
 *               policy_effective_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-01"
 *               policy_payment_term:
 *                 type: string
 *                 example: "Monthly"
 *               tpa:
 *                 type: string
 *                 example: "MediAssist"
 *               broker_name:
 *                 type: string
 *                 example: "Prime Insurance"
 *               underwriting_clause:
 *                 type: string
 *                 example: "Standard underwriting terms apply"
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Validation failed
 *       409:
 *         description: Case ID already exists
 *       401:
 *         description: Unauthorized – Token missing or invalid
 */
router.post("/initiation", auth, createNewBookingController);

module.exports = router;
