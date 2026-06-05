import React, {useEffect, useState} from 'react';
import {AppProps} from 'next/app';
import {useRouter} from 'next/router';
import Head from 'next/head';
import Layout from '@/layout';
import DocsLayout from '@/layout/DocsLayout';
import {getPageSEO} from '@/utils/seo';
import '../styles/globals.css';

function RouteProgress(): React.ReactElement {
    const router = useRouter();

    useEffect(() => {
        const bar = document.getElementById('route-progress');
        if (!bar) return;

        const start = () => {
            bar.className = 'loading';
        };
        const done = () => {
            bar.className = 'done';
            const t = setTimeout(() => { bar.className = ''; }, 500);
            return () => clearTimeout(t);
        };

        router.events.on('routeChangeStart', start);
        router.events.on('routeChangeComplete', done);
        router.events.on('routeChangeError', done);

        return () => {
            router.events.off('routeChangeStart', start);
            router.events.off('routeChangeComplete', done);
            router.events.off('routeChangeError', done);
        };
    }, [router.events]);

    return <div id="route-progress"/>;
}

function Application({Component, pageProps}: AppProps): React.ReactElement {
    const router = useRouter();
    const isDocsRoute = router.pathname.startsWith('/docs');
    const [pageKey, setPageKey] = useState(router.asPath);

    useEffect(() => {
        const handleComplete = (url: string) => setPageKey(url);
        router.events.on('routeChangeComplete', handleComplete);
        return () => router.events.off('routeChangeComplete', handleComplete);
    }, [router.events]);

    const rawPath = router.asPath.split('?')[0];
    const seo = getPageSEO(rawPath === '/' ? '/' : rawPath.replace(/\/$/, ''));

    return (
        <>
            <RouteProgress/>
            <Head>
                <title>{seo.title}</title>
                <meta name="description" content={seo.description}/>
                {seo.keywords && <meta name="keywords" content={seo.keywords}/>}
                <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <meta name="theme-color" content="#0f1115" media="(prefers-color-scheme: dark)"/>
                <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)"/>
                <meta property="og:type" content="website"/>
                <meta property="og:site_name" content="DemoChain"/>
                <meta property="og:title" content={seo.ogTitle || seo.title}/>
                <meta property="og:description" content={seo.ogDescription || seo.description}/>
                <meta property="og:url" content={seo.canonical}/>
                {seo.ogImage && <meta property="og:image" content={seo.ogImage}/>}
                {seo.ogImage && <meta property="og:image:width" content="1200"/>}
                {seo.ogImage && <meta property="og:image:height" content="630"/>}
                {seo.ogImage && <meta property="og:image:type" content="image/svg+xml"/>}
                <meta name="twitter:card" content="summary_large_image"/>
                <meta name="twitter:title" content={seo.ogTitle || seo.title}/>
                <meta name="twitter:description" content={seo.ogDescription || seo.description}/>
                {seo.ogImage && <meta name="twitter:image" content={seo.ogImage}/>}
                <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
                {seo.canonical && <link rel="canonical" href={seo.canonical}/>}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'WebSite',
                            name: 'DemoChain',
                            url: 'https://demochain.org',
                            description: 'DemoChain 是面向学习者的区块链共识机制可视化演示平台，支持 PoW、PoS、DPoS、PoA、BFT、Avalanche、PoH 七种共识。',
                            inLanguage: 'zh-CN',
                        }),
                    }}
                />
            </Head>

            <Layout>
                <div key={pageKey} className="page-transition">
                    {isDocsRoute ? (
                        <DocsLayout
                            demoHref={pageProps.doc?.demoHref}
                            demoLabel={pageProps.doc?.demoLabel}
                        >
                            <Component {...pageProps} />
                        </DocsLayout>
                    ) : (
                        <Component {...pageProps} />
                    )}
                </div>
            </Layout>
        </>
    );
}

export default Application;
