import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Capsule from "@/models/Capsule";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { capsuleId, password } = await request.json();
    if (!capsuleId || !password) {
      return NextResponse.json({ success: false, message: "Capsule ID and password required" }, { status: 400 });
    }
    const capsule = await Capsule.findById(capsuleId);
    if (!capsule) {
      return NextResponse.json({ success: false, message: "Capsule not found" }, { status: 404 });
    }
    if (!capsule.password) {
      return NextResponse.json({ success: false, message: "This capsule is not password protected" }, { status: 400 });
    }
    const match = await bcrypt.compare(password, capsule.password);
    if (!match) {
      return NextResponse.json({ success: false, message: "Incorrect password" }, { status: 401 });
    }
    // Return full capsule content after successful verification
    return NextResponse.json({
      success: true,
      capsule: {
        id: capsule._id.toString(),
        title: capsule.title,
        message: capsule.message,
        recipientName: capsule.recipientName,
        recipientEmail: capsule.recipientEmail,
        timeLock: capsule.timeLock,
        createdAt: capsule.createdAt,
        mediaUrl: capsule.mediaUrl || null,
      }
    });
  } catch (error) {
    console.error('Verify password error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
} 