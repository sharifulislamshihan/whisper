import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { userNameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";



//   Schema for validating username query parameter

const userNameQuerySchema = z.object({
    /**
   * Username to search for
   */
    userName: userNameValidation
})

export async function GET(request: Request) {
    // connect DB
    await dbConnect()

    try {
        // search username by using query parameter
        const { searchParams } = new URL(request.url)
        // 
        const queryParam = {
            userName: searchParams.get('userName')
        }

        // validation username with zod
        const result = userNameQuerySchema.safeParse(queryParam);
        // console.log(result);

        // if the username failed to validate it will response error
        if (!result.success) {
            const userNameErrors = result.error.format().userName?._errors || []

            return Response.json(
                {
                    success: false,
                    message: userNameErrors?.length > 0 ? userNameErrors.join(', ')
                        :
                        "Invalid Query parameter",
                },
                {
                    status: 400
                }
            )
        }
        // extracting username data from result
        const { userName } = result.data

        // verifying user if it is exist or not
        const existingVerifiedUser = await UserModel.findOne({ userName, isVerified: true })

        // return response as verified user exist
        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: "username already taken",
                }, { status: 400 }
            )
        }

        // if the username is unique
        return Response.json(
            {
                success: true,
                message: "username is unique",
            }, { status: 400 }
        )

    } catch (error) {
        // failed to check the username uniqueness
        console.error("Error checking username", error);
        return Response.json(
            {
                success: false,
                message: "Error checking username",
            },
            {
                status: 500
            }
        )
    }

}