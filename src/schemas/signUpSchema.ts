import { z } from "zod";

export const userNameValidation = z
    .string()
    .min(2, "Username must be atleast 2 characters")
    .max(20, "Username must be not more than 20 characters")
    .regex(/^[a-zA-Z0-9]{2,20}$/, "Username must not contain special character")


export const signUpSchema = z.object({
    name: z.string(),
    userName: userNameValidation,
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be atleast 6 characters"),
})
