import React from 'react';
import type {AppProps} from 'next/app';
import DocsLayout from '@/components/docs/DocsLayout';

type AppComponent = AppProps['Component'];
type AppPageProps = AppProps['pageProps'];

type AppContentProps = {
    Component: AppComponent;
    pageProps: AppPageProps;
    isSectionRoute: boolean;
};

const AppContent = ({
    Component,
    pageProps,
    isSectionRoute,
}: AppContentProps): React.ReactElement => {
    if (!isSectionRoute) {
        return <Component {...pageProps} />;
    }

    return (
        <DocsLayout
            demoHref={pageProps.doc?.demoHref}
            demoLabel={pageProps.doc?.demoLabel}
        >
            <Component {...pageProps} />
        </DocsLayout>
    );
};

export default AppContent;
