import React from 'react';
import type {GetStaticProps} from 'next';
import Head from 'next/head';
import {getDocBySlug, type DocData} from '@/utils/docs';

export default function QuantTradingPage({doc}: {doc: DocData}) {
    return (
        <>
            <Head>
                <title>{`${doc.title} - DemoChain`}</title>
                <meta name="description" content={doc.description}/>
                <meta property="og:title" content={`${doc.title} - DemoChain`}/>
                <meta property="og:description" content={doc.description}/>
            </Head>
            <article className="prose-docs">
                <div dangerouslySetInnerHTML={{__html: doc.contentHtml}}/>
            </article>
        </>
    );
}

export const getStaticProps: GetStaticProps = async () => ({
    props: {doc: await getDocBySlug([], 'content/quant-trading')},
});
