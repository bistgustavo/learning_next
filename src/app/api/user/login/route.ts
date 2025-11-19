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

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({
        message: "User doesn't exist",
        success: false,
      });
    }

    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json({ message: "Invalid Password", success: false });
    }

    //create token data
    const jwtData = {
      id: user._id,
      email: user.email,
    };

    //create token

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = await jwt.sign(jwtData, process.env.JWT_SECRET, {
      expiresIn: parseInt(process.env.JWT_EXPIRY || "3600", 10), // Default to 3600 seconds if undefined
    });

    const response = NextResponse.json({
      message: "Login succesfully",
      success: true,
    });

    response.cookies.set("token", token, { httpOnly: true });

    return response;
  } catch (error) {
    return NextResponse.json({ message: "Error Logging In" }, { status: 400 });
  }
}
