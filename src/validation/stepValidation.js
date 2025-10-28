
export default function validateStep(step, data) {
  switch (step) {
    // 1️⃣ Initiation Step
    case "initiation": {
      const requiredFields = [
        "policy_holder",
        "policy_effective_date",
        "policy_payment_term",
        "broker_name",
        "policy_type",
        "tpa",
      ];
      for (const field of requiredFields) {
        if (!data?.[field]) return `${field} is required.`;
      }
      break;
    }

    // 2️⃣ Upload Census
    case "upload_census": {
      if (!data?.census_file) return "Census file is required.";
      if (!data?.uploaded_by) return "Uploaded by user is required.";
      break;
    }

    // 3️⃣ Upload Documents
    case "upload_documents": {
      if (!data?.documents || !Array.isArray(data.documents))
        return "Documents array is required.";
      if (data.documents.length === 0)
        return "At least one document must be uploaded.";
      break;
    }

    // 4️⃣ KYC Documents
    case "kyc_documents": {
      if (!data?.kyc_type) return "KYC type is required.";
      if (!data?.kyc_file) return "KYC file is required.";
      if (!data?.verified_by) return "Verifier name is required.";
      break;
    }

    // 5️⃣ MOI Validation
    case "moi_validation": {
      if (!data?.moi_status) return "MOI validation status is required.";
      if (!["approved", "rejected", "pending"].includes(data.moi_status.toLowerCase()))
        return "MOI status must be one of: approved, rejected, pending.";
      break;
    }

    // 6️⃣ HAAD Verification
    case "haad_verification": {
      if (!data?.haad_status) return "HAAD verification status is required.";
      if (!data?.verified_on) return "HAAD verification date is required.";
      break;
    }

    // 7️⃣ HAAD Fine
    case "haad_fine": {
      if (data?.has_fine && !data?.fine_amount)
        return "Fine amount is required when has_fine is true.";
      if (data?.has_fine && !data?.payment_status)
        return "Payment status is required when has_fine is true.";
      break;
    }

    // 8️⃣ Send for Booking
    case "send_for_booking": {
      if (!data?.sent_by) return "Sent by user is required.";
      if (!data?.sent_date) return "Sent date is required.";
      break;
    }

    // 9️⃣ Booking Validation
    case "booking_validation": {
      if (!data?.validated_by) return "Validated by user is required.";
      if (!data?.validation_status) return "Validation status is required.";
      break;
    }

    // 🔟 TPA Communication
    case "tpa_communication": {
      if (!data?.tpa_name) return "TPA name is required.";
      if (!data?.communication_date) return "Communication date is required.";
      if (!data?.status) return "Communication status is required.";
      break;
    }

    // 11️⃣ E-Policy Generation
    case "e_policy": {
      if (!data?.policy_number) return "Policy number is required.";
      if (!data?.generated_date) return "Generated date is required.";
      if (!data?.download_link) return "Download link is required.";
      break;
    }

    // Default
    default:
      return null;
  }

  return null;
}
