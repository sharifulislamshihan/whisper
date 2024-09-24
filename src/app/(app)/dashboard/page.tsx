'use client'

import { apiResponse } from "@/customTypes/apiResponse";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/user";
import { acceptMessagesSchema } from "@/schemas/acceptMessages";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";


import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { RefreshCw, Trash2, Copy, X } from 'lucide-react'





const Dashboard = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)




    const { toast } = useToast()
    const router = useRouter()
    // extracting session
    const { data: session, status } = useSession()

    // handling deleting message
    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId))
    }

    // Integrate the schema into React Hook Form
    const { register, watch, setValue } = useForm({
        resolver: zodResolver(acceptMessagesSchema)
    })

    // to watch on accept messages field
    const acceptMessages = watch('acceptMessages')

    // fetching accepting message
    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)

        try {
            const response = await axios.get<apiResponse>('/api/acceptMessages')
            setValue('acceptMessages', response.data.isAcceptingMessage)
        } catch (error) {
            const axiosError = error as AxiosError<apiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || "Failed to fetch message settings",
                variant: "destructive"
            })
        } finally {
            setIsSwitchLoading(false)
        }
    }, [setValue, toast])

    // fetch all message
    const fetchAllMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true)
        setIsSwitchLoading(false)

        try {
            const response = await axios.get<apiResponse>('/api/getMessages')
            setMessages(response.data.messages || [])

            if (refresh) {
                toast({
                    title: 'Refreshed Messages',
                    description: "Showing latest Messages"
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<apiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || "Failed to fetch message",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
            setIsSwitchLoading(false)

        }
    }, [setIsLoading, setMessages])



    useEffect(() => {
        if (!session || !session.user) {
            return;
        }
        fetchAcceptMessage()
        fetchAcceptMessage()
    }, [session, setValue, fetchAcceptMessage, fetchAllMessages])



    // handle switch change
    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<apiResponse>('/api/acceptMessages', {
                acceptMessages: !acceptMessages
            })

            setValue('acceptMessages', !acceptMessages)
            toast({
                title: response.data.message,
                description: "Showing latest Messages",
                variant: 'default'
            })

        } catch (error) {
            const axiosError = error as AxiosError<apiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || "Failed to fetch message",
                variant: "destructive"
            })
        }
    }

    // Show a loading state while session status is being determined
    // todo: need to make a ui for loading state
    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    // redirect to signin page if the user is not loggedin
    if (!session || !session.user) {
        return router.replace('/signin')
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Hi John</h1>
            <h2 className="text-xl text-gray-700 dark:text-gray-300 mb-6">John's Dashboard</h2>

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                    <Switch
                        checked={isAcceptingMessages}
                        onCheckedChange={setIsAcceptingMessages}
                        id="accepting-messages"
                    />
                    <label htmlFor="accepting-messages" className="text-sm text-gray-700 dark:text-gray-300">
                        Accepting messages
                    </label>
                </div>
                <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm" className="flex items-center bg-purple-100 text-purple-600 border-purple-300 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-700 dark:hover:bg-purple-800">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center bg-purple-100 text-purple-600 border-purple-300 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-700 dark:hover:bg-purple-800">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                {messages.map((message) => (
                    <Card key={message.id} className="cursor-pointer hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-800" onClick={() => setSelectedMessage(message)}>
                        <CardContent className="flex items-center justify-between p-4">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{message.date}</p>
                                <p className="text-gray-900 dark:text-white">{message.content.substring(0, 50)}...</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(message.id); }} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={selectedMessage !== null} onOpenChange={() => setSelectedMessage(null)}>
                <DialogContent className="bg-white dark:bg-gray-800">
                    <DialogHeader>
                        <DialogTitle className="text-purple-600 dark:text-purple-400">Message Details</DialogTitle>
                    </DialogHeader>
                    {selectedMessage && (
                        <>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{selectedMessage.date}</p>
                            <p className="text-gray-900 dark:text-white">{selectedMessage.content}</p>
                        </>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedMessage(null)} className="bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
                            Close
                        </Button>
                        <Button variant="destructive" onClick={() => handleDelete(selectedMessage.id)} className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600">
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Dashboard;