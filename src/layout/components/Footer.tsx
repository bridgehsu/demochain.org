import React from "react";
import Logo from "@/components/Logo";

export default function Footer(): React.ReactElement {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            className="mt-8 border-t border-gray-200 dark:border-[#303034] bg-gradient-to-r from-white/60 via-white/30 to-white/10 dark:from-[#19191c]/80 dark:via-[#19191c]/50 dark:to-[#19191c]/20 backdrop-blur"
        >
            <div className="px-4 lg:px-12 max-w-screen-2xl mx-auto py-6">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <Logo/>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            © {currentYear} demochain.org · 区块链演示平台
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <a href="https://x.com/thebridgehsu" target="_blank" rel="noopener noreferrer"
                           className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-50 dark:bg-white/[0.03] text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all hover:scale-110 border border-gray-100 dark:border-white/[0.05]"
                           title="X (Twitter)">
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 fill-current">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                        </a>
                        <a href="https://t.me/bridgehsu" target="_blank" rel="noopener noreferrer"
                           className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-50 dark:bg-white/[0.03] text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all hover:scale-110 border border-gray-100 dark:border-white/[0.05]"
                           title="Telegram">
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 fill-current">
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.493l-3.002-2.21-1.449 1.394c-.16.16-.295.295-.605.295l.216-3.057 5.563-5.027c.242-.215-.053-.334-.376-.12l-6.877 4.33-2.962-.924c-.643-.204-.657-.643.135-.952l11.57-4.46c.536-.196 1.004.17 1.841.748z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
