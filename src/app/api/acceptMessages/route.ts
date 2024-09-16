import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/user";


// post request
export async function POST(request: Request) {

    await dbConnect();

    // to get logged in user
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User


    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not authenticated",
            },
            {
                status: 401
            }
        )
    }

    const userId = user._id;
    const { acceptMessages } = await request.json()

    try {
        // find the user by id and then update
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "failed to update user status to accept messages",
                },
                {
                    status: 401
                }
            )
        }

        else {
            return Response.json(
                {
                    success: true,
                    message: "Message acceptance status updated successfully",
                    updatedUser,
                },
                {
                    status: 200
                }
            )
        }

    } catch (error) {
        console.log("failed to update user status to accept messages");

        return Response.json(
            {
                success: false,
                message: "failed to update user status to accept messages",
            },
            {
                status: 500
            }
        )
    }

}


// get request
export async function GET(request: Request) {
    await dbConnect()

    // to get logged in user
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User


    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not authenticated",
            },
            {
                status: 401
            }
        )
    }

    const userId = user._id;

    try {
        const findUser = await UserModel.findById(userId)

        if (!findUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                {
                    status: 404
                }
            )
        }

        else {
            return Response.json(
                {
                    success: true,
                    isAcceptingMessages: findUser.isAcceptingMessage,
                },
                {
                    status: 200
                }
            )
        }
    } catch (error) {
        console.log("Message accepting status getting error");

        return Response.json(
            {
                success: false,
                message: "Message accepting status getting error",
            },
            {
                status: 500
            }
        )
    }
}
