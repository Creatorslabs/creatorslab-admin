import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/authOptions";
import connectDB from "@/lib/connectDB";
import { Admin } from "@/lib/models/Admin";
import { Task } from "@/lib/models/Task";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const adminUser = await Admin.findOne({ email: session.user.email });
    if (!adminUser || adminUser.role === "Support") {
      return NextResponse.json(
        { error: "Insufficient role access" },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const body = await req.json();
    const updatedTask = await Task.findByIdAndUpdate(id, body, { new: true });

    if (!updatedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedTask });
  } catch (err) {
    console.error("PUT /api/tasks/:id error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const adminUser = await Admin.findOne({ email: session.user.email });
    if (!adminUser || adminUser.role === "Support") {
      return NextResponse.json(
        { error: "Insufficient role access" },
        { status: 403 }
      );
    }
    const { id } = await context.params;

    const deleted = await Task.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Task deleted" });
  } catch (err) {
    console.error("DELETE /api/tasks/:id error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
