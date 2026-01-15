import mongoose, { Document, Schema } from 'mongoose';
import { nanoid } from 'nanoid';

export interface IShortUrl extends Document {
  full: string;
  short: string;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}

const shortUrlSchema = new Schema<IShortUrl>(
  {
    full: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function(v: string) {
          try {
            new URL(v);
            return true;
          } catch {
            return false;
          }
        },
        message: 'Invalid URL format'
      }
    },
    short: {
      type: String,
      required: true,
      default: () => nanoid(10),
      unique: true,
      index: true
    },
    clicks: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

// Index for faster lookups
shortUrlSchema.index({ short: 1 });

export const ShortUrl = mongoose.model<IShortUrl>('ShortUrl', shortUrlSchema);
