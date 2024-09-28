import nodemailer from "nodemailer";
import { apiResponse } from "@/customTypes/apiResponse";
import VerificationEmail from "../../../emailsTemplate/verificationEmail";



// to create transport
const transporter = nodemailer.createTransport({
    service: 'gmail',  // Use your email provider's SMTP service (for example, Gmail)
    auth: {
        user: process.env.EMAIL,   // Your email (set this in your environment variables)
        pass: process.env.EMAIL_PASSWORD // Your email password (set this in your environment variables)
    }
});

// Function to send the verification email
export async function sendVerificationEmail(
    email: string,
    userName: string,
    verifyCode: string,
): Promise<apiResponse> {
    try {
        // Render the verification email template
        const emailHTML = VerificationEmail({ userName, otp: verifyCode });
        console.log(emailHTML);


        // Send email using Nodemailer
        transporter.sendMail({
            from: process.env.EMAIL, // Sender's email address
            to: email, // Recipient's email address
            subject: 'Whisper Verification Code',
            html: `<h1>Verify your email address</h1>
                   <p>Hello ${userName},</p>
                   <p>Your verification code is: <strong>${verifyCode}</strong></p>
                   <p>(This code is valid for 10 minutes)</p>`, // The HTML content of your email (rendered from your template)
        });

        console.log("Email sent successfully to ", email);

        return { success: true, message: "Verification email sent successfully" };
    } catch (emailError) {
        console.error("Error sending verification email", emailError);
        return { success: false, message: "Failed to send verification email" };
    }
}