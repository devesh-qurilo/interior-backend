import { Router } from "express";
import { requireAdmin } from "../middlewares/adminAuth.js";
import { v2 as cloudinary } from "cloudinary";

const r = Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST /api/admin/uploads/cloudinary/sign   (Bearer <JWT>)
r.post("/sign", requireAdmin, async (_req, res) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "interior/projects";

    // Sign exactly the params you will send in the upload form
    const paramsToSign = { timestamp, folder };
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    return res.json({
      status: true,
      message: "Signed",
      data: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        timestamp,
        signature,
        folder,
      },
    });
  } catch (e) {
    console.error("cloudinary sign error:", e);
    return res.status(500).json({ status: false, message: "Sign failed" });
  }
});

export default r;
