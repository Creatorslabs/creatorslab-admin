import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/authOptions";
import connectDB from "@/lib/connectDB";
import { Admin } from "@/lib/models/Admin";
import { format, formatDistanceToNow } from "date-fns";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  try {
    const admin = await Admin.findOne({ email: session.user.email });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // Destructure only safe fields
    const {
      _id,
      name,
      email,
      role,
      permissions,
      status,
      lastLogin,
      createdAt,
      updatedAt,
    } = admin.toObject();

    const formatted = {
      _id,
      name,
      email,
      role,
      permissions,
      status,
      lastLogin: lastLogin
        ? formatDistanceToNow(new Date(lastLogin), { addSuffix: true })
        : "Never",
      createdAt: format(createdAt, "PPpp"),
      updatedAt: format(updatedAt, "PPpp"),
    };

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
