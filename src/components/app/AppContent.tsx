import React from 'react';
import type {AppProps} from 'next/app';
import DocsLayout from '../../../pages/docs/components/DocsLayout';

type AppComponent = AppProps['Component'];
type AppPageProps = AppProps['pageProps'];

type AppContentProps = {
    Component: AppComponent;
    pageProps: AppPageProps;
    isDocsRoute: boolean;
};

const AppContent = ({
    Component,
    pageProps,
    isDocsRoute,
}: AppContentProps): React.ReactElement => {
    if (!isDocsRoute) {
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
