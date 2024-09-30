'use client';


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
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";


const SignIn = () => {
    const [loading, setLoading] = useState(false)
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

    // State to manage password visibility
    const [showPassword, setShowPassword] = useState(false);


     // for title
     useEffect(() => {
        document.title = "SignIn | Whisper";
    }, []);



    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setLoading(true)
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
            <Card className="w-[350px] border-purple-500">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-semibold">Sign In</CardTitle>
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
                                <div className="relative">
                                    <Input
                                        {
                                        ...register("password", {
                                            required: true,
                                        })
                                        }
                                        placeholder="Password"
                                        type={showPassword ? "text" : "password"}
                                        className="pr-10" // Add right padding for the button
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-2 flex items-center pr-2"
                                        onClick={() => setShowPassword(prev => !prev)} // Toggle password visibility
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>


                                {/* forget password */}
                                <Link href='/forgetPassword'>
                                    <p className="text-sm mt-1 hover:text-purple-500 hover:underline hover:font-semibold ">Forget Password?</p>
                                </Link>
                            </div>

                        </div>
                        <div className="mt-5">
                            <Button
                            disabled = {loading}
                                type="submit"
                                className="w-full border border-purple-700 bg-purple-200 hover:bg-purple-300 text-purple-600 font-semibold text-md"
                            > {
                                loading ? 'Signing in...' : 'Sign in'
                            }
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