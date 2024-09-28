'use client'

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { apiResponse } from "@/customTypes/apiResponse";
import { toast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";


const Page = () => {

    const [username, setUsername] = useState<string | null>(null);
    const [message, setMessage] = useState('')
    const [suggestedMessages, setSuggestedMessages] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false);


    useEffect(() => {
        // Get the full pathname
        const path = window.location.pathname; // e.g., /u/[userName]
        const segments = path.split('/'); // Split the path into segments
        const user = segments[2]; // the username is always at this index
        setUsername(user);
    }, []);




    // Fetch suggested messages when the component mounts
    useEffect(() => {
        fetchSuggestionMessage();
    }, []); // Empty dependency array means this will run once on mount


    // Fetching suggest message
    const fetchSuggestionMessage = async () => {
        setLoading(true)
        try {
            const response = await axios.post<apiResponse>('/api/suggestMessages')

            let suggestMessages = response.data.message;

            // spliting message here
            const suggestions = suggestMessages.split('||').map(s => s.trim());

            // update state
            setSuggestedMessages(suggestions)
            setLoading(false)

        } catch (error) {
            const axiosError = error as AxiosError<apiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || "Error fetching suggested messages. Try again!",
                variant: "destructive"
            })
            setLoading(false)
        }
    }



    // Sending Message
    const sendMessage = async () => {

        // if someone click send messsage without typing anything
        if (!message) {
            toast({
                title: 'Error',
                description: "Message cannot be empty.",
                variant: "destructive"
            });
            return;
        }

        try {
            const response = await axios.post('/api/sendMessage', {
                userName: username,
                content: message
            });

            if (response.data.success) {
                toast({
                    title: 'Success',
                    description: response.data.message,
                    variant: "default"
                });
                // Clear the textarea after sending
                setMessage('');
            } else {
                toast({
                    title: 'Error',
                    description: response.data.message,
                    variant: "destructive"
                });
            }


        } catch (error) {
            const axiosError = error as AxiosError<apiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || "Internal Server Error. Try again!",
                variant: "destructive"
            })
        }
    }

    return (
        <div>
            <div className="max-w-2xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Send Anonymous Message</h1>

                <Textarea
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mb-4 bg-white dark:bg-gray-800 border-purple-300 dark:border-purple-700 focus:ring-purple-500 focus:border-purple-500"
                    rows={6}
                />

                <div className="flex justify-center items-center mb-6">
                    <Button
                        onClick={sendMessage}
                        className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-600">Send Message</Button>

                </div>


                <div className="my-20">
                    <Button
                        onClick={fetchSuggestionMessage}
                        variant="outline"
                        className=" mb-5 bg-purple-100 text-purple-600 border-purple-300 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-700 dark:hover:bg-purple-800">
                        {loading ? 'Loading...' : 'Suggest Message'}
                    </Button>

                    {/* Display suggested messages */}
                    <div className="space-y-2 mb-8">
                        {suggestedMessages.length > 0 ? (
                            suggestedMessages.map((msg, index) => (
                                <button
                                    key={index}
                                    className="w-full justify-start text-left text-purple-600 hover:text-purple-700 hover:bg-purple-100 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-900 px-4 py-2 rounded"
                                    onClick={() => setMessage(msg)}
                                >
                                    {msg}
                                </button>
                            ))
                        )
                            :
                            (
                                <p>No suggestions yet!</p>
                            )

                        }
                    </div>
                </div>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    New to Whisper?{' '}
                    <Link href="/signup" className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300">
                        Sign up for an account
                    </Link>
                </p>
            </div>
        </div>
    );
};





export default Page;