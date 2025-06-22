import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { Task } from "@/lib/models/Task";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/authOptions";
import { Admin, IAdmin } from "@/lib/models/Admin";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const adminUser = await Admin.findOne({
      email: session.user.email,
    }).lean<IAdmin>();
    if (!adminUser || adminUser.role === "Support") {
      return NextResponse.json(
        { error: "Insufficient role access" },
        { status: 403 }
      );
    }
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const task = await Task.findById(id);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (task.status === "completed") {
      return NextResponse.json(
        { error: "Cannot toggle status of a completed task" },
        { status: 400 }
      );
    }

    // Toggle status
    task.status = task.status === "active" ? "inactive" : "active";

    await task.save();

    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    console.error("Toggle task status error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
