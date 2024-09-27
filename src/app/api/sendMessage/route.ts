import { Message } from './../../../model/user';
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";


export async function POST(request: Request) {
    await dbConnect()

    const { userName, content } = await request.json();

    try {
        const user = await UserModel.findOne({ userName })

        if (!user) {
            return Response.json(
                {
                    success: false,
                    //response message
                    message: "User not found",
                },
                {
                    status: 404
                }
            )
        }

        // is user accepting the messages
        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    //response message
                    message: "User is not accepting messages",
                },
                {
                    status: 200
                }
            )
        }

        const newMessage = { content, createdAt: new Date() }
        // push the anonymous msg to user msg box
        user.messages.push(newMessage as Message)
        await user.save()

        // response for msg sent successfully
        return Response.json(
            {
                success: true,
                //response message
                message: "Message set successfully",
            },
            {
                status: 200
            }
        )


    } catch (error) {
        return Response.json(
            {
                success: false,
                //response message
                message: "Internal server error"
            },
            {
                status: 500
            }
        )
    }
}