import nodemailer from "nodemailer";
import { apiResponse } from "@/customTypes/apiResponse";



// to create transport
const transporter = nodemailer.createTransport({
    service: 'gmail',  // Use your email provider's SMTP service (for example, Gmail)
    auth: {
        user: process.env.EMAIL,   // Your email (set this in your environment variables)
        pass: process.env.EMAIL_PASSWORD // Your email password (set this in your environment variables)
    }
});

// Function to send the verification email
export async function sendForgetPassVerificationEmail(
    email: string,
    userName: string,
    verifyCode: string,
): Promise<apiResponse> {
    try {
        const emailHTML = `
         <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            background-color: #fff;
            color: #333;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            margin: 0;
            padding: 0;
        }
        .container {
            padding: 20px;
            margin: 0 auto;
            background-color: #eee;
            border-radius: 8px;
            max-width: 600px;
        }
        h1 {
            font-size: 24px;
            margin-bottom: 15px;
        }
        p {
            font-size: 16px;
            line-height: 1.5;
            margin: 16px 0;
        }
        .image-section {
            background-color: #ddcced;
            padding: 20px 0;
            text-align: center; /* Center the image horizontally */
        }
        .verification-section {
            text-align: center;
            margin: 20px 0;
        }
        .code-text {
            font-weight: bold;
            font-size: 36px;
            margin: 10px 0;
        }
        .footer-text {
            font-size: 12px;
            padding: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="image-section">
            <img src="https://res.cloudinary.com/drdgi9qdu/image/upload/v1727289698/SC7XrUHmR5CIgmQ-XWvE5Q-removebg-preview_rso636.png" width="400" height="200" alt="Whisper Logo" />
        </div>
        <h1>Reset Your Password</h1>
        <p>Hello ${userName},</p>
        <p>
            We received a request to reset the password for your Whisper account. Please use the verification code below to complete your request. 
            If you did not request this, you can safely ignore this email and your password will remain unchanged.
        </p>
        <div class="verification-section">
            <p class="verify-text">Verification Code</p>
            <p class="code-text">${verifyCode}</p>
            <p>(This code is valid for 1 hour)</p>
        </div>
        <p class="footer-text">This message was produced and distributed by Whisper.</p>
    </div>
</body>
</html>`;



        // console.log(emailHTML);


        // Send email using Nodemailer
        await transporter.sendMail({
            from: process.env.EMAIL, // Sender's email address
            to: email, // Recipient's email address
            subject: 'Password Reset Code',
            html: emailHTML, // The HTML content of your email (rendered from your template)
        });

        // console.log("Email sent successfully to ", email);

        return { success: true, message: "Verification email sent successfully" };
    } catch (emailError) {
        console.error("Error sending verification email", emailError);
        return { success: false, message: "Failed to send verification email" };
    }
}


// `<h1>Verify your email address</h1>
//                    <p>Hello ${userName},</p>
//                    <p>Your verification code is: <strong>${verifyCode}</strong></p>
//                    <p>(This code is valid for 10 minutes)</p>`