import React from 'react';
import Head from 'next/head';
import {getPageSEO} from '@/utils/seo';

const SITE_DESCRIPTION = 'DemoChain 是面向学习者的区块链共识机制可视化演示平台，支持 PoW、PoS、DPoS、PoA、BFT、Avalanche、PoH 七种共识。';

type SeoImageMetaProps = {
    ogImage?: string;
};

type SeoHeadProps = {
    path: string;
};

const normalizePath = (path: string) => {
    const pathname = path.split('?')[0];
    return pathname === '/' ? '/' : pathname.replace(/\/$/, '');
};

const StructuredDataScript = (): React.ReactElement => {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'DemoChain',
        url: 'https://demochain.org',
        description: SITE_DESCRIPTION,
        inLanguage: 'zh-CN',
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(structuredData),
            }}
        />
    );
};

const SeoImageMeta = ({ogImage}: SeoImageMetaProps) => {
    if (!ogImage) return null;

    return (
        <>
            <meta property="og:image" content={ogImage}/>
            <meta property="og:image:width" content="1200"/>
            <meta property="og:image:height" content="630"/>
            <meta property="og:image:type" content="image/svg+xml"/>
            <meta name="twitter:image" content={ogImage}/>
        </>
    );
};

const SeoHead = ({path}: SeoHeadProps): React.ReactElement => {
    const seo = getPageSEO(normalizePath(path));
    const title = seo.ogTitle || seo.title;
    const description = seo.ogDescription || seo.description;

    return (
        <Head>
            <title>{seo.title}</title>
            <meta name="description" content={seo.description}/>
            {seo.keywords && <meta name="keywords" content={seo.keywords}/>}
            <meta
                name="robots"
                content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
            />
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <meta
                name="theme-color"
                content="#0f1115"
                media="(prefers-color-scheme: dark)"
            />
            <meta
                name="theme-color"
                content="#ffffff"
                media="(prefers-color-scheme: light)"
            />
            <meta property="og:type" content="website"/>
            <meta property="og:site_name" content="DemoChain"/>
            <meta property="og:title" content={title}/>
            <meta property="og:description" content={description}/>
            <meta property="og:url" content={seo.canonical}/>
            <SeoImageMeta ogImage={seo.ogImage}/>
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content={title}/>
            <meta name="twitter:description" content={description}/>
            <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
            {seo.canonical && <link rel="canonical" href={seo.canonical}/>}
            <StructuredDataScript/>
        </Head>
    );
};

export default SeoHead;
