import React, {useState} from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import useTheme from './components/useTheme';
import {LayoutProps} from '@/types/layout';

const Layout = ({children, fullWidth}: LayoutProps) => {
    const themeControls = useTheme();
    const [collapsed, setCollapsed] = useState(false);
    const showSidebar = !fullWidth;
    const contentOffset = showSidebar ? (collapsed ? ' md:pl-14' : ' md:pl-56') : '';

    return (
        <div
            className="relative flex min-h-screen bg-[color:var(--bg-primary)] text-[color:var(--text-primary)] selection:bg-brand-400/30 transition-colors duration-500"
        >
            {/* Web3 氛围：顶部青晕 + 淡网格，不抢内容 */}
            <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                <div
                    className="absolute -top-32 left-1/2 h-[28rem] w-[48rem] -translate-x-1/2 rounded-full opacity-80 blur-3xl dark:opacity-100"
                    style={{
                        background:
                            'radial-gradient(ellipse at center, color-mix(in srgb, var(--accent-color) 28%, transparent) 0%, transparent 70%)',
                    }}
                />
                <div
                    className="absolute -top-10 right-[-10%] h-64 w-64 rounded-full opacity-50 blur-3xl dark:opacity-70"
                    style={{
                        background:
                            'radial-gradient(circle, color-mix(in srgb, var(--accent-secondary) 18%, transparent) 0%, transparent 70%)',
                    }}
                />
                <div
                    className="absolute inset-0 opacity-40 dark:opacity-50"
                    style={{
                        backgroundImage:
                            'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                        maskImage: 'radial-gradient(ellipse at 50% 0%, black 20%, transparent 75%)',
                        WebkitMaskImage: 'radial-gradient(ellipse at 50% 0%, black 20%, transparent 75%)',
                    }}
                />
            </div>
            {showSidebar && (
                <Sidebar collapsed={collapsed}/>
            )}
            <div
                className={`relative z-10 flex flex-col flex-1 min-w-0 transition-all duration-300${contentOffset}`}>
                <Header hideLogo={showSidebar} showSidebar={showSidebar} collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} themeControls={themeControls}/>
                {/* 顶栏 fixed 后占位，避免内容被挡住 */}
                <div className="h-16 shrink-0" aria-hidden="true"/>
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
