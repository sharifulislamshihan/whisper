'use client';


import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from 'sweetalert2'
import Head from "next/head";


// Define the form data interface
interface FeedbackFormData {
  name?: string;
  email?: string;
  feedback: string;
}


const Feedback = () => {

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FeedbackFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // for title
  useEffect(() => {
    document.title = "Feedback | Whisper";
  }, []);

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/sendFeedback', data);
      if (response.status === 200) {
        Swal.fire('Thank you for your feedback! Whisper will reach you soon.');
        reset(); // Reset the form fields
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong. Please try again later.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Error submitting feedback. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <Head>
        <title>Feedback - Whisper</title>
        <meta name="description" content="User feedback page" />
      </Head>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center p-5">
          <h2 className="text-2xl text-gray-800 font-bold mb-4">🌟 We Value Your Thoughts! 🌟</h2>
          <p className="text-lg text-gray-600">
            If you encounter any issues or have suggestions for improvement, we’d love to hear from you!
            Share your feedback and let us know how Whisper makes you feel.
            Remember, <strong className="font-semibold text-purple-500">Whisper is listening!</strong> 💬✨
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Name Field */}
          <div>
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Name (optional)</Label>
            <Input
              id="name"
              placeholder="Your name"
              {...register('name')}
              className="bg-white dark:bg-gray-800 border-purple-300 dark:border-purple-700 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Email Field */}
          <div>
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="Your email"
              {...register('email', {
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  message: 'Invalid email address',
                },
              })}
              className="bg-white dark:bg-gray-800 border-purple-300 dark:border-purple-700 focus:ring-purple-500 focus:border-purple-500"
            />
            {/* {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>} */}
          </div>

          {/* Feedback Field */}
          <div>
            <Label htmlFor="feedback" className="text-gray-700 dark:text-gray-300">Your Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="Tell us what you think..."
              rows={6}
              {...register('feedback', { required: 'Feedback is required' })}
              className="bg-white dark:bg-gray-800 border-purple-300 dark:border-purple-700 focus:ring-purple-500 focus:border-purple-500"
            />
            {/* {errors.feedback && <p className="text-red-500 text-sm">{errors.feedback.message}</p>} */}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>

          {/* Success/Failure Message */}
          {/* {message && <p className="text-center text-sm mt-4 text-gray-600">{message}</p>} */}
        </form>
      </div>
    </>
  );
};

export default Feedback;