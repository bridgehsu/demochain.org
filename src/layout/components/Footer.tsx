import React from "react";
import Logo from "@/components/Logo";

const FRIEND_LINKS = [
    {label: 'Sei Agent', href: 'https://seiagent.com'},
    {label: 'BNB Agents', href: 'https://bnbagents.si'},
    {label: 'Sol Agents', href: 'https://solagents.si'},
    {label: 'ETH Agents', href: 'https://ethagents.si'},
    {label: 'Dapp Skills', href: 'https://dappskills.com'},
    {label: 'TGEX', href: 'https://tgex.net'},
    {label: 'ChatTrade', href: 'https://chattrade.org'},
    {label: '8004 Scan', href: 'https://8004scan.si'},
] as const;

export default function Footer(): React.ReactElement {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            className="mt-8 border-t border-[color:var(--border-color)] bg-[color:var(--card-bg)]/70 backdrop-blur"
        >
            <div className="px-4 lg:px-12 max-w-screen-2xl mx-auto py-6 space-y-3">
                <div className="flex items-center justify-center gap-3">
                    <Logo/>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        © {currentYear} demochain.org · 区块链演示平台
                    </p>
                </div>
                <nav
                    aria-label="友情链接"
                    className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs text-gray-500 dark:text-gray-400"
                >
                    {FRIEND_LINKS.map((link, index) => (
                        <React.Fragment key={link.href}>
                            {index > 0 && (
                                <span className="text-gray-300 dark:text-gray-600 select-none" aria-hidden>/</span>
                            )}
                            <a
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={link.href.replace(/^https?:\/\//, '')}
                                className="hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                {link.label}
                            </a>
                        </React.Fragment>
                    ))}
                </nav>
            </div>
        </footer>
    );
}
