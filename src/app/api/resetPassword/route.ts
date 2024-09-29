import bcrypt from 'bcryptjs';
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { email, verifyCode, newPassword, confirmPassword } = await request.json();

        // console.log("email :", email);
        // console.log("verifyCode:", verifyCode);
        // console.log("newPassword:", newPassword);
        // console.log("confirmPassword:", confirmPassword);
        

        if (newPassword !== confirmPassword) {
            return Response.json(
                {
                    success: false,
                    message: "Passwords do not match",
                },
                { status: 400 }
            );
        }

        // Find the user by email and verification code
        const user = await UserModel.findOne({ email, verifyCode });

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid verification code",
                },
                { status: 400 }
            );
        }

        // Check if the verification code has expired
        if (user.verifyCodeExpiry < new Date()) {
            return Response.json(
                {
                    success: false,
                    message: "Verification code has expired",
                },
                { status: 400 }
            );
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password and clear verification code
        user.password = hashedPassword;
        await user.save();

        return Response.json(
            {
                success: true,
                message: "Password reset successful. You can now sign in",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error resetting password", error);
        return Response.json(
            {
                success: false,
                message: "Error resetting password",
            },
            { status: 500 }
        );
    }
}