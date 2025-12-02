import { NextResponse } from "next/server";
import { sendEmail } from "@/helpers/mailer";

export async function POST(req: Request) {
  try {
    const { email, userId } = await req.json();

    const res = await sendEmail({
      email,
      emailType: "RESET",
      userId,
    });

    return NextResponse.json({
      success: true,
      message: "Reset email sent",
      data: res,
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e.message },
      { status: 500 }
    );
  }
}
