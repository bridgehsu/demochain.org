import React, {useEffect, useState} from 'react';
import type {AppProps} from 'next/app';
import {useRouter} from 'next/router';
import AppContent from '@/components/app/AppContent';
import Layout from '@/layout';
import RouteProgress from '@/components/app/RouteProgress';
import SeoHead from '@/components/seo/SeoHead';
import '../styles/globals.css';

const Application = ({Component, pageProps}: AppProps): React.ReactElement => {
    const router = useRouter();
    const isDocsRoute = router.pathname.startsWith('/docs');
    const [pageKey, setPageKey] = useState(router.asPath);

    useEffect(() => {
        const handleComplete = (url: string) => {
            setPageKey(url);
        };

        router.events.on('routeChangeComplete', handleComplete);
        return () => router.events.off('routeChangeComplete', handleComplete);
    }, [router.events]);

    return (
        <>
            <RouteProgress/>
            <SeoHead path={router.asPath}/>
            <Layout>
                <div key={pageKey} className="page-transition">
                    <AppContent
                        Component={Component}
                        pageProps={pageProps}
                        isDocsRoute={isDocsRoute}
                    />
                </div>
            </Layout>
        </>
    );
};

export default Application;
