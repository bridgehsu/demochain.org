import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import Logo from '@/components/Logo';
import {
    ALL_MENUS,
    getActiveConsensus,
    CONSENSUS_CONFIG,
    CONSENSUS_ORDER,
    type Consensus,
} from './Menu';
import useTheme from './useTheme';
import Theme from '@/layout/components/Theme';
import {FiBook, FiEdit3, FiChevronsLeft, FiChevronsRight, FiChevronRight} from 'react-icons/fi';
import {SECTION_SWITCHER} from '@/utils/section-manifest';

interface HeaderProps {
    hideLogo?: boolean;
    showSidebar?: boolean;
    collapsed: boolean;
    onToggle: () => void;
    themeControls: ReturnType<typeof useTheme>;
}

export default function Header({
    hideLogo,
    showSidebar,
    collapsed,
    onToggle,
    themeControls,
}: HeaderProps): React.ReactElement {
    const [isMounted, setIsMounted] = useState(false);
    const [currentPathname, setCurrentPathname] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileExpanded, setMobileExpanded] = useState<Partial<Record<Consensus, boolean>>>({POW: true});
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        setCurrentPathname(router.pathname);
    }, [router.pathname]);

    useEffect(() => {
        setMobileOpen(false);
    }, [currentPathname]);

    useEffect(() => {
        if (!isMounted) return;
        setMobileExpanded({[getActiveConsensus(currentPathname)]: true});
    }, [currentPathname, isMounted]);

    const isSectionLinkActive = (href: string) => currentPathname.startsWith(href);
    const fixedLeft = showSidebar
        ? (collapsed ? ' left-0 md:left-14' : ' left-0 md:left-56')
        : ' left-0';

    const toggleMobileGroup = (c: Consensus) => {
        setMobileExpanded(prev => (prev[c] ? {} : {[c]: true}));
    };

    return (
        <header
            className={`fixed top-0 right-0 z-40 overflow-visible bg-[color:var(--card-bg)]/90 backdrop-blur-md transition-[left,colors] duration-300${fixedLeft}`}
        >
            {/* 与侧栏 Logo 区同高：h-16 含底边，避免多出 1px */}
            <div className="relative flex h-16 w-full shrink-0 items-center justify-between border-b border-[color:var(--border-color)] px-4 lg:px-8">
                <div className={`flex items-center flex-1${hideLogo ? ' md:hidden' : ''}`}>
                    <Logo/>
                </div>
                {showSidebar && (
                    <button
                        type="button"
                        onClick={onToggle}
                        aria-label={collapsed ? '展开菜单' : '收起菜单'}
                        aria-expanded={!collapsed}
                        title={collapsed ? '展开菜单' : '收起菜单'}
                        className="hidden md:flex items-center justify-center w-10 h-10 shrink-0 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-white/[0.05] transition-colors"
                    >
                        {collapsed ? <FiChevronsRight className="w-5 h-5"/> : <FiChevronsLeft className="w-5 h-5"/>}
                    </button>
                )}
                <div className="flex items-center space-x-1.5 md:space-x-2 ml-auto">
                    {SECTION_SWITCHER.map(section => (
                        <Link
                            key={section.key}
                            href={section.homePath}
                            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                isSectionLinkActive(section.homePath)
                                    ? 'text-[color:var(--accent-color)] bg-[color:var(--accent-soft)]'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                            }`}
                        >
                            <FiBook className="w-4 h-4"/>
                            {section.label}
                        </Link>
                    ))}
                    <Link
                        href="/blog"
                        className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            isSectionLinkActive('/blog')
                                ? 'text-[color:var(--accent-color)] bg-[color:var(--accent-soft)]'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                        }`}
                    >
                        <FiEdit3 className="w-4 h-4"/>
                        博客
                    </Link>
                    <a
                        href="https://t.me/bridgehsu"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Telegram"
                        aria-label="Telegram"
                        className="flex items-center justify-center w-10 h-10 rounded-lg text-[#2AABEE] hover:bg-[#2AABEE]/10 dark:hover:bg-[#2AABEE]/15 transition-colors"
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.493l-3.002-2.21-1.449 1.394c-.16.16-.295.295-.605.295l.216-3.057 5.563-5.027c.242-.215-.053-.334-.376-.12l-6.877 4.33-2.962-.924c-.643-.204-.657-.643.135-.952l11.57-4.46c.536-.196 1.004.17 1.841.748z"/>
                        </svg>
                    </a>
                    <button
                        className="md:hidden p-2.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 transition-all"
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
                    <Theme {...themeControls}/>
                </div>
            </div>

            {mobileOpen && isMounted && (
                <div className="md:hidden max-h-[min(70vh,32rem)] overflow-y-auto border-t border-[color:var(--border-color)] bg-[color:var(--card-bg)]">
                    <div className="px-3 py-3">
                        <nav className="space-y-1">
                            {CONSENSUS_ORDER.map((c: Consensus) => {
                                const cfg = CONSENSUS_CONFIG[c];
                                const isActive = getActiveConsensus(currentPathname) === c;
                                const isExpanded = Boolean(mobileExpanded[c]);
                                const items = ALL_MENUS[c];

                                return (
                                    <div key={c} className={isExpanded ? 'pb-1' : ''}>
                                        <button
                                            type="button"
                                            onClick={() => toggleMobileGroup(c)}
                                            className={`flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-[14px] font-semibold transition-colors ${
                                                isActive
                                                    ? 'bg-gray-100 text-gray-900 dark:bg-white/[0.08] dark:text-white'
                                                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/[0.04]'
                                            }`}
                                        >
                                            <span className="flex-1 text-left">{cfg.label}</span>
                                            <FiChevronRight
                                                className={`h-3.5 w-3.5 text-gray-300 transition-transform ${isExpanded ? 'rotate-90 text-gray-500' : ''}`}
                                            />
                                        </button>
                                        {isExpanded && (
                                            <div className="relative mt-1 ml-3 space-y-0.5 border-l-2 border-gray-100 pl-3 dark:border-white/[0.08]">
                                                {items.map(item => {
                                                    const itemActive = currentPathname === item.href;
                                                    return (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            onClick={() => setMobileOpen(false)}
                                                            className={`relative block rounded-md py-1.5 pl-3 pr-2 text-[13px] ${
                                                                itemActive
                                                                    ? 'bg-[color:var(--accent-soft)] font-medium text-[color:var(--accent-color)]'
                                                                    : 'font-normal text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/[0.04]'
                                                            }`}
                                                        >
                                                            {itemActive && (
                                                                <span
                                                                    className="absolute -left-[15px] top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-[color:var(--accent-color)]"
                                                                    aria-hidden
                                                                />
                                                            )}
                                                            {item.name}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </nav>

                        <div className="my-3 border-t border-gray-100 dark:border-[#303034]"/>

                        <div className="space-y-0.5">
                            {SECTION_SWITCHER.map(section => (
                                <Link
                                    key={section.key}
                                    href={section.homePath}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                                        isSectionLinkActive(section.homePath)
                                            ? 'bg-[color:var(--accent-soft)] font-medium text-[color:var(--accent-color)]'
                                            : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/[0.04]'
                                    }`}
                                >
                                    <FiBook className="w-4 h-4"/>
                                    {section.label}
                                </Link>
                            ))}
                            <Link
                                href="/blog"
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                                    isSectionLinkActive('/blog')
                                        ? 'bg-[color:var(--accent-soft)] font-medium text-[color:var(--accent-color)]'
                                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/[0.04]'
                                }`}
                            >
                                <FiEdit3 className="w-4 h-4"/>
                                博客
                            </Link>
                            <a
                                href="https://t.me/bridgehsu"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[#2AABEE] hover:bg-[#2AABEE]/10"
                            >
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current">
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.493l-3.002-2.21-1.449 1.394c-.16.16-.295.295-.605.295l.216-3.057 5.563-5.027c.242-.215-.053-.334-.376-.12l-6.877 4.33-2.962-.924c-.643-.204-.657-.643.135-.952l11.57-4.46c.536-.196 1.004.17 1.841.748z"/>
                                </svg>
                                Telegram
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
