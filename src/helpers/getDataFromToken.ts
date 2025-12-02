
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function getDataFromToken(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value || "";

    if (!token) {
      console.log("getDataFromToken: No token found in cookies");
      return null;
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    console.log("getDataFromToken: Token valid for user ID:", decoded.id);
    return decoded.id;
  } catch (error: any) {
    console.error("getDataFromToken error:", error.message);
    return null;
  }
}
