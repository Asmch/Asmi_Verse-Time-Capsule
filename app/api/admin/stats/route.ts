import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/userModel';
import Capsule from '@/models/Capsule';

export async function GET() {
  try {
    await dbConnect();
    
    // Get basic counts
    const totalUsers = await User.countDocuments();
    const totalCapsules = await Capsule.countDocuments();
    const unlockedCapsules = await Capsule.countDocuments({ timeLock: { $lte: new Date() } });
    
    // Get recent data (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const newCapsules = await Capsule.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo } 
    });
    const newUsers = await User.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo } 
    });
    
    // Get recent capsules and users
    const recentCapsules = await Capsule.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title recipientName recipientEmail createdAt')
      .lean();
      
    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt')
      .lean();
    
    return NextResponse.json({ 
      success: true,
      totalUsers, 
      totalCapsules, 
      unlockedCapsules,
      newCapsules,
      newUsers,
      recentCapsules,
      recentUsers
    });
  } catch (error: unknown) {
    console.error('Stats error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch stats' 
    }, { status: 500 });
  }
} 