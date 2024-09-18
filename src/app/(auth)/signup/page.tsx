'use client'
import { useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { apiResponse } from "@/customTypes/apiResponse";
import { ToastAction } from "@radix-ui/react-toast";
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

const SignUp = () => {
    const { toast } = useToast()
    const router = useRouter()
    const [userName, setUserName] = useState('')
    const [userNameMessage, setUserNameMessage] = useState('')
    const [isCheckingUserName, setIsCheckingUserName] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    /**
     * using debounce to check username availability
     * it improves performance by no checking it often but it delays when user stopped typing. which cause less request and improve the performance
     */
    const debounced = useDebounceCallback(setUserName, 300)

    // zod implementation 
    const { register, handleSubmit } = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            userName: '',
            email: '',
            password: '',
        }
    })

    useEffect(() => {
        const checkUserNameIsUnique = async () => {
            if (userName) {
                setIsCheckingUserName(true)
                setUserNameMessage('')

                try {
                    // checking if the userName is unique or not
                    const userNameResponse = await axios.get(`/api/checkUniqueUserName?userName=${userName}`)
                    // to store the msg that its unique or not
                    setUserNameMessage(userNameResponse.data.message)
                } catch (error) {
                    const axiosError = error as AxiosError<apiResponse>;
                    setUserNameMessage(
                        axiosError.response?.data.message || 'Error checking username'
                    )
                }
                finally {
                    setIsCheckingUserName(false)
                }
            }
        }
        checkUserNameIsUnique();
    }, [userName])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<apiResponse>('/api/signup', data)

            toast({
                title: "Success!",
                description: response.data.message,
            })
            // direct user to verify the code cause already submit successfully now need to authenticate the user
            router.replace(`/verify/${userName}`)
            setIsSubmitting(false)
        } catch (error) {
            console.error("Error occurred while Signing up. Try Again", error);

            const axiosError = error as AxiosError<apiResponse>;
            let errorMessage = axiosError.response?.data.message
            toast({
                variant: "destructive",
                title: "Signup failed",
                description: "There was a problem with your request.",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
            setIsSubmitting(false)
        }
    }


    return (
        <div className="flex items-center justify-center h-screen">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Join Whisper</CardTitle>
                    <CardDescription>Deploy your new project in one-click.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid w-full items-center gap-4">

                            {/* userName */}
                            <div className="flex flex-col space-y-1.5">
                                <Label>Username</Label>
                                <Input {
                                    ...register("userName",
                                        {
                                            required: true,
                                        }
                                    )
                                } placeholder="@Username"
                                    onChange={(e) => {
                                        // Call the default onChange handler from register
                                        register("userName").onChange(e)
                                        // Call the debounced username check
                                        debounced(e.target.value)
                                    }} />

                                {
                                    isCheckingUserName ?
                                        (<p className="text-gray-500">Checking...</p>)
                                        :
                                        (<p className={`text-sm ${userNameMessage === 'username is unique' ? 'text-green-500' : 'text-red-500'}`}>
                                            {userNameMessage}
                                        </p>)
                                }

                                {
                                    isCheckingUserName
                                }
                            </div>

                            {/* email */}
                            <div className="flex flex-col space-y-1.5">
                                <Label>Email</Label>
                                <Input {
                                    ...register("email",
                                        {
                                            required: true,
                                            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
                                        }
                                    )
                                } placeholder="email@address.com" />
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
                                } placeholder="Password" />
                            </div>

                        </div>
                        <div className="mt-5">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {
                                    isSubmitting ?
                                        (
                                            <div className="flex items-center space-x-1">
                                                <span>Creating</span>
                                                <div className="flex space-x-1">
                                                    <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                                                    <div className="w-1 h-1 bg-white rounded-full animate-bounce delay-200"></div>
                                                    <div className="w-1 h-1 bg-white rounded-full animate-bounce delay-400"></div>
                                                </div>
                                            </div>
                                        )
                                        :
                                        "Create account"
                                }
                            </Button>
                        </div>

                    </form>
                </CardContent>

                <div className="text-center mb-10">
                    <p className="text-sm text-gray-500">Already have an account? <Link className="text-blue-600 underline " href='/signin'>Sign In</Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default SignUp;