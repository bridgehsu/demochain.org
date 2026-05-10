import React, {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import Logo from "@/components/Logo";
import Menu, {MENUS, ALL_MENUS, getActiveConsensus, CONSENSUS_CONFIG, CONSENSUS_ORDER, CONSENSUS_ENTRY, type Consensus} from './Menu';
import Theme from "@/layout/components/Theme";
import {FiBook} from 'react-icons/fi';

export default function Header(): React.ReactElement {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
        if (typeof window === 'undefined') return 'system';
        return (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system';
    });

    const [systemDark, setSystemDark] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [currentPathname, setCurrentPathname] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);

    const router = useRouter();

    const menuItems = MENUS;

    useEffect(() => {
        setIsMounted(true);
        setCurrentPathname(router.pathname);
    }, [router.pathname]);

    useEffect(() => {
        setMobileOpen(false);
    }, [currentPathname]);

    const isDarkMode = isMounted ? (theme === 'dark' || (theme === 'system' && systemDark)) : null;

    // 用 ref 存最新 theme，供系统主题变化的监听器读取，避免 stale closure
    const themeRef = useRef(theme);
    themeRef.current = theme;

    // 应用主题（class + localStorage），在 theme 或 systemDark 变化时触发
    useEffect(() => {
        if (typeof window === 'undefined' || !isMounted) return;
        const root = document.documentElement;
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const isDark = theme === 'dark' || (theme === 'system' && mq.matches);
        root.classList.toggle('dark', isDark);
        localStorage.setItem('theme', theme);
    }, [theme, systemDark, isMounted]);

    // 系统主题变化监听器 — 只注册一次
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
            className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75 dark:border-gray-800 dark:bg-[#121212]/85">
            <div
                className="px-4 lg:px-12 max-w-screen-2xl mx-auto w-full relative flex justify-between items-center py-4">
                <div className="flex items-center flex-1">
                    <Logo/>
                    <div className="hidden md:flex flex-1 justify-end mr-6">
                        {isMounted && (
                            <Menu
                                currentPathname={currentPathname}
                                menuItems={menuItems}
                            />
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-1 md:space-x-2">
                    {/* 文档入口 — 桌面端 */}
                    <Link
                        href="/docs"
                        className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            currentPathname.startsWith('/docs')
                                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/8'
                        }`}
                    >
                        <FiBook className="w-4 h-4"/>
                        文档
                    </Link>
                    <Theme
                        theme={theme}
                        setTheme={setTheme}
                        isDarkMode={isDarkMode}
                    />
                    {/* 汉堡按钮 — 仅手机端显示 */}
                    <button
                        className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-black/5 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/8 transition-colors"
                        onClick={() => setMobileOpen(v => !v)}
                        aria-label={mobileOpen ? '关闭菜单' : '打开菜单'}
                        aria-expanded={mobileOpen}
                    >
                        {mobileOpen ? (
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* 移动端下拉导航面板 */}
            {mobileOpen && isMounted && (
                <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-[#121212]/95 backdrop-blur shadow-lg shadow-black/5">
                    <div className="px-3 py-3 space-y-2">
                        {/* 共识切换 */}
                        <div className="rounded-xl border border-gray-100 bg-gray-50/80 px-3 py-2.5 dark:border-gray-800 dark:bg-white/[0.03]">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">切换共识</p>
                            <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
                                {CONSENSUS_ORDER.map((c: Consensus) => {
                                    const cc = CONSENSUS_CONFIG[c];
                                    const isActive = c === consensus;
                                    return (
                                        <Link
                                            key={c}
                                            href={CONSENSUS_ENTRY[c]}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                                isActive
                                                    ? `${cc.switcherActive} bg-white shadow-sm ring-1 ring-black/5 dark:bg-[#1d1d1d] dark:ring-white/10`
                                                    : 'text-gray-500 hover:text-gray-900 hover:bg-white/70 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/8'
                                            }`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? cc.dot : 'bg-gray-300 dark:bg-gray-600'}`}/>
                                            {cc.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 当前共识的页面导航 + 文档入口，合并在一个卡片 */}
                        <div className="rounded-xl border border-gray-100 bg-gray-50/80 px-2 py-1.5 dark:border-gray-800 dark:bg-white/[0.03]">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-1 mb-1">页面导航</p>
                            <div className="space-y-0.5">
                                {mobileMenuItems.map(item => {
                                    const isActive = currentPathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all ${
                                                isActive
                                                    ? `${mobileCfg.accent} bg-white shadow-sm ring-1 ring-black/5 dark:bg-[#1d1d1d] dark:ring-white/10`
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/70 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/8'
                                            }`}
                                        >
                                            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                                                {item.icon}
                                            </span>
                                            {item.name}
                                        </Link>
                                    );
                                })}
                                <div className="my-1 border-t border-gray-100 dark:border-gray-800"/>
                                <Link
                                    href="/docs"
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all ${
                                        currentPathname.startsWith('/docs')
                                            ? 'text-blue-600 dark:text-blue-400 bg-white shadow-sm ring-1 ring-black/5 dark:bg-blue-500/10 dark:ring-white/10'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-white/70 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/8'
                                    }`}
                                >
                                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs ${currentPathname.startsWith('/docs') ? 'opacity-100' : 'opacity-50'}`}>
                                        <FiBook className="w-3.5 h-3.5"/>
                                    </span>
                                    文档中心
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
