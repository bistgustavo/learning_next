import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dsConfig/dsConfig";

connect();

export async function GET(request: NextRequest) {
  try {
    console.log("=== /api/user/me called ===");

    // Get user ID from token
    const userId = await getDataFromToken(request);
    console.log("Extracted userId:", userId);

    if (!userId) {
      console.log("No valid userId found, returning 401");
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "No valid token found",
        },
        { status: 401 }
      );
    }

    // Find user
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("User found:", user.email);

    return NextResponse.json({
      success: true,
      message: "User found",
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error: any) {
    console.error("Error in /api/user/me:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
