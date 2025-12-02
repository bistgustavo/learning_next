import { connect } from "@/dsConfig/dsConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    const { password, userId } = reqBody;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = User.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });

    return NextResponse.json({
      message: "Password changed successfully",
      success: true,
    });
  } catch (error: any) {
    NextResponse.json(
      { error: "Something went wrong while changing the password" },
      { status: 500 }
    );
  }
}
