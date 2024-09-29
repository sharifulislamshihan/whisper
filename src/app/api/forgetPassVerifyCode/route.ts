import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { sendVerificationEmail } from "../sendVerificationEmail";
import bcrypt from "bcryptjs";
import { sendForgetPassVerificationEmail } from "../sendForgetPassVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { email } = await request.json();

        // Find the user by email
        const user = await UserModel.findOne({
            email,
            isVerified: true,
        });

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "No user found with this email",
                },
                { status: 400 }
            );
        }
        // Generate a new verification code
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1); // 1 hour expiry

        // Update the user's verification code and expiry
        user.verifyCode = verifyCode;
        user.verifyCodeExpiry = expiryDate;
        await user.save();

        // Send verification code via email
        const emailResponse = await sendForgetPassVerificationEmail(email, user.userName, verifyCode);

        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: "Failed to send verification email",
                },
                { status: 500 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Verification code sent to your email",
            },
            {
                status: 200
            }
        );
    } catch (error) {
        console.error("Error sending forgot password email", error);
        return Response.json(
            {
                success: false,
                message: "Error occurred during password reset",
            },
            { status: 500 }
        )
    }
}
