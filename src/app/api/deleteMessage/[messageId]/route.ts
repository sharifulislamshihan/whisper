import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/user";

export async function DELETE(request: Request, { params }: { params: { messageId: string } }) {

    // extracting selected message ID
    const messageId = params.messageId



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

    try {
        const updateResult = await UserModel.updateOne(
            // find the user which is logged In
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        )

        // if the nothing updated
        if (updateResult.modifiedCount == 0) {
            return Response.json(
                {
                    success: false,
                    message: "Message not found or Its already deleted",
                },
                {
                    status: 404
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Message deleted successfully",
            },
            {
                status: 401
            }
        )
    } catch (error) {
        console.error("Error while deleting message", error);
        
        return Response.json(
            {
                success: false,
                message: "Error deleting message",
            },
            {
                status: 500
            }
        )
    }

}