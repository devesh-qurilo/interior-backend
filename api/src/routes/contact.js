import { Router } from "express";
import prisma from "../prisma.js";

const r = Router();

/**
 * POST /api/contact
 * Body fields (exact names you gave):
 * - name, email, contactNo, projectType, propertyType,
 *   TotalArea, NumberOfRoom, BudgetsRange, TimeToStart, Message
 *
 * Returns: { status:boolean, message:string, data?:{ id:number } }
 */
r.post("/", async (req, res) => {
  try {
    // accept both your exact-cased keys and camelCase (maps to DB fields)
    const {
      name,
      email,
      contactNo,
      projectType,
      propertyType,
      TotalArea,
      totalArea,
      NumberOfRoom,
      numberOfRoom,
      BudgetsRange,
      budgetsRange,
      TimeToStart,
      timeToStart,
      Message,
      message,
    } = req.body || {};

    // minimal validation
    if (!name || !email || !(Message || message)) {
      return res.status(400).json({
        status: false,
        message: "name, email and message are required",
      });
    }

    // create
    const saved = await prisma.contactInquiry.create({
      data: {
        name,
        email,
        contactNo: contactNo || null,
        projectType: projectType || null,
        propertyType: propertyType || null,
        totalArea: (TotalArea ?? totalArea) || null,
        numberOfRoom: Number(NumberOfRoom ?? numberOfRoom) || null,
        budgetsRange: (BudgetsRange ?? budgetsRange) || null,
        timeToStart: (TimeToStart ?? timeToStart) || null,
        message: Message ?? message,
      },
      select: { id: true },
    });

    return res.status(201).json({
      status: true,
      message: "Contact inquiry submitted successfully",
      data: { id: saved.id },
    });
  } catch (err) {
    console.error("contact submit error:", err);
    return res.status(500).json({
      status: false,
      message: "Something went wrong while submitting the inquiry",
    });
  }
});

export default r;
