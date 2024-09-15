import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";

export async function POST(request: Request) {
    await dbConnect()

    try {
        // extracting 
        const { userName, code } = await request.json()

        const decodedUserName = decodeURIComponent(userName)

        // check user from db
        const user = await UserModel.findOne(
            {
                userName: decodedUserName
            }
        )

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                {
                    status: 500
                }
            )
        }

        // handling verification code
        // Check the verification code
        const isCodeValid = user.verifyCode === code

        // check is code expired or not
        // Check the verifyCodeExpiry saved in the db must be bigger than today date. otherwise it is expired
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date;

        // if the code is valid and insert verification code in time verifying the user
        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save()

            return Response.json(
                {
                    success: true,
                    message: "Account Verified Successfully",
                },
                {
                    status: 200
                }
            )
        }

        // if the code is expired
        else if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message: "Verification code has expired, please signup again to get a new code",
                },
                {
                    status: 400
                }
            )
        }

        // incorrect verification code
        else {
            return Response.json(
                {
                    success: false,
                    message: "Incorrect Verification code",
                },
                {
                    status: 500
                }
            )
        }
    }
    catch (error) {
        // failed to verify
        console.error("Error verifying user", error);
        return Response.json(
            {
                success: false,
                message: "Error verifying user",
            },
            {
                status: 500
            }
        )
    }

}