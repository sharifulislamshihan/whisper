'use client';


import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const Feedback = () => {
    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Send Feedback</h1>
        
        <form className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Name (optional)</Label>
            <Input id="name" placeholder="Your name" className="bg-white dark:bg-gray-800 border-purple-300 dark:border-purple-700 focus:ring-purple-500 focus:border-purple-500" />
          </div>
          
          <div>
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email (optional)</Label>
            <Input id="email" type="email" placeholder="Your email" className="bg-white dark:bg-gray-800 border-purple-300 dark:border-purple-700 focus:ring-purple-500 focus:border-purple-500" />
          </div>
          
          <div>
            <Label htmlFor="feedback" className="text-gray-700 dark:text-gray-300">Your Feedback</Label>
            <Textarea id="feedback" placeholder="Tell us what you think..." rows={6} className="bg-white dark:bg-gray-800 border-purple-300 dark:border-purple-700 focus:ring-purple-500 focus:border-purple-500" />
          </div>
          
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-600">Submit Feedback</Button>
        </form>
      </div>
    );
};

export default Feedback;