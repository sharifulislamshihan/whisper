import { apiResponse } from "@/customTypes/apiResponse";
import { resend } from "@/lib/resend";
import VerificationEmail from "../../emailsTemplate/verificationEmail";

export async function sendVerificationEmail(
    email: string,
    userName: string,
    verifyCode: string,
): Promise<apiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Whisper Verification Code',
            react: VerificationEmail({ userName, otp:verifyCode })

        });

        return { success: true, message: "Verification email sent successfully" };
    } catch (emailError) {
        console.error("Error sending verification email", emailError);
        return { success: false, message: "Failed to sending verification email" };

    }
}