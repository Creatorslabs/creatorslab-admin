import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/authOptions";
import connectDB from "@/lib/connectDB";
import { Admin, IAdmin } from "@/lib/models/Admin";
import { Task } from "@/lib/models/Task";
import { Engagement } from "@/lib/models/Engagement";
import { Participation } from "@/lib/models/Participation";

const PAGE_LIMIT = 20;

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(
      searchParams.get("limit") || PAGE_LIMIT.toString(),
      10
    );
    const skip = (page - 1) * limit;

    const [tasks, total, completed, engagements, pending] = await Promise.all([
      Task.find({}).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      Task.countDocuments(),
      Participation.countDocuments({ status: "completed" }),
      Engagement.find({ status: "Active" }).lean(),
      Participation.countDocuments({ status: "pending" }),
    ]);

    const pages = Math.ceil(total / limit);

    // Construct socialPlatforms and engagementOptions
    const uniquePlatforms = new Map<string, string[]>();
    engagements.forEach((engagement) => {
      const platform = engagement.socialPlatform;
      const types = engagement.engagementType || [];

      if (!uniquePlatforms.has(platform)) {
        uniquePlatforms.set(platform, []);
      }

      const current = uniquePlatforms.get(platform) || [];
      uniquePlatforms.set(
        platform,
        Array.from(new Set([...current, ...types]))
      );
    });

    const socialPlatforms = Array.from(uniquePlatforms.keys()).map(
      (platform) => ({
        value: platform,
        label: platform.charAt(0).toUpperCase() + platform.slice(1),
      })
    );

    const engagementOptions: Record<string, string[]> = {};
    uniquePlatforms.forEach((types, platform) => {
      engagementOptions[platform] = types;
    });

    return NextResponse.json({
      success: true,
      data: tasks,
      stats: {
        totalTasks: total,
        completedTasks: completed,
        pendingTasks: pending,
      },
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1,
      },
      socialPlatforms,
      engagementOptions,
    });
  } catch (err) {
    console.error("GET /api/tasks error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
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
