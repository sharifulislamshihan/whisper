import Link from "next/link";
import { Button } from "./ui/button";

const HomeBanner = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                Share Your Thoughts, <span className="text-purple-600 dark:text-purple-400">Anonymously</span>
            </h1>
            <p className="mt-3 text-base text-gray-600 dark:text-gray-300 sm:mt-5 sm:text-lg md:mt-5 md:text-xl lg:mx-0 max-w-2xl">
                Whisper provides a safe space for honest feedback and open communication. Express yourself freely and securely.
            </p>
            <div className="mt-5 sm:mt-8">

                <Link href="/dashboard" passHref>
                    <Button size="lg" className="px-8 py-3 text-lg bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-600">
                        Get Started
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default HomeBanner;