// Footer.js

import React from 'react';

function Footer () {
    return (
        <footer className="bg-white dark:bg-gray-900">
            <div className="mx-auto w-full max-w-screen-xl">
                
                    {/* Help center Section */}
                    
                {/* Bottom Section */}
                <div className="px-4 py-6 bg-gray-100 dark:bg-gray-700 md:flex md:items-center ">
                    <span className="text-sm text-gray-500 dark:text-gray-300 sm:text-center">© 2024 <a href="/">PSHT Ranting Gondang™</a>. All Rights Reserved.</span>
                    <div className="flex mt-4 sm:justify-center md:mt-0 space-x-5 rtl:space-x-reverse">
                        {/* Add social media icons here */}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
