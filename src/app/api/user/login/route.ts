// app/api/user/login/route.ts
import { connect } from "@/dsConfig/dsConfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User doesn't exist",
        },
        { status: 404 }
      );
    }

    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        { message: "Invalid password", success: false },
        { status: 401 }
      );
    }

    // Create token
    const tokenData = {
      id: user._id,
      email: user.email,
      username: user.username,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    // Create response
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
      },
    });

    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    console.log("Login: Token set successfully for user:", user.email);

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Error logging in", error: error.message },
      { status: 500 }
    );
  }
}
