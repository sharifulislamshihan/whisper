import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from 'react';

const page = () => {

    const [message, setMessage] = useState('')
    const suggestedMessages = [
        "Great job on the recent project!",
        "I appreciate your hard work.",
        "Here's some constructive feedback..."
    ]


    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Send Anonymous Message</h1>

            <Textarea
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mb-4 bg-white dark:bg-gray-800 border-purple-300 dark:border-purple-700 focus:ring-purple-500 focus:border-purple-500"
                rows={6}
            />

            <div className="flex justify-between items-center mb-6">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-600">Send Message</Button>
                <Button variant="outline" className="bg-purple-100 text-purple-600 border-purple-300 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-700 dark:hover:bg-purple-800">Suggest Message</Button>
            </div>

            <div className="space-y-2 mb-8">
                {suggestedMessages.map((msg, index) => (
                    <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start text-left text-purple-600 hover:text-purple-700 hover:bg-purple-100 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-900"
                        onClick={() => setMessage(msg)}
                    >
                        {msg}
                    </Button>
                ))}
            </div>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                New to Whisper?{' '}
                <Link href="/signup" className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300">
                    Sign up for an account
                </Link>
            </p>
        </div>
    );
};

export default page;