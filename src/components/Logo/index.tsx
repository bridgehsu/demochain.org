import React from "react";
import Link from "next/link";
import LogoIcon from "@/components/Icons/LogoIcon";

interface LogoProps {
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
    return (
        <Link
            href="/"
            className={`flex items-center gap-2 whitespace-nowrap overflow-hidden min-w-0 ${className || ""}`}
            onClick={() => {
                if (typeof window !== "undefined") {
                    localStorage.setItem("consensus", "POW");
                    window.dispatchEvent(new Event("consensusChanged"));
                }
            }}
        >
      <span className="shrink-0 inline-flex">
        <LogoIcon />
      </span>
            <span
                className="truncate max-w-[40vw] sm:max-w-[50vw] md:max-w-none text-lg md:text-xl font-semibold tracking-tight leading-none select-none"
                style={{fontFamily: "'Space Grotesk', sans-serif"}}
            >
                <span className="text-gray-800 dark:text-gray-100">Demo</span><span className="text-accent">Chain</span>
            </span>
        </Link>
    );
};

export default Logo;
