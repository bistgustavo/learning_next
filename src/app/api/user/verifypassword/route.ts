import { connect } from "@/dsConfig/dsConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;

    const user = await User.findOne({
      forgetPasswordToken: token,
      forgetPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({
        message: "User doesn't exist",
        success: false,
      });
    }

    if (user.isVerified) {
      user.forgetPasswordToken = undefined;
      user.forgetPasswordTokenExpiry = undefined;
    }

    return NextResponse.json({
      message: "Reset Password Verified",
      success: true,
    });
  } catch (error: any) {
    NextResponse.json(
      { error: "Something went wrong while verifying the token" },
      { status: 500 }
    );
  }
}
