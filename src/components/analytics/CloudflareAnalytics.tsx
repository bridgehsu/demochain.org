import React from 'react';
import Script from 'next/script';

/**
 * Cloudflare Web Analytics（仅 JS beacon，不依赖把域名接入 Cloudflare DNS）。
 * 构建时注入 NEXT_PUBLIC_CF_BEACON_TOKEN；未配置则不加载脚本。
 */
const CloudflareAnalytics = (): React.ReactElement | null => {
    const token = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN?.trim();

    if (!token) {
        return null;
    }

    return (
        <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            strategy="afterInteractive"
            defer
            data-cf-beacon={JSON.stringify({token})}
        />
    );
};

export default CloudflareAnalytics;
