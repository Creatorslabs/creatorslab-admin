import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/authOptions";
import connectDB from "@/lib/connectDB";
import { Engagement } from "@/lib/models/Engagement";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  await connectDB();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  try {
    const [engagements, total] = await Promise.all([
      Engagement.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Engagement.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        engagements,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch engagements" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  await connectDB();

  try {
    const body = await req.json();

    const newEngagement = await Engagement.create({
      name: body.name,
      socialPlatform: body.socialPlatform,
      engagementType: body.engagementType,
      status: body.status || "Active",
    });

    return NextResponse.json(
      { success: true, data: newEngagement },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create engagement" },
      { status: 500 }
    );
  }
}
