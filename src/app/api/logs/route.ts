import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/connectDB";
import { Admin } from "@/lib/models/Admin";
import Log from "@/lib/models/Log";
import { authOptions } from "@/lib/utils/authOptions";
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const adminUser = await Admin.findOne({ email: session.user.email });
    if (!adminUser || adminUser.role !== "Super Admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(
      parseInt(searchParams.get("limit") || "20", 10),
      100
    );
    const skip = (page - 1) * limit;

    // Filters
    const query: any = {};

    const level = searchParams.get("level"); // error, warn, info, log
    if (level) query.level = level;

    const env = searchParams.get("env"); // dev, prod
    if (env) query.env = env;

    const search = searchParams.get("search");
    if (search) {
      query.message = { $regex: search, $options: "i" }; // case-insensitive search
    }

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Fetch logs
    const logs = await Log.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Log.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      pagination: {
        total,
        page,
        totalPages,
        limit,
      },
      logs,
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
