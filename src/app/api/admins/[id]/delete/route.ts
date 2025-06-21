import connectDB from "@/lib/connectDB";
import { Admin } from "@/lib/models/Admin";
import { authOptions } from "@/lib/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
const { id } = await context.params

  await connectDB();

  const adminUser = await Admin.findOne({ email: session.user.email });
  if (!adminUser || adminUser.role !== "Super Admin") {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 }
    );
  }

  const deletedAdmin = await Admin.findByIdAndDelete(id);
  if (!deletedAdmin) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: "Admin deleted successfully",
    data: deletedAdmin,
  });
}
