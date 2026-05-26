import React, {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import Logo from "@/components/Logo";
import {ALL_MENUS, getActiveConsensus, CONSENSUS_CONFIG, CONSENSUS_ORDER, CONSENSUS_ENTRY, type Consensus} from './Menu';
import Theme from "@/layout/components/Theme";
import {FiBook} from 'react-icons/fi';

interface HeaderProps {
    hideLogo?: boolean;
}

export default function Header({hideLogo}: HeaderProps): React.ReactElement {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
        if (typeof window === 'undefined') return 'system';
        return (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system';
    });

    const [systemDark, setSystemDark] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [currentPathname, setCurrentPathname] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        setCurrentPathname(router.pathname);
    }, [router.pathname]);

    useEffect(() => {
        setMobileOpen(false);
    }, [currentPathname]);

    const isDarkMode = isMounted ? (theme === 'dark' || (theme === 'system' && systemDark)) : null;

    const themeRef = useRef(theme);
    themeRef.current = theme;

    useEffect(() => {
        if (typeof window === 'undefined' || !isMounted) return;
        const root = document.documentElement;
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const isDark = theme === 'dark' || (theme === 'system' && mq.matches);
        root.classList.toggle('dark', isDark);
        localStorage.setItem('theme', theme);
    }, [theme, systemDark, isMounted]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        setSystemDark(mq.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setSystemDark(e.matches);
            if (themeRef.current === 'system') {
                document.documentElement.classList.toggle('dark', e.matches);
            }
        };

        if (mq.addEventListener) {
            mq.addEventListener('change', handleChange);
            return () => mq.removeEventListener('change', handleChange);
        } else {
            mq.addListener(handleChange);
            return () => mq.removeListener(handleChange);
        }
    }, []);

    const consensus = isMounted ? getActiveConsensus(currentPathname) : 'POW';
    const mobileMenuItems = ALL_MENUS[consensus];
    const mobileCfg = CONSENSUS_CONFIG[consensus];

    return (
        <header
            className="fixed top-0 right-0 left-0 md:left-64 z-40 border-b border-gray-100/80 dark:border-[#1c1e25] bg-white/70 dark:bg-[#0d0e12]/80 backdrop-blur-xl transition-colors duration-500">
            <div
                className="px-4 lg:px-8 w-full relative flex justify-between items-center h-16">
                <div className={`flex items-center flex-1${hideLogo ? ' md:hidden' : ''}`}>
                    <Logo/>
                </div>
                <div className="flex items-center space-x-1 md:space-x-2 ml-auto">
                    <Link
                        href="/docs"
                        className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all hover:scale-105 active:scale-95 ${
                            currentPathname.startsWith('/docs')
                                ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-500/10 ring-1 ring-blue-100 dark:ring-blue-500/20 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/10'
                        }`}
                    >
                        <FiBook className="w-4 h-4"/>
                        文档中心
                    </Link>
                    <Theme
                        theme={theme}
                        setTheme={setTheme}
                        isDarkMode={isDarkMode}
                    />
                    <button
                        className="md:hidden p-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 transition-all active:scale-90"
                        onClick={() => setMobileOpen(v => !v)}
                        aria-label={mobileOpen ? '关闭菜单' : '打开菜单'}
                        aria-expanded={mobileOpen}
                    >
                        {mobileOpen ? (
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {mobileOpen && isMounted && (
                <div className="md:hidden border-t border-gray-100 dark:border-[#1c1e25] bg-white/95 dark:bg-[#0d0e12]/98 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-300 animate-in slide-in-from-top-2">
                    <div className="px-4 py-4 space-y-3">
                        <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-3 dark:border-white/5 dark:bg-white/[0.02]">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2.5 px-1">切换宇宙</p>
                            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                {CONSENSUS_ORDER.map((c: Consensus) => {
                                    const cc = CONSENSUS_CONFIG[c];
                                    const isActive = c === consensus;
                                    return (
                                        <Link
                                            key={c}
                                            href={CONSENSUS_ENTRY[c]}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex shrink-0 items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                                                isActive
                                                    ? `${cc.switcherActive} bg-white shadow-md ring-1 ring-black/5 dark:bg-[#1a1a1a] dark:ring-white/10 scale-105`
                                                    : 'text-gray-500 bg-white/40 hover:text-gray-900 hover:bg-white dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5'
                                            }`}
                                        >
                                            <span className={`w-2 h-2 rounded-full shrink-0 ${isActive ? cc.dot : 'bg-gray-300 dark:bg-gray-600'}`}/>
                                            {cc.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-2 dark:border-white/5 dark:bg-white/[0.02]">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-2 mb-1.5">探索模块</p>
                            <div className="grid grid-cols-2 gap-1.5">
                                {mobileMenuItems.map(item => {
                                    const isActive = currentPathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                                isActive
                                                    ? `${mobileCfg.accent} bg-white shadow-sm ring-1 ring-black/5 dark:bg-[#1a1a1a] dark:ring-white/10`
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5'
                                            }`}
                                        >
                                            <span className={`flex h-5 w-5 shrink-0 items-center justify-center text-sm ${isActive ? 'opacity-100 scale-110' : 'opacity-40'}`}>
                                                {item.icon}
                                            </span>
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                            <div className="my-2 border-t border-gray-100 dark:border-white/5 mx-2"/>
                            <Link
                                href="/docs"
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-bold transition-all ${
                                    currentPathname.startsWith('/docs')
                                        ? 'text-blue-600 bg-blue-50/80 shadow-sm ring-1 ring-blue-100 dark:bg-blue-500/20 dark:ring-blue-500/20'
                                        : 'text-gray-600 bg-white/40 hover:text-gray-900 hover:bg-white dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5'
                                }`}
                            >
                                <FiBook className="w-4 h-4"/>
                                文档中心
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
