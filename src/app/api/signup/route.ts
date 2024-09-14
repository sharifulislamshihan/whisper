import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs"



export async function POST(request: Request) {
    await dbConnect();



    try {
        const { userName, email, password } = await request.json()

        // checking there any user which is verified by username
        const existingUserVerifiedByUserName = await UserModel.findOne({
            userName,
            isVerified: true,
        })
        // if username is found
        if (existingUserVerifiedByUserName) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 })
        }

        const existingUserByEmail = await UserModel.findOne({ email });

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUserByEmail) {
            // if user is exist and verified
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already Exist"
                }, { status: 400 })
            }
            // if there is user but not verified
            else{
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        }

        // register the user. cause it is a new user
        else {
            const hashedPassword = await bcrypt.hash(password, 10)

            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                userName,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            })
            const savedUser = await newUser.save();
            console.log("New saved user", savedUser);
            
        }

        // sending Verification email

        const emailResponse = await sendVerificationEmail(
            email,
            userName,
            verifyCode,
        )

        // if email is not sent successfully
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }


        // register the user. and requesting for verify email
        return Response.json({
            success: true,
            message: "User registered successfully. Please verify your email"
        }, { status: 201 })

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