import mongoose, { Schema, Model, Document } from "mongoose";

/** Event document shape for type-safe access */
export interface EventDocument extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/** Input shape when creating/updating an event (no auto fields) */
export interface EventInput {
  title: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
}

const eventSchema = new Schema<EventDocument>(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    slug: { type: String, unique: true, trim: true },
    description: { type: String, required: [true, "Description is required"], trim: true },
    overview: { type: String, required: [true, "Overview is required"], trim: true },
    image: { type: String, required: [true, "Image is required"], trim: true },
    venue: { type: String, required: [true, "Venue is required"], trim: true },
    location: { type: String, required: [true, "Location is required"], trim: true },
    date: { type: String, required: [true, "Date is required"], trim: true },
    time: { type: String, required: [true, "Time is required"], trim: true },
    mode: { type: String, required: [true, "Mode is required"], trim: true },
    audience: { type: String, required: [true, "Audience is required"], trim: true },
    agenda: {
      type: [String],
      required: [true, "Agenda is required"],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0 && v.every((s) => typeof s === "string" && s.trim().length > 0),
        message: "Agenda must be a non-empty array of non-empty strings",
      },
    },
    organizer: { type: String, required: [true, "Organizer is required"], trim: true },
    tags: {
      type: [String],
      required: [true, "Tags are required"],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0 && v.every((s) => typeof s === "string" && s.trim().length > 0),
        message: "Tags must be a non-empty array of non-empty strings",
      },
    },
  },
  { timestamps: true }
);

// Unique index on slug for fast lookups and duplicate prevention
eventSchema.index({ slug: 1 }, { unique: true });

/** Generates a URL-friendly slug from the title (lowercase, hyphens, no special chars). */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Normalizes date string to ISO date (YYYY-MM-DD). Accepts ISO or parseable date strings. */
function normalizeDate(dateStr: string): string {
  const trimmed = dateStr.trim();
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return trimmed;
  }
  return parsed.toISOString().slice(0, 10);
}

/** Normalizes time to HH:mm (24h). Accepts "2pm", "14:00", "2:30 PM", etc. */
function normalizeTime(timeStr: string): string {
  const trimmed = timeStr.trim();
  const parsed = new Date(`1970-01-01T${trimmed}`);
  if (trimmed.includes(":") && /^\d{1,2}:\d{2}(\s*(am|pm))?$/i.test(trimmed)) {
    const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/i);
    if (match) {
      let h = parseInt(match[1], 10);
      const m = match[2];
      const period = (match[3] || "").toLowerCase();
      if (period === "pm" && h < 12) h += 12;
      if (period === "am" && h === 12) h = 0;
      return `${h.toString().padStart(2, "0")}:${m}`;
    }
  }
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toTimeString().slice(0, 5);
  }
  return trimmed;
}

eventSchema.pre("save", function (next) {
  // Slug: only regenerate when title changes to keep existing URLs stable
  if (this.isModified("title")) {
    this.slug = slugify(this.title);
  }

  // Normalize date to ISO and time to consistent format for consistent querying/display
  this.date = normalizeDate(this.date);
  this.time = normalizeTime(this.time);

  next();
});

// Ensure required string fields are non-empty (schema validators run after pre-save)
eventSchema.pre("save", function (next) {
  const requiredStrings = ["title", "description", "overview", "image", "venue", "location", "date", "time", "mode", "audience", "organizer"] as const;
  for (const field of requiredStrings) {
    const value = this[field];
    if (typeof value !== "string" || value.trim() === "") {
      return next(new Error(`${field} must be a non-empty string`));
    }
  }
  next();
});

export const Event: Model<EventDocument> =
  (mongoose.models.Event as Model<EventDocument>) ?? mongoose.model<EventDocument>("Event", eventSchema);
