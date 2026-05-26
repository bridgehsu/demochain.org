import React from "react";
import Logo from "@/components/Logo";

export default function Footer(): React.ReactElement {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            className="mt-8 border-t border-gray-200 dark:border-[#1c1e25] bg-gradient-to-r from-white/60 via-white/30 to-white/10 dark:from-[#0d0e12]/80 dark:via-[#0d0e12]/50 dark:to-[#0d0e12]/20 backdrop-blur"
        >
            <div className="px-4 lg:px-12 max-w-screen-2xl mx-auto py-6">
                <div className="flex items-center justify-center gap-3 w-full">
                    <Logo/>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        © {currentYear} demochain.org · 区块链演示平台
                    </p>
                </div>
            </div>
        </footer>
    );
}
