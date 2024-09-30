'use client';
import { Loader } from "lucide-react";

const LoaderComponent = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            {/* Add animation and styling */}
            <Loader className="animate-spin w-8 h-8 text-purple-600" />
            <span className="ml-2 text-lg">Loading...</span>
        </div>
    );
};

export default LoaderComponent;