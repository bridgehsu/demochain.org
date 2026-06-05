import React from 'react';
import type {GetStaticProps} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {COINEX_NAV} from '@/utils/coinex-manifest';
import {type DocData, getDocBySlug} from '@/utils/section-docs';

type CoinexIndexProps = {
    doc: DocData;
};

type GroupCardProps = {
    group: (typeof COINEX_NAV)[number];
};

const GroupCard = ({group}: GroupCardProps): React.ReactElement => (
    <Link
        href={group.rootHref}
        className="group block rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
    >
        <div className={`mb-1 text-base font-bold ${group.color}`}>{group.label}</div>
        <div className="mb-3 text-xs text-gray-500 dark:text-gray-400">
            {group.items.length} 篇文章
        </div>
        <ul className="space-y-1">
            {group.items.slice(0, 3).map(item => (
                <li
                    key={item.href}
                    className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400"
                >
                    <span className="h-1 w-1 shrink-0 rounded-full bg-gray-400"/>
                    {item.title}
                </li>
            ))}
            {group.items.length > 3 && (
                <li className="pl-2 text-xs text-gray-400 dark:text-gray-500">
                    +{group.items.length - 3} 更多...
                </li>
            )}
        </ul>
    </Link>
);

const CoinexIndexPage = ({doc}: CoinexIndexProps): React.ReactElement => {
    const pageTitle = `${doc.title} - DemoChain`;

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={doc.description}/>
                <meta property="og:title" content={pageTitle}/>
                <meta property="og:description" content={doc.description}/>
            </Head>
            <article className="prose-docs">
                <div dangerouslySetInnerHTML={{__html: doc.contentHtml}}/>
            </article>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {COINEX_NAV.map(group => (
                    <GroupCard key={group.consensus} group={group}/>
                ))}
            </div>
        </>
    );
};

export const getStaticProps: GetStaticProps<CoinexIndexProps> = async () => {
    const doc = await getDocBySlug([], 'coinex');

    return {props: {doc}};
};

export default CoinexIndexPage;
