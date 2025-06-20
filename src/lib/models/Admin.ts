import { Schema, Document, models, model } from "mongoose";

export type AdminStatus = "Active" | "Restricted" | "Banned";

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  status: AdminStatus;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    status: {
      type: String,
      enum: ["Active", "Restricted", "Banned"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export const Admin = models.Admin || model<IAdmin>("Admin", AdminSchema);
