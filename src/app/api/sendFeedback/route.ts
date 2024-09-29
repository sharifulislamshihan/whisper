import nodemailer from 'nodemailer';

export async function POST(request: Request) {


    const { name, email, feedback } = await request.json();
    // console.log("Name: ", name);
    // console.log("email: ", email);
    // console.log("feedback: ", feedback);

    const transporter = nodemailer.createTransport({
        service: 'gmail', // Gmail, Outlook, etc.
        auth: {
            user: process.env.EMAIL, // Your email address
            pass: process.env.EMAIL_PASSWORD, // Your email password
        },
    });

    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: process.env.EMAIL, // Your email for feedback
            subject: 'New Feedback Received for Whisper',
            html: `
                    <div>
                        <h2>🌟 New Feedback Received! for WHISPER 🌟</h2>
                        <p>You have received new feedback from your website: <strong>Whisper</strong></p>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Feedback:</strong> ${feedback}</p>
                        <p>This message was automatically generated. Please do not reply to this email.</p>
                    </div>`,
        });

        return Response.json(
            {
                success: true,
                message: "Feedback sent successfully!"
            }
        );


    } catch (emailError) {
        return Response.json(
            {
                success: false,
                message: "Something went wrong while sending feedback.", emailError
            }
        );

    }

}
