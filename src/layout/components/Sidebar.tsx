import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {
    FiChevronRight,
    FiCpu, FiLock, FiUsers, FiKey, FiShield, FiShuffle, FiClock
} from 'react-icons/fi';
import {
    ALL_MENUS,
    CONSENSUS_CONFIG,
    CONSENSUS_ORDER,
    CONSENSUS_ENTRY,
    getActiveConsensus,
    type Consensus
} from './Menu';
import {DOC_NAV} from '@/utils/docs-manifest';
import Logo from '@/components/Logo';
import LogoIcon from '@/components/Icons/LogoIcon';

interface SidebarProps {
    collapsed: boolean;
}

const CONSENSUS_ICONS: Record<Consensus, React.ReactNode> = {
    POW: <FiCpu className="w-4 h-4"/>,
    POS: <FiLock className="w-4 h-4"/>,
    DPOS: <FiUsers className="w-4 h-4"/>,
    POA: <FiKey className="w-4 h-4"/>,
    BFT: <FiShield className="w-4 h-4"/>,
    AVALANCHE: <FiShuffle className="w-4 h-4"/>,
    POH: <FiClock className="w-4 h-4"/>,
};

type NavChild = {href: string; label: string};

export default function Sidebar({collapsed}: SidebarProps): React.ReactElement {
    const router = useRouter();
    const [pathname, setPathname] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const [expanded, setExpanded] = useState<Partial<Record<Consensus, boolean>>>({POW: true});

    useEffect(() => {
        setIsMounted(true);
        setPathname(router.pathname);
    }, [router.pathname]);

    const isDocsMode = pathname.startsWith('/docs');
    const activeConsensus = (() => {
        if (!isMounted) return 'POW' as Consensus;
        if (pathname.startsWith('/docs/')) {
            const seg = pathname.split('/')[2] ?? 'pow';
            const fromDocs: Record<string, Consensus> = {
                pow: 'POW', pos: 'POS', dpos: 'DPOS', poa: 'POA',
                bft: 'BFT', avalanche: 'AVALANCHE', poh: 'POH',
            };
            return fromDocs[seg] ?? 'POW';
        }
        return getActiveConsensus(pathname);
    })();

    useEffect(() => {
        if (!isMounted) return;
        setExpanded({[activeConsensus]: true});
    }, [activeConsensus, isMounted]);

    const toggle = (c: Consensus) => {
        setExpanded(prev => (prev[c] ? {} : {[c]: true}));
    };

    const getChildren = (c: Consensus): NavChild[] => {
        if (isDocsMode) {
            const docGroup = DOC_NAV.find(g => g.consensus === c);
            return docGroup?.items.map(item => ({href: item.href, label: item.title})) ?? [];
        }
        return ALL_MENUS[c].map(item => ({href: item.href, label: item.name}));
    };

    const getGroupHref = (c: Consensus) => {
        if (isDocsMode) {
            return DOC_NAV.find(g => g.consensus === c)?.rootHref ?? CONSENSUS_ENTRY[c];
        }
        return CONSENSUS_ENTRY[c];
    };

    const isGroupActive = (c: Consensus) => {
        if (isDocsMode) {
            const root = DOC_NAV.find(g => g.consensus === c)?.rootHref;
            return root ? pathname.startsWith(root) : false;
        }
        return c === activeConsensus;
    };

    return (
        <aside
            className={`hidden md:flex flex-col shrink-0 fixed left-0 top-0 h-full z-30 border-r border-[color:var(--border-color)] bg-[color:var(--card-bg)]/95 backdrop-blur-md transition-all duration-300 ${collapsed ? 'w-14' : 'w-56'}`}
        >
            <div
                className={`flex h-16 items-center shrink-0 border-b border-[color:var(--border-color)] ${collapsed ? 'justify-center px-2' : 'px-4'}`}
            >
                {collapsed ? <LogoIcon className="w-8 h-8"/> : <Logo/>}
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-3">
                <nav className="px-2 space-y-1">
                    {isMounted && CONSENSUS_ORDER.map(c => {
                        const cfg = CONSENSUS_CONFIG[c];
                        const groupActive = isGroupActive(c);
                        const isExpanded = Boolean(expanded[c]);
                        const children = getChildren(c);
                        const groupHref = getGroupHref(c);

                        if (collapsed) {
                            return (
                                <Link
                                    key={c}
                                    href={groupHref}
                                    title={cfg.label}
                                    className={`flex items-center justify-center w-10 h-10 mx-auto rounded-md transition-colors ${
                                        groupActive
                                            ? 'text-[color:var(--accent-color)] bg-[color:var(--accent-soft)]'
                                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.06] dark:hover:text-white'
                                    }`}
                                >
                                    {CONSENSUS_ICONS[c]}
                                </Link>
                            );
                        }

                        return (
                            <div key={c} className={isExpanded ? 'pb-1' : ''}>
                                {/* 一级：共识分组 */}
                                <button
                                    type="button"
                                    onClick={() => toggle(c)}
                                    className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2.5 text-[14px] transition-colors ${
                                        groupActive
                                            ? 'bg-gray-100 font-semibold text-gray-900 dark:bg-white/[0.08] dark:text-white'
                                            : 'font-semibold text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/[0.04] dark:hover:text-white'
                                    }`}
                                >
                                    <span
                                        className={`shrink-0 ${
                                            groupActive
                                                ? 'text-[color:var(--accent-color)]'
                                                : 'text-gray-400 dark:text-gray-500'
                                        }`}
                                    >
                                        {CONSENSUS_ICONS[c]}
                                    </span>
                                    <span className="flex-1 truncate text-left">{cfg.label}</span>
                                    <FiChevronRight
                                        className={`h-3.5 w-3.5 shrink-0 text-gray-300 transition-transform dark:text-gray-600 ${
                                            isExpanded ? 'rotate-90 text-gray-500 dark:text-gray-400' : ''
                                        }`}
                                    />
                                </button>

                                {/* 二级：页面项，缩进对齐一级文字 */}
                                {isExpanded && children.length > 0 && (
                                    <div className="relative mt-1 ml-[18px] space-y-0.5 border-l-2 border-gray-100 pl-3 dark:border-white/[0.08]">
                                        {children.map(item => {
                                            const isItemActive = pathname === item.href;
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className={`relative block rounded-md py-1.5 pl-3 pr-2 text-[13px] leading-5 transition-colors ${
                                                        isItemActive
                                                            ? 'bg-[color:var(--accent-soft)] font-medium text-[color:var(--accent-color)]'
                                                            : 'font-normal text-gray-500 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.04] dark:hover:text-gray-100'
                                                    }`}
                                                >
                                                    {isItemActive && (
                                                        <span
                                                            className="absolute -left-[15px] top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-[color:var(--accent-color)]"
                                                            aria-hidden
                                                        />
                                                    )}
                                                    {item.label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
