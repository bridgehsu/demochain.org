import React, {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import Logo from "@/components/Logo";
import {ALL_MENUS, getActiveConsensus, CONSENSUS_CONFIG, CONSENSUS_ORDER, CONSENSUS_ENTRY, type Consensus} from './Menu';
import Theme from "@/layout/components/Theme";
import {FiBook, FiEdit3, FiChevronsLeft, FiChevronsRight} from 'react-icons/fi';
import {SECTION_SWITCHER} from '@/utils/section-manifest';

interface HeaderProps {
    hideLogo?: boolean;
    showSidebar?: boolean;
    collapsed?: boolean;
    onToggle?: () => void;
}

export default function Header({hideLogo, showSidebar, collapsed, onToggle}: HeaderProps): React.ReactElement {
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
    const isSectionLinkActive = (href: string) => currentPathname.startsWith(href);

    return (
        <header
            className="sticky top-0 z-40 bg-white/75 dark:bg-[#0d0e12]/85 backdrop-blur-xl transition-colors duration-500 [box-shadow:0_1px_0_0_transparent]">
            {/* 渐变底线 */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent dark:via-blue-500/40 pointer-events-none"/>
            <div
                className="px-4 lg:px-8 w-full relative flex justify-between items-center h-16">
                <div className={`flex items-center flex-1${hideLogo ? ' md:hidden' : ''}`}>
                    <Logo/>
                </div>
                {showSidebar && (
                    <button
                        onClick={onToggle}
                        className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg bg-gray-50 dark:bg-white/[0.03] text-gray-400 hover:text-gray-700 dark:hover:text-white transition-all hover:scale-110 border border-gray-100 dark:border-white/[0.05] mr-2"
                        title={collapsed ? '展开菜单' : '收起菜单'}
                    >
                        {collapsed ? <FiChevronsRight className="w-4 h-4"/> : <FiChevronsLeft className="w-4 h-4"/>}
                    </button>
                )}
                <div className="flex items-center space-x-1 md:space-x-2 ml-auto">
                    {SECTION_SWITCHER.map(section => (
                        <Link
                            key={section.key}
                            href={section.homePath}
                            className={`hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
                                isSectionLinkActive(section.homePath)
                                    ? 'text-white bg-gradient-to-r from-blue-500 to-violet-500 shadow-md shadow-blue-500/30 dark:shadow-blue-500/20'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/10'
                            }`}
                        >
                            <FiBook className="w-3.5 h-3.5"/>
                            {section.label}
                        </Link>
                    ))}
                    <Link
                        href="/blog"
                        className={`hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
                            isSectionLinkActive('/blog')
                                ? 'text-white bg-gradient-to-r from-pink-500 to-orange-400 shadow-md shadow-pink-500/30 dark:shadow-pink-500/20'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/10'
                        }`}
                    >
                        <FiEdit3 className="w-3.5 h-3.5"/>
                        博客
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
                            {SECTION_SWITCHER.map(section => (
                                <Link
                                    key={section.key}
                                    href={section.homePath}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-bold transition-all ${
                                        isSectionLinkActive(section.homePath)
                                            ? 'text-white bg-gradient-to-r from-blue-500 to-violet-500 shadow-md shadow-blue-500/25'
                                            : 'text-gray-600 bg-white/40 hover:text-gray-900 hover:bg-white dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5'
                                    }`}
                                >
                                    <FiBook className="w-4 h-4"/>
                                    {section.label}
                                </Link>
                            ))}
                            <Link
                                href="/blog"
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-bold transition-all ${
                                    isSectionLinkActive('/blog')
                                        ? 'text-white bg-gradient-to-r from-pink-500 to-orange-400 shadow-md shadow-pink-500/25'
                                        : 'text-gray-600 bg-white/40 hover:text-gray-900 hover:bg-white dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5'
                                }`}
                            >
                                <FiEdit3 className="w-4 h-4"/>
                                博客
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
