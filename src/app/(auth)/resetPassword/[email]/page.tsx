'use client'

import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiResponse } from "@/customTypes/apiResponse";
import { useParams, useRouter } from "next/navigation";

interface ResetPasswordFormData {
    email: string;
    verifyCode: string;
    newPassword: string;
    confirmPassword: string;
}


const ResetPassword = () => {


    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const params = useParams<{ email: string }>();

    
    
    // Decode the email
    const decodedEmail = decodeURIComponent(params.email);

    console.log("decoded", decodedEmail);

    const { toast } = useToast();
    const router = useRouter();

    // State to manage password visibility NEW PASSWORD
    const [showNewPassword, setShowNewPassword] = useState(false);

    // State to manage password visibility CONFIRM PASSWORD
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const onSubmit = async (data: ResetPasswordFormData) => {
        if (data.newPassword !== data.confirmPassword) {
            toast({
                title: "Password do not match",
                description: "Check Password and Confirm Password",
                variant: "destructive"
            })
            return;
        }

        setLoading(true);

        // success
        try {
            const response = await axios.post<apiResponse>('/api/resetPassword', {
                email: decodedEmail,
                verifyCode: data.verifyCode,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword
            });
            setMessage(response.data.message); // Handle success message
            toast({
                title: "Successful",
                description: response.data.message,
                variant: "default"
            })
            router.replace('/signin')


        } catch (error) {
            const axiosError = error as AxiosError<apiResponse>;
            let errorMessage = axiosError.response?.data.message

            toast({
                title: "Error",
                description: errorMessage || "An error occurred",
                variant: "destructive"
            })
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="flex items-center justify-center h-screen">
            <Card className="w-[350px] border-purple-600">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl font-semibold">Reset Password</CardTitle>
                    <CardDescription className="text-md">Check your email for the password reset code. Once you have it, enter it below and create a new password.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label>Reset Code</Label>
                                <Input {
                                    ...register("verifyCode",
                                        {
                                            required: true,
                                        }
                                    )
                                } placeholder="Reset code" />
                            </div>



                            {/* new Password */}
                            <div className="flex flex-col space-y-1.5">
                                <Label>New Password</Label>
                                <div className="relative">
                                    <Input
                                        {
                                        ...register("newPassword", {
                                            required: true,
                                        })
                                        }
                                        placeholder="New Password"
                                        type={showNewPassword ? "text" : "password"}
                                        className="pr-10" // Add right padding for the button
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-2 flex items-center pr-2"
                                        onClick={() => setShowNewPassword(prev => !prev)} // Toggle password visibility
                                    >
                                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>


                            </div>


                            {/* confirm password */}
                            <div className="flex flex-col space-y-1.5">
                                <Label>Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        {
                                        ...register("confirmPassword", {
                                            required: true,
                                        })
                                        }
                                        placeholder="Confirm Password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="pr-10" // Add right padding for the button
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-2 flex items-center pr-2"
                                        onClick={() => setShowConfirmPassword(prev => !prev)} // Toggle password visibility
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>


                            </div>

                            {/* Submit Button */}
                            <div className="mt-5">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full border border-purple-700 bg-purple-200 hover:bg-purple-300 text-purple-600 font-semibold text-md"
                                >
                                    {loading ? "Resetting..." : "Reset Password"}
                                </Button>
                            </div>


                        </div>
                    </form>
                </CardContent>
            </Card>

        </div >
    );
};

export default ResetPassword;

