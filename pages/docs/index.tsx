import React from 'react';
import {GetStaticProps} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {getDocBySlug, DocData} from '@/utils/docs';
import {DOC_NAV} from '@/utils/docs-manifest';

interface Props {
    doc: DocData;
}

export default function DocsIndexPage({doc}: Props) {
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

            {/* 共识卡片导览 */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {DOC_NAV.map(group => (
                    <Link
                        key={group.consensus}
                        href={group.rootHref}
                        className="group block p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all"
                    >
                        <div className={`text-base font-bold mb-1 ${group.color}`}>{group.label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                            {group.items.length} 篇文章
                        </div>
                        <ul className="space-y-1">
                            {group.items.slice(0, 3).map(item => (
                                <li key={item.href} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-gray-400 shrink-0"/>
                                    {item.title}
                                </li>
                            ))}
                            {group.items.length > 3 && (
                                <li className="text-xs text-gray-400 dark:text-gray-500 pl-2">
                                    +{group.items.length - 3} 更多...
                                </li>
                            )}
                        </ul>
                    </Link>
                ))}
            </div>
        </>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const doc = await getDocBySlug([]);
    return {props: {doc}};
};
