import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';


// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Define the model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Define the static prompt
const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me or ngl , and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction, can ask any mysterious question . Avoid repeating the same questions or messages. suggest some meaningful, beautiful message like suggestion, appreciation, compliment or ask social interactive question For example, your output should be structured like this: What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be?|| What's a simple thing that makes you happy?. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.
do not use any "" or ''`;

export async function POST(req: Request) {
  try {
    // Generate content using the model
    const result = await model.generateContent(prompt);

    // Get the message from the result
    const generatedMessage = await result.response.text();

    // Return the generated text as a JSON response
    return NextResponse.json({ message: generatedMessage });


  } catch (error) {
    console.error('Error generating content:', error);

    // Return an error response with a status code and message
    return NextResponse.json({ error: 'Failed to generate content. Please try again later.' }, { status: 500 });
  }
}