import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    //create hashed token
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgetPasswordToken: hashedToken,
        forgetPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 587,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const mailOptions = {
      from: "bistgaurav024@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email " : "Reset your password",
      html: `<p>Click <a href="${process.env.DOMAIN}/${
        emailType === "VERIFY" ? "verifyemail" : "verifypassword"
      }?token=${hashedToken}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      } or copy the link in your browser. <br> ${process.env.DOMAIN}/${
        emailType === "VERIFY" ? "verifyemail" : "verifypassword"
      }?token=${hashedToken}`,
    };

    const mailResponse = await transport.sendMail(mailOptions);

    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
