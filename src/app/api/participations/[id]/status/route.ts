import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/authOptions";
import connectDB from "@/lib/connectDB";
import { Participation } from "@/lib/models/Participation";
import { isValidObjectId } from "mongoose";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await connectDB();

    const { status } = await req.json();

    if (!["pending"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'pending'." },
        { status: 400 }
      );
    }

    const participation = await Participation.findById(id);
    if (!participation) {
      return NextResponse.json(
        { error: "Participation not found" },
        { status: 404 }
      );
    }

    participation.status = status;
    await participation.save();

    return NextResponse.json({
      success: true,
      message: `Participation marked as ${status}`,
      data: participation,
    });
  } catch (error) {
    console.error("PATCH /api/admin/participation/[id]/status error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
