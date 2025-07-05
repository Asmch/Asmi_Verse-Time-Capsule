import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Capsule from '../../../../models/Capsule';
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
        { title: { $regex: search, $options: 'i' } },
        { recipientName: { $regex: search, $options: 'i' } },
        { recipientEmail: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const [capsules, total] = await Promise.all([
      Capsule.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Capsule.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      capsules,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error: unknown) {
    console.error('Admin capsules error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch capsules' 
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const capsuleId = searchParams.get('id');

    if (!capsuleId) {
      return NextResponse.json({ success: false, error: 'Capsule ID required' }, { status: 400 });
    }

    const deletedCapsule = await Capsule.findByIdAndDelete(capsuleId);
    
    if (!deletedCapsule) {
      return NextResponse.json({ success: false, error: 'Capsule not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Capsule deleted successfully' });
  } catch (error: unknown) {
    console.error('Delete capsule error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to delete capsule' 
    }, { status: 500 });
  }
} 