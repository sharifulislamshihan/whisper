'use client';

import RootLayout from "@/app/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiResponse } from "@/customTypes/apiResponse";
import { useToast } from "@/hooks/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";


const VerifyAccount = ({ }) => {
    const router = useRouter()
    const params = useParams<{ userName: string }>()
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    // zod implementation
    const { register, handleSubmit } = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setLoading(true)
        try {
            const response = await axios.post('/api/verifyCode',
                {
                    userName: params.userName,
                    code: data.code
                }
            );

            // toast if verification done
            toast({
                title: 'Verification successful',
                description: response.data.message
            });
            // redirect to login page
            router.replace('/signin')
        } catch (error) {
            console.error("Error occurred while Verifying. Try Again", error);

            const axiosError = error as AxiosError<apiResponse>;
            let errorMessage = axiosError.response?.data.message
            toast({
                variant: "destructive",
                title: "Verification failed",
                description: "There was a problem with your request.",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <Card className="w-[350px] border-purple-600">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl font-semibold">Verify Your Account</CardTitle>
                    <CardDescription className="text-md">Check your email for <span>
                        verification code</span></CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label>Verification Code</Label>
                                <Input {
                                    ...register("code",
                                        {
                                            required: true,
                                        }
                                    )
                                } placeholder="Verification code" />
                            </div>
                        </div>

                        <div className="mt-5">
                            <Button
                                disabled={loading}
                                className="w-full border border-purple-700 bg-purple-200 hover:bg-purple-300 text-purple-600 font-semibold text-md"
                                type="submit">
                                {loading ? 'Verifying...' : 'Verify Code'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default VerifyAccount;