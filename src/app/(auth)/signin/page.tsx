'use client'
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const SignIn = () => {
    const { toast } = useToast()
    const router = useRouter()

    // zod implementation 
    const { register, handleSubmit } = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: '',
        }
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        });

        if (result?.error) {
            toast({
                title: "Login Failed",
                description: "Incorrect Email or Password",
                variant: "destructive"
            })
        }
        if (result?.url) {
            router.replace('/dashboard')
        }

    }


    return (
        <div className="flex items-center justify-center h-screen">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>Deploy your new project in one-click.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid w-full items-center gap-4">

                            {/* email */}
                            <div className="flex flex-col space-y-1.5">
                                <Label>Email / Username</Label>
                                <Input {
                                    ...register("identifier",
                                        {
                                            required: true,
                                        }
                                    )
                                }
                                    placeholder="Email/Username"
                                />
                            </div>

                            {/* Password */}
                            <div className="flex flex-col space-y-1.5">
                                <Label>Password</Label>
                                <Input {
                                    ...register("password",
                                        {
                                            required: true,
                                        }
                                    )
                                }
                                    placeholder="Password"
                                    type="password"
                                />
                            </div>

                        </div>
                        <div className="mt-5">
                            <Button
                                type="submit"
                                className="w-full"
                            > Sign in
                            </Button>
                        </div>

                    </form>
                </CardContent>

                <div className="text-center mb-10">
                    <p className="text-sm text-gray-500">Already have an account? <Link className="text-blue-600 underline " href='/signup'>Sign Up</Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default SignIn;