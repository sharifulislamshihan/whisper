import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
  userName: string;
  otp: string;
}

export default function VerificationEmail({ userName, otp }: VerificationEmailProps) {
  return (
    <Html>
    <Head />
    <Preview>Whisper Email Verification</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={coverSection}>
          <Section style={imageSection}>
            <Img
              src="https://res.cloudinary.com/drdgi9qdu/image/upload/v1727289698/SC7XrUHmR5CIgmQ-XWvE5Q-removebg-preview_rso636.png"

              width="400"
              height="200"
              alt="Whisper Logo"
            />
          </Section>
          <Section style={upperSection}>
            <Heading style={h1}>Verify your email address</Heading>
            <Text style={mainText}>
              Hello {userName},
              Thanks for starting the new Whisper account creation process. We
              want to make sure it's really you. Please enter the following
              verification code when prompted. If you don&apos;t want to
              create an account, you can ignore this message.
            </Text>
            <Section style={verificationSection}>
              <Text style={verifyText}>Verification code</Text>

              <Text style={codeText}>{otp}</Text>
              <Text style={validityText}>
                (This code is valid for 10 minutes)
              </Text>
            </Section>
          </Section>
          <Hr />
        </Section>
        <Text style={footerText}>
          This message was produced and distributed by Whisper.
        </Text>
      </Container>
    </Body>
  </Html>
)

}


const main = {
backgroundColor: "#fff",
color: "#f0eded",
};

const container = {
padding: "20px",
margin: "0 auto",
backgroundColor: "#eee",
};

const h1 = {
color: "#333",
fontFamily:
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
fontSize: "20px",
fontWeight: "bold",
marginBottom: "15px",
};


const text = {
color: "#333",
fontFamily:
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
fontSize: "14px",
margin: "24px 0",
};

const imageSection = {
backgroundColor: "#ddcced",
display: "flex",
padding: "20px 0",
alignItems: "center",
justifyContent: "center",
};

const coverSection = { backgroundColor: "#fff" };

const upperSection = { padding: "25px 35px" };

const footerText = {
...text,
fontSize: "12px",
padding: "0 20px",
};

const verifyText = {
...text,
margin: 0,
fontWeight: "bold",
textAlign: "center" as const,
};

const codeText = {
...text,
fontWeight: "bold",
fontSize: "36px",
margin: "10px 0",
textAlign: "center" as const,
};

const validityText = {
...text,
margin: "0px",
textAlign: "center" as const,
};

const verificationSection = {
display: "flex",
alignItems: "center",
justifyContent: "center",
};

const mainText = { ...text, marginBottom: "14px" };
