import { Html, Head, Preview, Body, Container, Section, Heading, Text, Font } from '@react-email/components';
import * as React from 'react';

interface VerificationEmailProps {
    userName: string;
    otp: string;
}

export default function VerificationEmail({ userName, otp }: VerificationEmailProps) {
    return (
        <Html lang="en">
            <Head>
                <style>
                    {`
        /* General Styles */
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
        }
        
        /* Container Styling */
        .container {
          max-width: 600px;
          background-color: #ffffff;
          padding: 24px;
          margin: 0 auto;
          border-radius: 8px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        }

        /* Section Styling */
        .section {
          text-align: center;
        }

        /* Heading Styling */
        .heading {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 16px;
        }

        /* Text Styling */
        .text {
          font-size: 16px;
          color: #4B5563;
          margin-bottom: 16px;
        }

        /* OTP Code Styling */
        .otp-code {
          font-size: 28px;
          font-weight: bold;
          color: #3B82F6;
          letter-spacing: 0.1em;
          margin: 20px 0;
        }

        /* Footer Text Styling */
        .footer-text {
          font-size: 14px;
          color: #6B7280;
          margin-top: 24px;
        }

        /* Responsive Styles */
        @media only screen and (max-width: 600px) {
          .container {
            width: 90%;
            padding: 16px;
          }

          .heading {
            font-size: 20px;
          }

          .text, .footer-text {
            font-size: 14px;
          }

          .otp-code {
            font-size: 24px;
          }
        }
      `}
                </style>
            </Head>
            <Preview>Your OTP Code for Secure Access</Preview> {/* Preview Text */}
            {/* <Font
                fontFamily="Roboto" fallbackFontFamily='Arial'
                webFont={{
                    url: '',
                    format: 'woff2',
                }}
            >
            </Font> */}
            <Body>
                <Container className="container">
                    <Section className="section">
                        <Heading className="heading">Hello {userName},</Heading>
                        <Text className="text">
                            We received a request to access your account using an OTP (One-Time Password).
                        </Text>
                        <Text className="otp-code">{otp}</Text> {/* Display OTP Code */}
                        <Text className="text">
                            Please use this OTP to complete your verification. The code will expire in 10 minutes.
                        </Text>
                        <Text className="text">
                            If you did not request this, please ignore this email or contact our support.
                        </Text>
                        <Text className="footer-text">
                            Thank you,
                            <br />
                            The Whisper Team
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    )

}