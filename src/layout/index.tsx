import React, {useState} from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import {LayoutProps} from '@/types/layout';

export default function Layout({children, fullWidth}: LayoutProps): React.ReactElement {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#060708] text-slate-900 dark:text-gray-100 selection:bg-blue-500/30 selection:text-white transition-colors duration-500">
            {!fullWidth && <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)}/>}
            <div className={`flex flex-col flex-1 min-w-0 transition-all duration-300${!fullWidth ? (collapsed ? ' md:pl-14' : ' md:pl-64') : ''} bg-gradient-to-br from-white via-transparent to-blue-50/20 dark:from-transparent dark:to-transparent`}>
                <Header hideLogo={!fullWidth}/>
                <main className="flex-1 min-w-0">
                    {fullWidth ? children : (
                        <div className="py-6 sm:py-8 lg:py-10">
                            <div className="px-4 sm:px-6 lg:px-8">
                                {children}
                            </div>
                        </div>
                    )}
                </main>
                <Footer/>
            </div>
        </div>
    );
}
