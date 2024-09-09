import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";



export async function POST(request: Request) {
    await dbConnect();



    try {
        const {userName, email, password} = await request.json()

        

    } catch (error) {
        console.error("Error registering user", error);
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        )

    }
}