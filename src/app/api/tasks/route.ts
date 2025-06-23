import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/authOptions";
import connectDB from "@/lib/connectDB";
import { Admin, IAdmin } from "@/lib/models/Admin";
import { Task } from "@/lib/models/Task";
import { Participation } from "@/lib/models/Participation";

const PAGE_LIMIT = 20;

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const adminUser = await Admin.findOne({ email: session.user.email })
      .select("role")
      .lean<{ role: string }>();
    if (!adminUser || adminUser.role === "Support") {
      return NextResponse.json({ error: "Insufficient role access" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || PAGE_LIMIT.toString(), 10);
    const skip = (page - 1) * limit;

    const [tasks, total, completed, pending, participations] = await Promise.all([
      Task.find({})
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .select("-__v")
        .populate("creator", "username")
        .lean(),
      Task.countDocuments(),
      Participation.countDocuments({ status: "completed" }),
      Participation.countDocuments({ status: "pending" }),
      Participation.find({})
        .select("taskId userId status proof")
        .lean(),
    ]);

    // Group participations by taskId
    const participationMap: Record<string, typeof participations> = {};
    for (const part of participations) {
      const key = part.taskId.toString();
      if (!participationMap[key]) participationMap[key] = [];
      participationMap[key].push(part);
    }

    // Add participants to each task
    const taskRemap = tasks.map((task) => ({
      ...task,
      creator: task.creator?.username || "Unknown",
      participants: participationMap[(task._id as string).toString()] || [],
    }));

    return NextResponse.json({
      success: true,
      data: taskRemap,
      stats: {
        totalTasks: total,
        completedTasks: completed,
        pendingTasks: pending,
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
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

    const body = await request.json();

    const taskData = {
      ...body,
      creator: adminUser._id,
      image:
        body.image || "https://source.unsplash.com/random/800x600?productivity", // fallback image
    };

    const newTask = await Task.create(taskData);

    return NextResponse.json({ success: true, data: newTask }, { status: 201 });
  } catch (err) {
    console.error("POST /api/tasks error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
