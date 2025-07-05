import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Capsule from "@/models/Capsule";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import User from "@/models/userModel";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Find user by email first, then find capsules by userId
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const capsules = await Capsule.find({ userId: user._id }).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, capsules });
  } catch (error: unknown) {
    console.error('My capsules fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch capsules' }, { status: 500 });
  }
}

export const PATCH = async (req: NextRequest) => {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const { capsuleId, update } = await req.json();
    if (!capsuleId || !update) {
      return NextResponse.json({ success: false, error: "Capsule ID and update data required" }, { status: 400 });
    }
    const capsule = await Capsule.findById(capsuleId);
    if (!capsule) {
      return NextResponse.json({ success: false, error: "Capsule not found" }, { status: 404 });
    }
    if (new Date(capsule.timeLock) <= new Date()) {
      return NextResponse.json({ success: false, error: "Cannot edit capsule after it is opened" }, { status: 403 });
    }
    // Only allow editing if user owns the capsule
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }
    if (capsule.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
    Object.assign(capsule, update);
    await capsule.save();
    return NextResponse.json({ success: true, capsule });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update capsule" }, { status: 500 });
  }
};

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { capsuleId } = await req.json();
    
    if (!capsuleId) {
      return NextResponse.json({ error: 'Capsule ID is required' }, { status: 400 });
    }

    const capsule = await Capsule.findById(capsuleId);
    
    if (!capsule) {
      return NextResponse.json({ error: 'Capsule not found' }, { status: 404 });
    }

    // Check if user owns the capsule by userId
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (capsule.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await Capsule.findByIdAndDelete(capsuleId);
    
    return NextResponse.json({ success: true, message: 'Capsule deleted successfully' });
  } catch (error: unknown) {
    console.error('Delete capsule error:', error);
    return NextResponse.json({ error: 'Failed to delete capsule' }, { status: 500 });
  }
}
