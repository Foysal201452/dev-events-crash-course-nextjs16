import mongoose, { Schema, Model, Document, Types } from "mongoose";

/** Booking document shape for type-safe access */
export interface BookingDocument extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingSchema = new Schema<BookingDocument>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event reference is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => emailRegex.test(v),
        message: "Email must be a valid address",
      },
    },
  },
  { timestamps: true }
);

// Index on eventId for fast lookups (e.g. "all bookings for this event")
bookingSchema.index({ eventId: 1 });

/**
 * Pre-save: ensure the referenced event exists so we never store orphan bookings.
 * Uses model name to avoid circular dependency with event.model.
 */
bookingSchema.pre("save", async function (next) {
  const EventModel = mongoose.models.Event;
  if (!EventModel) {
    return next(new Error("Event model not registered; ensure database models are loaded"));
  }
  const exists = await EventModel.findById(this.eventId).lean();
  if (!exists) {
    return next(new Error(`Event not found for id: ${this.eventId}`));
  }
  next();
});

export const Booking: Model<BookingDocument> =
  (mongoose.models.Booking as Model<BookingDocument>) ?? mongoose.model<BookingDocument>("Booking", bookingSchema);
