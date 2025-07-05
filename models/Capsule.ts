import mongoose, { Schema, model, models } from 'mongoose';
import bcrypt from "bcrypt";

// Define schema fields according to your Capsule interface
const CapsuleSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    recipientName: {
      type: String,
      required: true,
    },
    recipientEmail: {
      type: String,
      required: true,
    },
    timeLock: {
      type: Date,
      required: true,
    },
    mediaUrl: {
      type: String,
      default: "",
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    password: { type: String, required: false }, // hashed password
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

// Password hash karne ke liye pre-save hook (optional, best practice)
CapsuleSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Export the model safely to avoid overwrite errors during Next.js hot reloads
const Capsule = models.Capsule || model('Capsule', CapsuleSchema);
export default Capsule;
