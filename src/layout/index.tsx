import React, {useState} from 'react';
import {useRouter} from 'next/router';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import CoinexSidebar from './components/CoinexSidebar';
import {LayoutProps} from '@/types/layout';

const Layout = ({children, fullWidth}: LayoutProps) => {
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const currentPath = router.pathname;
    const isCoinexRoute = currentPath.startsWith('/coinex');
    const isBlogRoute = currentPath.startsWith('/blog');
    const showSidebar = !fullWidth && !isBlogRoute;
    const contentOffset = showSidebar ? (collapsed ? ' md:pl-14' : ' md:pl-64') : '';

    return (
        <div
            className="flex min-h-screen bg-[#f8fafc] dark:bg-[#060708] text-slate-900 dark:text-gray-100 selection:bg-blue-500/30 selection:text-white transition-colors duration-500">
            {showSidebar && (
                isCoinexRoute
                    ? <CoinexSidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)}/>
                    : <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)}/>
            )}
            <div
                className={`flex flex-col flex-1 min-w-0 transition-all duration-300${contentOffset} bg-gradient-to-br from-white via-transparent to-blue-50/20 dark:from-transparent dark:to-transparent`}>
                <Header hideLogo={showSidebar}/>
                <main className="flex-1 min-w-0">
                    {fullWidth ? (
                        children
                    ) : (
                        <div className="py-6 sm:py-8 lg:py-10">
                            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                                {children}
                            </div>
                        </div>
                    )}
                </main>
                <Footer/>
            </div>
        </div>
    );
};

export default Layout;
