import connectDB from "@/lib/connectDB";
import { Admin } from "@/lib/models/Admin";
import { authOptions } from "@/lib/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  await connectDB();

  const adminUser = await Admin.findOne({ email: session.user.email });
  if (!adminUser || adminUser.role !== "Super Admin") {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 }
    );
  }

  const target = await Admin.findById(id);
  if (!target) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  target.status = target.status === "Banned" ? "Active" : "Banned";
  await target.save();

  return NextResponse.json({
    success: true,
    message: `Admin ${
      target.status === "Banned" ? "banned" : "unbanned"
    } successfully`,
    data: target,
  });
}
