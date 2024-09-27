'use client'

import { apiResponse } from "@/customTypes/apiResponse";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/user";
import { acceptMessagesSchema } from "@/schemas/acceptMessages";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";


import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { RefreshCw, Trash2, Copy, X, Loader } from 'lucide-react'
import { User } from "next-auth";





const Dashboard = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const [profileUrl, setProfileUrl] = useState('');
    const [selectedMessage, setSelectedMessage] = useState(null);
    // New state for refresh button loading
    const [refreshLoading, setRefreshLoading] = useState(false);




    const { toast } = useToast()
    const router = useRouter()
    // extracting session
    const { data: session, status } = useSession()


    // Integrate the schema into React Hook Form
    const { register, watch, setValue } = useForm({
        resolver: zodResolver(acceptMessagesSchema)
    })

    // to watch on accept messages field
    const acceptMessages = watch('acceptMessages', true)

    // fetching accepting message
    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)

        try {
            const response = await axios.get<apiResponse>('/api/acceptMessages')
            // setValue('acceptMessages', response.data.isAcceptingMessage)

            if (response.data.success) {
                setValue('acceptMessages', response.data.isAcceptingMessage);
            } else {
                throw new Error(response.data.message);
            }

        } catch (error) {
            const axiosError = error as AxiosError<apiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || "Failed to update message accept status. Try Again!",
                variant: "destructive"
            })
        } finally {
            setIsSwitchLoading(false)
        }
    }, [setValue])



    // fetch all message
    const fetchAllMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true)
        setIsSwitchLoading(false)

        // Set refresh loading state when refresh is clicked
        if (refresh) {
            setRefreshLoading(true);
        }

        try {
            const response = await axios.get<apiResponse>('/api/getMessages')

            // Ensure the response exists and is an array
            const messages = Array.isArray(response.data.message) && response.data.message.length > 0
                ? response.data.message
                : [];
            setMessages(messages)

            // toast while refreshing
            if (refresh) {
                toast({
                    title: 'Refreshed Messages',
                    description: "Showing latest Messages"
                })
            }

            // console.log("response messages", messages);
        } catch (error) {
            const axiosError = error as AxiosError<apiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || "Failed to fetch message",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
            setRefreshLoading(false)
            setIsSwitchLoading(false)

        }
    }, [setIsLoading, setMessages])



    // handle switch change
    const handleSwitchChange = async () => {

        setIsSwitchLoading(true)

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
        } finally {
            setIsSwitchLoading(false)
        }
    }
    //console.log("session", session?.user?.name);


    useEffect(() => {
        if (!session || !session.user) {
            return;
        }
        fetchAcceptMessage();
        fetchAllMessages();
    }, [session, setValue, fetchAcceptMessage, fetchAllMessages])



    // handle delete Message
    const handleDelete = async (id: string) => {
        const session = await getSession(); // Get the session

        if (!session) {
            toast({
                title: 'Not authenticated',
                description: 'You need to log in to delete messages.',
                variant: 'destructive',
            });
            return;
        }

        try {
            const response = await axios.delete(`/api/deleteMessage/${id}`);
            toast({
                title: response.data.message,
            });
            // Update your messages state here if needed
            setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== id));
            setSelectedMessage(null); // Close the dialog after deletion
        } catch (error) {
            toast({
                title: 'Error deleting message',
                description: axiosError.response?.data.message || 'Something went wrong!',
                variant: 'destructive',
            });
        }
    };


    // Extracting Name
    const name = session?.user?.name || "Anonymous";

    // Empty dependency array means this runs once after the initial render
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userName = session?.user?.userName; // Replace with your actual username
            const baseUrl = `${window.location.protocol}//${window.location.host}`;
            const url = `${baseUrl}/u/${userName}`;
            setProfileUrl(url);
        }
    }, [session?.user?.userName]);


    // copy to clipboard function for copying profile url
    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast({
            title: 'Copied',
        })
    }


    // Show a loading state while session status is being determined
    // todo: need to make a ui for loading state
    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center h-screen">
                {/* Add animation and styling */}
                <Loader className="animate-spin w-8 h-8 text-purple-600" />
                <span className="ml-2 text-lg">Loading...</span>
            </div>
        );
    }
    // redirect to signin page if the user is not loggedin
    if (!session || !session.user) {
        return router.replace('/signin')
    }

    console.log("Messages", messages);


    return (
        <div className="max-w-4xl mx-auto px-4 py-8 mt-10">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-5">Hi <span className="text-purple-600">{name}</span> </h1>
            <h2 className="text-2xl text-gray-700 dark:text-gray-300 mb-6">{name}'s Dashboard</h2>

            <div className="flex flex-col space-y-10 mb-6">


                <div className="flex items-center space-x-2">
                    <Switch
                        {...register('acceptMessages')}
                        checked={acceptMessages}
                        onCheckedChange={handleSwitchChange}
                        disabled={isSwitchLoading}
                        id="accepting-messages"
                    />
                    <label htmlFor="accepting-messages" className="text-sm text-gray-700 dark:text-gray-300">
                        Accepting messages: {acceptMessages ? 'On' : 'Off'}
                    </label>
                </div>

                <h3 className="text-gray-700 text-xl font-semibold">Copy Your Unique Link</h3>

                <div className="flex items-center gap-5">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-border w-2/3 p-2 mr-2" />

                    <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        size="sm"
                        className="flex items-center bg-purple-100 text-purple-600 border-purple-300 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-700 dark:hover:bg-purple-800">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                    </Button>

                </div>

                {/* Refresh button */}
                <Button
                    // Trigger refresh and set loading state
                    onClick={() => fetchAllMessages(true)}
                    variant="outline"
                    size="sm"
                    // Disable the button while loading
                    disabled={refreshLoading}
                    className="w-28 items-center bg-purple-100 text-purple-600 border-purple-300 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-700 dark:hover:bg-purple-800">
                    {refreshLoading ? 'Loading...' : (
                        <>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </>
                    )}
                </Button>



            </div>



            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {
                    isLoading ? (
                        <div className="flex items-center justify-center h-screen">
                            {/* Add animation and styling */}
                            <Loader className="animate-spin w-8 h-8 text-purple-600" />
                            <span className="ml-2 text-lg">Loading Messages...</span>
                        </div>
                    )
                        :
                        messages.length > 0 ? (
                            messages.map((message, index) => (
                                <Card key={message.id} className="cursor-pointer hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-800 h-30" onClick={() => setSelectedMessage(message)}>
                                    <CardContent className="flex items-center justify-between p-4">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{new Date(message.createdAt).toLocaleString()}</p>
                                            <p className="text-gray-900 dark:text-white">{message.content.substring(0, 50)}...</p>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(message._id); }} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300
                                    flex items-center">
                                            <Trash2 className=" w-4 h-4" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))
                        )
                            :
                            (
                                <p>No message to show</p>
                            )
                }
            </div>

            <Dialog open={selectedMessage !== null} onOpenChange={() => setSelectedMessage(null)}>
                <DialogContent className="bg-white dark:bg-gray-800">
                    <DialogHeader>
                        <DialogTitle className="text-purple-600 dark:text-purple-400">Message Details</DialogTitle>
                    </DialogHeader>
                    {selectedMessage && (
                        <>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{new Date(selectedMessage?.createdAt).toLocaleString()}</p>
                            <p className="text-gray-900 dark:text-white">{selectedMessage?.content}</p>

                        </>
                    )}
                    <DialogFooter>
                        <Button variant="destructive" onClick={() => handleDelete(selectedMessage._id)} className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600">
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Dashboard;

