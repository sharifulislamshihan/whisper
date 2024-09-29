import React from 'react';

const Footer = () => {
    return (
        <footer className=" text-gray-700 py-4 text-center">
            <div className='flex justify-center'>
                <hr className="border-t border-gray-600 w-1/2 mb-4" />
            </div>
            <p className="text-sm">© {new Date().getFullYear()} Whisper. All rights reserved.</p>
        </footer>

    );
};

export default Footer;