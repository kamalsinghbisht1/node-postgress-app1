import {
  updateBookingStep,
  insertBookingStep,
  getBookingStepData,
} from "../models/bookingModel.js";
import validateStep from "../validation/stepValidation.js";

// ✅ Step mapping (DB column + next step)
const stepMapping = {
  initiation: { column: "initiation_data", next: "upload_census" },
  upload_census: { column: "upload_census_data", next: "upload_documents" },
  upload_documents: { column: "upload_documents_data", next: "kyc_documents" },
  kyc_documents: { column: "kyc_documents_data", next: "moi_validation" },
  moi_validation: { column: "moi_validation_data", next: "haad_verification" },
  haad_verification: { column: "haad_verification_data", next: "haad_fine" },
  haad_fine: { column: "haad_fine_data", next: "send_for_booking" },
  send_for_booking: { column: "send_for_booking_data", next: "booking_validation" },
  booking_validation: { column: "booking_validation_data", next: "tpa_communication" },
  tpa_communication: { column: "tpa_communication_data", next: "e_policy" },
  e_policy: { column: "e_policy_data", next: null },
};

// 🧩 PUT /api/booking/:step
export const handleStepUpdate = async (req, res) => {
  const { step } = req.params;
  const { case_id, data } = req.body;

  console.log("🟢 Step:", step);
  console.log("🟢 Case ID:", case_id);
  console.log("🟢 Data:", data);

  try {
    // ✅ Step mapping check
    const mapping = stepMapping[step];
    if (!mapping)
      return res.status(400).json({ success: false, message: "Invalid step name." });

    // ✅ Validate step-specific data
    const validationError = validateStep(step, data);
    if (validationError)
      return res.status(400).json({ success: false, message: validationError });

    // 🧱 Try to update existing record
    const updateResult = await updateBookingStep(case_id, mapping.column, data, step);

    if (updateResult.rowCount > 0) {
      return res.status(200).json({
        success: true,
        message: `${step} updated successfully`,
        next_step: mapping.next,
        data: updateResult.rows[0],
      });
    }

    // ➕ If not found, create a new one
    const insertResult = await insertBookingStep(case_id, mapping.column, data, mapping.next);

    res.status(201).json({
      success: true,
      message: `${step} created successfully`,
      next_step: mapping.next,
      data: insertResult.rows[0],
    });
  } catch (error) {
    console.error("❌ Error in handleStepUpdate:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating step",
    });
  }
};

// 🧾 GET /api/booking/:case_id/:step
export const getStepData = async (req, res) => {
  const { case_id, step } = req.params;

  try {
    const mapping = stepMapping[step];
    if (!mapping)
      return res.status(400).json({ success: false, message: "Invalid step name." });

    const result = await getBookingStepData(case_id, mapping.column);

    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: "Case not found." });

    res.status(200).json({
      success: true,
      step,
      data: result.rows[0][mapping.column],
      current_step: result.rows[0].current_step,
    });
  } catch (error) {
    console.error("❌ Error in getStepData:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching step data",
    });
  }
};











// import pool from "../config/db.js";
// import  validateStep  from "../validation/stepValidation.js";

// // ✅ Step mapping (DB column + next step)
// const stepMapping = {
//   initiation: { column: "initiation_data", next: "upload_census" },
//   upload_census: { column: "upload_census_data", next: "upload_documents" },
//   upload_documents: { column: "upload_documents_data", next: "kyc_documents" },
//   kyc_documents: { column: "kyc_documents_data", next: "moi_validation" },
//   moi_validation: { column: "moi_validation_data", next: "haad_verification" },
//   haad_verification: { column: "haad_verification_data", next: "haad_fine" },
//   haad_fine: { column: "haad_fine_data", next: "send_for_booking" },
//   send_for_booking: { column: "send_for_booking_data", next: "booking_validation" },
//   booking_validation: { column: "booking_validation_data", next: "tpa_communication" },
//   tpa_communication: { column: "tpa_communication_data", next: "e_policy" },
//   e_policy: { column: "e_policy_data", next: null },
// };

// // 🧩 PUT /api/booking/:step
// export const handleStepUpdate = async (req, res) => {
//   const { step } = req.params;
//   const { case_id, data } = req.body;
//    // 🟢 Debug logs — add these at the top
//   console.log("🟢 Step:", step);
//   console.log("🟢 Case ID:", case_id);
//   console.log("🟢 Data:", data);

//   try {
//     const mapping = stepMapping[step];
//     if (!mapping)
//       return res.status(400).json({ success: false, message: "Invalid step name." });

//     // ✅ Step-specific validation
//     const validationError = validateStep(step, data);
//     if (validationError)
//       return res.status(400).json({ success: false, message: validationError });

//     // 🏗️ Try UPDATE
//     const updateQuery = `
//       UPDATE newbookingprocess
//       SET ${mapping.column} = $1,
//           current_step = $2,
//           updated_at = NOW()
//       WHERE case_id = $3
//       RETURNING *;
//     `;
//     // const updateResult = await pool.query(updateQuery, [data, mapping.next, case_id]);
//     const updateResult = await pool.query(updateQuery, [data, step, case_id]);
           

//     if (updateResult.rowCount > 0) {
//       return res.status(200).json({
//         success: true,
//         message: `${step} updated successfully`,
//         next_step: mapping.next,
//         data: updateResult.rows[0],
//       });
//     }

//     // ➕ INSERT if not exist
//     const insertQuery = `
//       INSERT INTO newbookingprocess (case_id, ${mapping.column}, current_step, created_at, updated_at)
//       VALUES ($1, $2, $3, NOW(), NOW())
//       RETURNING *;
//     `;
//     const insertResult = await pool.query(insertQuery, [case_id, data, mapping.next]);

//     res.status(201).json({
//       success: true,
//       message: `${step} created successfully`,
//       next_step: mapping.next,
//       data: insertResult.rows[0],
//     });
//   } catch (error) {
//     console.error("❌ Error updating step:", error);
//     res.status(500).json({ success: false, message: "Server error while updating step" });
//   }
// };

// // 🧾 GET /api/booking/:case_id/:step
// export const getStepData = async (req, res) => {
//   const { case_id, step } = req.params;

//   try {
//     const mapping = stepMapping[step];
//     if (!mapping)
//       return res.status(400).json({ success: false, message: "Invalid step name." });

//     const result = await pool.query(
//       `SELECT ${mapping.column}, current_step FROM newbookingprocess WHERE case_id = $1`,
//       [case_id]
//     );

//     if (result.rows.length === 0)
//       return res.status(404).json({ success: false, message: "Case not found." });

//     res.status(200).json({
//       success: true,
//       step,
//       data: result.rows[0][mapping.column],
//       current_step: result.rows[0].current_step,
//     });
//   } catch (error) {
//     console.error("❌ Error fetching step data:", error);
//     res.status(500).json({ success: false, message: "Server error while fetching step data" });
//   }
// };
