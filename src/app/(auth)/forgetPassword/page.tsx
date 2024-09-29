'use client'

import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { apiResponse } from "@/customTypes/apiResponse";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface ForgotPasswordFormData {
    email: string;
}

const ForgetPassword = () => {


    const { register, handleSubmit, reset, formState: { errors } } = useForm<ForgotPasswordFormData>();
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setLoading(true);
        try {
            const response = await axios.post<apiResponse>('/api/forgetPassVerifyCode', data);
            // Handle success message
            toast({
                variant: "default",
                title: response.data.message,
            })
            reset();
            router.replace(`/resetPassword/${data.email}` )

        } catch (error) {
            console.error("Error occurred while Verifying. Try Again", error);

            const axiosError = error as AxiosError<apiResponse>;
            let errorMessage = axiosError.response?.data.message
            toast({
                variant: "destructive",
                title: errorMessage,
                description: "There was a problem with your request.",
            })
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <Card className="w-[350px] border-purple-600">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Forgot Password?</CardTitle>
                    <CardDescription className="text-md">Please provide your email address, and we'll send you a <strong>Reset Code</strong></CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Label>Search Email</Label>
                        <Input
                            type="email"
                            {...register("email", { required: "Email is required" })}
                            placeholder="Enter your email"
                        />

                        <Button
                            type="submit"
                            disabled={loading}
                            className=" mt-5 w-full border border-purple-700 bg-purple-200 hover:bg-purple-300 text-purple-600 font-semibold text-md"
                        >
                            {loading ? "Sending..." : "Send Verification Code"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgetPassword;
