# Whisper

![Whisper Logo](https://res.cloudinary.com/drdgi9qdu/image/upload/v1727289698/SC7XrUHmR5CIgmQ-XWvE5Q-removebg-preview_rso636.png)

Whisper is an innovative AI-integrated anonymous feedback platform that empowers users to receive candid feedback in a secure and confidential environment. With Whisper, users can effortlessly gather insights from peers without compromising their anonymity. This platform is designed to foster open communication, helping individuals and organizations grow by understanding the perspectives of others.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation and Setup](#installation-and-setup)
- [Contact Information](#contact-information)

## Features
- **Anonymous Feedback**: Users can share a link to gather feedback anonymously.
- **AI-Generated Suggestions**: Get insightful suggestions based on the feedback received.
- **Real-Time Updates**: View feedback submissions and insights as they come in.
- **User-Friendly Interface**: Designed for ease of use, ensuring a smooth user experience.
- **Password Management**: Users can change their password if forgotten.
- **Unique Usernames**: Each user has a unique username to ensure proper identification.
- **Feedback Submission**: Users can send feedback directly to the platform.
- **Feedback Management**: Option to switch off Message if users prefer not to receive messages.

## Technologies Used
- **Frontend**: 
  - Next.js
  - React.js
  - TypeScript
  - Tailwind CSS
- **Backend**:
  - Node.js
  - Express.js
  - MongoDB
- **Authentication**:
  - NextAuth
- **UI Components**: 
  - Shadcn
- **AI Integration**: 
  - Gemini API

## Installation and Setup
Follow these steps to set up the Whisper project locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sharifulislamshihan/whisper.git
   cd whisper
   ```
2. **Install Dependencies**: Make sure you have Node.js installed on your machine. Then run:
   ```bash
   npm install
   ```
3. **Create Environment Variables**: Create a `.env.local` file in the root directory and add the following environment variables:
   ```bash
   MONGODB_URI=your_mongodb_uri
   NEXTAUTH_SECRET=your_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. **Run the Development Server**: Start the application by runnin
   ```bash
   npm run dev
   ```
5. **Access the Application**: Open your web browser and visit http://localhost:3000 to see Whisper in action!

6. **Build for Production (optional)**: If you wish to build the application for production, run:
   ```bash
   npm run build
   ```
7. **Start the Production Server:** After building, you can start the production server with:
   ```bash
   npm start
   ```
## Contact Information
For any inquiries, feedback, or collaboration opportunities, feel free to reach out:

- **Email**: [sharifulislamshihan@gmail.com](mailto:sharifulislamshihan@gmail.com)
- **LinkedIn**: [Shariful Islam Shihan](https://www.linkedin.com/in/shariful-islam-shihan/)
- **GitHub**: [yourusername](https://github.com/sharifulislamshihan) 
