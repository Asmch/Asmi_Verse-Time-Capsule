import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Capsule from "@/models/Capsule";
import { sendCapsuleEmail } from "@/helpers/emailService";

// For security, protect this endpoint with a secret key
export async function GET(req: Request) {
  try {
    // Optional: Check for a secret key header to secure your cron endpoint
    const authHeader = req.headers.get('Authorization');
    const expectedKey = process.env.CRON_SECRET_KEY;
    
    if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connect();
    
    // Get current date
    const currentDate = new Date();
    
    console.log("Cron job triggered at:", currentDate);
    console.log("Looking for capsules with isDelivered: false and timeLock <= now");
    const capsulesToDeliver = await Capsule.find({
      timeLock: { $lte: currentDate },
      isDelivered: false
    });
    console.log("Capsules found for delivery:", capsulesToDeliver.length);
    if (capsulesToDeliver.length > 0) {
      console.log("Capsule details:", capsulesToDeliver);
    }
    
    // Process each capsule
    const results = await Promise.all(
      capsulesToDeliver.map(async (capsule:any) => {
        try {
          // Send notification email using new email service
          await sendCapsuleEmail(capsule.recipientEmail, {
            title: capsule.title,
            message: capsule.message,
            unlockDate: capsule.timeLock,
          });
          console.log(`[Delivery Email] Sent to: ${capsule.recipientEmail} for capsule: ${capsule.title}`);
          
          // Mark capsule as delivered
          capsule.isDelivered = true;
          capsule.deliveredAt = new Date();
          await capsule.save();
          
          return { id: capsule._id, status: 'delivered' };
        } catch (error) {
          console.error(`Error processing capsule ${capsule._id}:`, error);
          return { id: capsule._id, status: 'error' };
        }
      })
    );
    
    return NextResponse.json({
      success: true,
      processedCount: capsulesToDeliver.length,
      results
    });
    
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process time capsules" },
      { status: 500 }
    );
  }
}

// Email function is now handled by the new email service