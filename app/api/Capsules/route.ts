import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import Capsule from "@/models/Capsule";
import userModel from "@/models/userModel";
import { authOptions } from "@/lib/authOptions";
// Debug log for Capsule schema
console.log("Capsule schema paths:", Capsule.schema.paths);

// ✅ Types for API responses
type CapsuleData = {
  id: string;
  title: string;
  recipientName: string;
  recipientEmail: string;
  timeLock: Date;
  createdAt: Date;
  isDelivered?: boolean;
  deliveredAt?: Date | null;
};

type CustomSession = {
  user: {
    id: string;
    email: string;
    name?: string;
    image?: string;
  };
  expires: string;
};

// ✅ GET: Fetch all capsules for the logged-in user
export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions) as CustomSession | null;

    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const capsules = await Capsule.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .select("-message");

    const formattedCapsules: CapsuleData[] = capsules.map((capsule: any) => ({
      id: capsule._id.toString(),
      title: capsule.title,
      recipientName: capsule.recipientName,
      recipientEmail: capsule.recipientEmail,
      timeLock: capsule.timeLock,
      createdAt: capsule.createdAt,
      isDelivered: capsule.isDelivered,
      deliveredAt: capsule.deliveredAt,
    }));

    return NextResponse.json({
      success: true,
      count: formattedCapsules.length,
      capsules: formattedCapsules,
    });
  } catch (error) {
    console.error("Error fetching capsules:", error);
    return NextResponse.json({
      success: false,
      message: "Server error while fetching capsules",
    }, { status: 500 });
  }
}

// ✅ POST: Create a new time capsule
export async function POST(request: Request) { // ✅ Use Request instead of NextRequest
  try {
    await dbConnect();
    const session = await getServerSession(authOptions) as CustomSession | null;

    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, message, recipientName, recipientEmail, timeLock, password, mediaUrl } = body;

    // ✅ Validate required fields
    if (!title || !recipientName || !recipientEmail || !timeLock) {
      return NextResponse.json({
        success: false,
        message: "Please provide all required fields",
      }, { status: 400 });
    }

    // ✅ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json({
        success: false,
        message: "Please provide a valid email address",
      }, { status: 400 });
    }

    // ✅ Validate timeLock is in the future
    const lockTime = new Date(timeLock);
    if (lockTime <= new Date()) {
      return NextResponse.json({
        success: false,
        message: "Time lock must be set in the future",
      }, { status: 400 });
    }

    // ✅ Find the user by email to get their _id
    const user = await userModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    console.log("[Capsule Creation] user._id:", user._id);

    // ✅ Create the new capsule (force userId)
    const newCapsule = new Capsule({
      userId: user._id,
      title: String(title),
      message: String(message || ""),
      recipientName: String(recipientName),
      recipientEmail: String(recipientEmail),
      timeLock: lockTime,
      mediaUrl: String(mediaUrl || ""),
      createdAt: new Date(),
      password: password ? String(password) : undefined,
    });

    await newCapsule.save();
    console.log("[Capsule Creation] newCapsule after save:", newCapsule);

    // Get the user's total capsule count
    const capsuleCount = await Capsule.countDocuments({ userId: user._id });

    // ✅ Send confirmation email (do not await)
    // Remove nodemailer and SMTP logic from this file. If you need to send an email, use the Resend-based helper from helpers/emailService.ts instead.

    return NextResponse.json({
      success: true,
      message: "Time capsule created successfully",
      capsule: {
        id: newCapsule._id.toString(),
        title: newCapsule.title,
        message: newCapsule.message,
        recipientName: newCapsule.recipientName,
        recipientEmail: newCapsule.recipientEmail,
        timeLock: newCapsule.timeLock,
        mediaUrl: newCapsule.mediaUrl,
        createdAt: newCapsule.createdAt,
        isDelivered: newCapsule.isDelivered,
        deliveredAt: newCapsule.deliveredAt,
      },
      capsuleCount,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating capsule:", error);
    return NextResponse.json({
      success: false,
      message: "Server error while creating time capsule",
    }, { status: 500 });
  }
}
