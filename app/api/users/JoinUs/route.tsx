import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { sendWelcomeEmail } from "@/helpers/emailService";
import { sendVerificationEmail } from "@/helpers/emailService";

// Ensure DB connection
connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { name, email, password } = reqBody;

    // Input validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields (name, email, password) are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    let existingUser;
    try {
      existingUser = await User.findOne({ email });
    } catch (dbErr) {
      console.error("❌ DB error on findOne:", dbErr);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    let hashedPassword;
    try {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    } catch (hashErr) {
      console.error("❌ Password hashing error:", hashErr);
      return NextResponse.json({ error: "Password hashing failed" }, { status: 500 });
    }

    // Create and save the user
    let savedUser;
    try {
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
      savedUser = await newUser.save();
      console.log("✅ User created:", savedUser);
    } catch (saveErr) {
      console.error("❌ User save error:", saveErr);
      return NextResponse.json({ error: "User creation failed" }, { status: 500 });
    }

    // Generate a verification token
    let verificationToken;
    try {
      verificationToken = require('crypto').randomBytes(32).toString('hex');
      savedUser.verifyToken = verificationToken;
      savedUser.verifyTokenExpiry = Date.now() + 3600000; // 1 hour expiry
      await savedUser.save();
    } catch (tokenErr) {
      console.error("❌ Token generation/save error:", tokenErr);
      return NextResponse.json({ error: "Verification token error" }, { status: 500 });
    }

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailErr) {
      console.error("❌ Verification email error:", emailErr);
      return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
    }

    // Send welcome email in real time
    try {
      await sendWelcomeEmail(email, name);
    } catch (emailErr) {
      console.error("❌ Welcome email error:", emailErr);
      // Don't fail signup if welcome email fails
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        success: true,
        user: {
          _id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Signup error:", error);
    return NextResponse.json(
      { error: "Internal Server Error: " + (error?.message || "Unknown error") },
      { status: 500 }
    );
  }
}
