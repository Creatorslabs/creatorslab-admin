import { NextRequest, NextResponse } from "next/server";
import { Admin } from "@/lib/models/Admin";
import connectDB from "@/lib/connectDB";
import { formatDistanceToNow } from "date-fns";
import { hashPassword } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/authOptions";

const rolePermissionsMap: Record<string, string[]> = {
  "Super Admin": [
    "User Management",
    "Task Management",
    "Engagement Management",
    "Analytics View",
    "System Settings",
    "Admin Management",
  ],
  Admin: [
    "User Management",
    "Task Management",
    "Engagement Management",
    "Analytics View",
    "Admin Management",
  ],
  Moderator: ["Task Management", "Engagement Management", "Analytics View"],
  Support: ["User Management"],
};

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  // Check if user is admin
  const adminUser = await Admin.findOne({ email: session.user.email });
  if (!adminUser || adminUser.role !== "Super Admin") {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  try {
    const [admins, total] = await Promise.all([
      Admin.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Admin.countDocuments(),
    ]);

    const metrics = {
      total,
      active: await Admin.countDocuments({ status: "Active" }),
      restricted: await Admin.countDocuments({ status: "Restricted" }),
      banned: await Admin.countDocuments({ status: "Banned" }),
    };

    const pages = Math.ceil(total / limit);
    

    const formattedAdmins = admins.map((admin) => ({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      status: admin.status,
      permissions: admin.permissions,
      createdAt: admin.createdAt,
      lastLogin: admin.lastLogin
        ? formatDistanceToNow(new Date(admin.lastLogin), { addSuffix: true })
        : "Never logged in",
    }));

    return NextResponse.json({
      success: true,
      data: {
        admins: formattedAdmins,
        metrics,
        pagination: {
          page,
          limit,
          total,
          pages,
          hasNext: page < pages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to load admins",
        error: (error as any).message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, role, status = "Active" } = await req.json();

    if (!name || !email || !role) {
      return NextResponse.json(
        { message: "Name, email, and role are required." },
        { status: 400 }
      );
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: "Admin already exists." },
        { status: 400 }
      );
    }

    // const randomPassword = crypto.randomBytes(10).toString('base64url');
    const randomPassword = "Password";
    const hashedPassword = await hashPassword(randomPassword);
    const permissions = rolePermissionsMap[role] || [];

    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role,
      permissions,
      status,
    });

    return NextResponse.json({ message: "Admin created.", admin: newAdmin });
  } catch (error) {
    console.error("Create admin error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
