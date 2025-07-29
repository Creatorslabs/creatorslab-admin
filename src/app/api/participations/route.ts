import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/authOptions";
import connectDB from "@/lib/connectDB";
import { Participation } from "@/lib/models/Participation";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [participations, total, pending, completed, claimed] =
      await Promise.all([
        Participation.aggregate([
          {
            $addFields: {
              sortOrder: {
                $cond: [{ $eq: ["$status", "pending"] }, 0, 1],
              },
              userObjId: { $toObjectId: "$userId" },
              taskObjId: { $toObjectId: "$taskId" },
            },
          },
          { $sort: { sortOrder: 1, createdAt: 1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: "users",
              localField: "userObjId",
              foreignField: "_id",
              as: "user",
            },
          },
          { $unwind: "$user" },
          {
            $lookup: {
              from: "tasks",
              localField: "taskObjId",
              foreignField: "_id",
              as: "task",
            },
          },
          { $unwind: "$task" },
          {
            $project: {
              _id: 1,
              status: 1,
              proof: 1,
              createdAt: 1,
              userId: {
                _id: "$user._id",
                username: "$user.username",
                image: "$user.image",
              },
              taskId: {
                _id: "$task._id",
                title: "$task.title",
              },
            },
          },
        ]),
        Participation.countDocuments(),
        Participation.countDocuments({ status: "pending" }),
        Participation.countDocuments({ status: "completed" }),
        Participation.countDocuments({ status: "claimed" }),
      ]);

    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        participations,
        stats: {
          totalParticipations: total,
          pending,
          completed,
          claimed,
        },
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
  } catch (err) {
    console.error("GET /api/admin/participations error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
