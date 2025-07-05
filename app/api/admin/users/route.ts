import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../models/userModel';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/authOptions';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const query = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error: unknown) {
    console.error('Admin users error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch users' 
    }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { userId, action } = body;

    if (!userId || !action) {
      return NextResponse.json({ success: false, error: 'User ID and action required' }, { status: 400 });
    }

    let updateData = {};
    let message = '';

    switch (action) {
      case 'ban':
        updateData = { isBanned: true };
        message = 'User banned successfully';
        break;
      case 'unban':
        updateData = { isBanned: false };
        message = 'User unbanned successfully';
        break;
      case 'makeAdmin':
        updateData = { isAdmin: true };
        message = 'User made admin successfully';
        break;
      case 'removeAdmin':
        updateData = { isAdmin: false };
        message = 'Admin privileges removed successfully';
        break;
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
    
    if (!updatedUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message,
      user: updatedUser 
    });
  } catch (error: unknown) {
    console.error('Update user error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to update user' 
    }, { status: 500 });
  }
} 