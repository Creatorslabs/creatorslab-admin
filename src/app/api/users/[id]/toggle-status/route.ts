import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/authOptions";
import connectDB from "@/lib/connectDB";
import { User } from "@/lib/models/User";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await context.params;

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.status === "Active") {
      user.status = "Deactivated";
    } else if (user.status === "Deactivated") {
      user.status = "Active";
    } else {
      return NextResponse.json(
        { error: "Cannot change status of this user" },
        { status: 400 }
      );
    }

    await user.save();

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("[PATCH] /api/admin/users/[id]/toggle-status", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
