import React from 'react';
import {GetStaticPaths, GetStaticProps} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {getDocBySlug, getAllDocSlugs, DocData} from '@/utils/docs';
import {TGEX_NAV as DOC_NAV} from '@/utils/tgex-manifest';
import {FiArrowLeft, FiArrowRight} from 'react-icons/fi';

interface Props {
    doc: DocData;
    prevDoc: {title: string; href: string} | null;
    nextDoc: {title: string; href: string} | null;
}

/** Flatten all nav items in order for prev/next navigation */
function getFlatNavItems() {
    const items: {title: string; href: string; slugKey: string}[] = [];
    for (const group of DOC_NAV) {
        items.push({title: group.label + ' 总览', href: group.rootHref, slugKey: group.rootHref});
        for (const item of group.items) {
            items.push({title: item.title, href: item.href, slugKey: item.href});
        }
    }
    return items;
}

export default function DocPage({doc, prevDoc, nextDoc}: Props) {
    const pageTitle = `${doc.title} · TGEX - DemoChain`;
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

            {/* 上一篇 / 下一篇 */}
            {(prevDoc || nextDoc) && (
                <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-stretch gap-3">
                    {prevDoc ? (
                        <Link
                            href={prevDoc.href}
                            className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all group"
                        >
                            <FiArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors shrink-0"/>
                            <div className="min-w-0">
                                <div className="text-xs text-gray-400 mb-0.5">上一篇</div>
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{prevDoc.title}</div>
                            </div>
                        </Link>
                    ) : <div className="flex-1"/>}

                    {nextDoc ? (
                        <Link
                            href={nextDoc.href}
                            className="flex-1 flex items-center justify-end gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all group text-right"
                        >
                            <div className="min-w-0">
                                <div className="text-xs text-gray-400 mb-0.5">下一篇</div>
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{nextDoc.title}</div>
                            </div>
                            <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors shrink-0"/>
                        </Link>
                    ) : <div className="flex-1"/>}
                </div>
            )}
        </>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const slugArrays = getAllDocSlugs('content/tgex');
    return {
        paths: slugArrays.map(slug => ({params: {slug}})),
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async ({params}) => {
    const slug = params?.slug as string[];
    const doc = await getDocBySlug(slug, 'content/tgex');

    // Build flat nav for prev/next
    const flat = getFlatNavItems();
    const currentHref = '/tgex/' + slug.join('/');
    const idx = flat.findIndex(item => item.href === currentHref);
    const prevDoc = idx > 0 ? {title: flat[idx - 1].title, href: flat[idx - 1].href} : null;
    const nextDoc = idx >= 0 && idx < flat.length - 1 ? {title: flat[idx + 1].title, href: flat[idx + 1].href} : null;

    return {props: {doc, prevDoc, nextDoc}};
};
