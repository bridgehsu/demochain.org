import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import {LayoutProps} from '@/types/layout';

export default function Layout({children}: LayoutProps): React.ReactElement {
    return (
        <div
            className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 selection:bg-blue-500/30">
            <Header/>
            <main className="flex-1 py-6 sm:py-8 lg:py-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    {children}
                </div>
            </main>
            <Footer/>
        </div>
    );
}