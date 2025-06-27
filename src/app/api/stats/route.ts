import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { User } from "@/lib/models/User";
import { Task } from "@/lib/models/Task";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const [totalUsers, verifiedUsers, totalTasks] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({
        "verification.email": true,
        "verification.twitter": true,
        "verification.discord": true,
      }),
      Task.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        verifiedUsers,
        totalTasks,
      },
    });
  } catch (err) {
    console.error("GET /api/stats error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
