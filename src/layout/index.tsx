import React, {useState} from 'react';
import {useRouter} from 'next/router';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import useTheme from './components/useTheme';
import {LayoutProps} from '@/types/layout';

const Layout = ({children, fullWidth}: LayoutProps) => {
    const router = useRouter();
    const themeControls = useTheme();
    const [collapsed, setCollapsed] = useState(false);
    const currentPath = router.pathname;
    const isBlogRoute = currentPath.startsWith('/blog');
    const showSidebar = !fullWidth && !isBlogRoute;
    const contentOffset = showSidebar ? (collapsed ? ' md:pl-14' : ' md:pl-56') : '';

    return (
        <div
            className="flex min-h-screen bg-[color:var(--bg-primary)] text-[color:var(--text-primary)] selection:bg-brand-400/30 transition-colors duration-500">
            {showSidebar && (
                <Sidebar themeControls={themeControls} collapsed={collapsed} onToggle={() => setCollapsed(v => !v)}/>
            )}
            <div
                className={`flex flex-col flex-1 min-w-0 transition-all duration-300${contentOffset}`}>
                <Header hideLogo={showSidebar} showSidebar={showSidebar} themeControls={themeControls}/>
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
