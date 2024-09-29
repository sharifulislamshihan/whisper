import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/user";
import mongoose from "mongoose";

export async function GET(request: Request) {

    await dbConnect();

    // to get logged in user
    const session = await getServerSession(authOptions)
    // console.log("session", session);

    const user: User = session?.user as User

    //console.log("User Id", user);


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

    // user._id stored as a string so converted into mongoose objectId and stored it in userId
    const userId = new mongoose.Types.ObjectId(user._id)
    // console.log("User Id", userId);



    try {
        const user = await UserModel.aggregate([

            // match the id which is logged in
            { $match: { _id: userId } },

            // it will turn messages array into multiple object. single object for single array element
            { $unwind: { path: '$messages', preserveNullAndEmptyArrays: true } },

            // sort the messages depends on created time
            { $sort: { 'messages.createdAt': -1 } },

            // after the sorting the all the messages pushed into in na "message object" must be ensuring that all the messages have the same id
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ])
        // console.log("User", user);

        if (!user || user.length === 0) {
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
                    //response message
                    message: user[0].messages,

                },
                {
                    status: 200
                }
            )

        }
    } catch (error) {
        return Response.json(
            {
                success: false,
                //response message
                message: "An unexpected Error occurred"
            },
            {
                status: 500
            }
        )
    }
}