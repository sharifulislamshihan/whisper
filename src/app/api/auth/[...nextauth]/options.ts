import { bcrypt } from 'bcryptjs';
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider(
            {
                id: "credentials",
                name: "Credentials",

                credentials: {
                    email: { label: "Email", type: "text", placeholder: "user@domain.com" },
                    password: { label: "Password", type: "password", placeholder: "password" },
                },
                async authorize(credentials: any): Promise<any> {
                    await dbConnect();
                    try {
                        const user = await UserModel.findOne({
                            $or: [
                                { email: credentials.identifier },
                                { userName: credentials.identifier },

                            ]
                        })

                        if (!user) {
                            throw new Error("No user found");
                        }

                        if (!user.isVerified) {
                            throw new Error("User is not verified. Verify Your account First");
                        }
                        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                        if (isPasswordCorrect) {
                            return user;
                        }
                        else {
                            throw new Error("Invalid Password");
                        }

                    } catch (err: any) {
                        throw new Error(err.message);
                    }
                }
            }
        )
    ],

    callbacks: {
        /*
        *take the user and put it into token by creating a object there
        */
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified,
                    token.isAcceptingMessages = user.isAcceptingMessages,
                    token.userName = user.userName
            }
            return token
        },

        /*
        *stored data in token moved to session
        *injected the object
        * we can get the logged in user by using session
        */
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.userName = token.userName
            }
            return session
        },
    },

    pages: {
        signIn: '/signin',
    },

    session: {
        strategy: "jwt"
    },

    secret: process.env.NEXT_AUTH_SECRET,
}