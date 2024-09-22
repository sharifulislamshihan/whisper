'use client'

import { apiResponse } from "@/customTypes/apiResponse";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/user";
import { acceptMessagesSchema } from "@/schemas/acceptMessages";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Dashboard = () => {

    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const router = useRouter()


    const { toast } = useToast()

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId))
    }

    const { data: session } = useSession()

    const form = useForm({
        resolver: zodResolver(acceptMessagesSchema)
    })

    const { register, watch, setValue } = form;

    const acceptMessages = watch('acceptMessages')

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)

        try {
            const response = await axios.get<apiResponse>('/api/acceptMessages')
            setValue('acceptMessage', response.data.isAcceptingMessage)
        } catch (error) {
            const axiosError = error as AxiosError<apiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to Fetch Message",
                variant: "destructive",
            })
        }

        finally {
            setIsSwitchLoading(false)
        }
    }, [setValue])


    const fetchAllMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true)
        setIsSwitchLoading(false)
        try {
            const response = await axios.get<apiResponse>('/api/getMessage')
            setMessages(response.data.messages || [])

            if (refresh) {
                toast({
                    title: "Refreshed Message",
                    description: " Showing latest Messages",
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<apiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to Fetch Message",
                variant: "destructive",
            })
        }

        finally {
            setIsLoading(false)
            setIsSwitchLoading(false)
        }
    }, [setIsLoading, setMessages])

    // handle switch change

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<apiResponse>('/api/acceptMessages', {
                acceptMessages: !acceptMessages
            })

            setValue('acceptMessages', !acceptMessages)
            toast({
                title: "Switch Changed",
                description: `Switch is now ${!acceptMessages}`,
            })
        } catch (error) {
            const axiosError = error as AxiosError<apiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to Fetch Message",
                variant: "destructive",
            })
        }

        if(!session || !session.user){
            // redirect to login page
            router.replace('/signin')
        }
    }


    useEffect(() => {
        if (!session || !session.user) {
            return
        }
        fetchAllMessages()
        fetchAcceptMessage()

    }, [session, setValue, fetchAcceptMessage, fetchAllMessages])


    return (
        <div>
            This is Dashboard
        </div>
    );
};

export default Dashboard;