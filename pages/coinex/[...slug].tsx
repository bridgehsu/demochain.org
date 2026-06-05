import React from 'react';
import type {GetStaticPaths, GetStaticProps} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {FiArrowLeft, FiArrowRight} from 'react-icons/fi';
import {COINEX_NAV} from '@/utils/coinex-manifest';
import {type DocData, getAllDocSlugs, getDocBySlug} from '@/utils/section-docs';
import {getAdjacentDocs, getFlatNavItems, type FlatNavItem} from '@/utils/section-navigation';

type CoinexDocProps = {
    doc: DocData;
    prevDoc: FlatNavItem | null;
    nextDoc: FlatNavItem | null;
};

type AdjacentDocLinkProps = {
    doc: FlatNavItem;
    direction: 'prev' | 'next';
};

const directionConfig = {
    prev: {
        icon: FiArrowLeft,
        label: '上一篇',
        className: 'flex-1 flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-all hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 group',
        textAlign: '',
    },
    next: {
        icon: FiArrowRight,
        label: '下一篇',
        className: 'flex-1 flex items-center justify-end gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-right transition-all hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 group',
        textAlign: 'text-right',
    },
} as const;

const AdjacentDocLink = ({
    doc,
    direction,
}: AdjacentDocLinkProps): React.ReactElement => {
    const config = directionConfig[direction];
    const Icon = config.icon;

    return (
        <Link href={doc.href} className={config.className}>
            {direction === 'prev' && (
                <Icon className="h-4 w-4 shrink-0 text-gray-400 transition-colors group-hover:text-gray-700 dark:group-hover:text-gray-200"/>
            )}
            <div className={`min-w-0 ${config.textAlign}`}>
                <div className="mb-0.5 text-xs text-gray-400">{config.label}</div>
                <div className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">
                    {doc.title}
                </div>
            </div>
            {direction === 'next' && (
                <Icon className="h-4 w-4 shrink-0 text-gray-400 transition-colors group-hover:text-gray-700 dark:group-hover:text-gray-200"/>
            )}
        </Link>
    );
};

const CoinexDocPage = ({
    doc,
    prevDoc,
    nextDoc,
}: CoinexDocProps): React.ReactElement => {
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
            {(prevDoc || nextDoc) && (
                <div className="mt-10 flex flex-col gap-3 border-t border-gray-200 pt-6 dark:border-gray-700 sm:flex-row sm:items-stretch">
                    {prevDoc ? <AdjacentDocLink doc={prevDoc} direction="prev"/> : <div className="flex-1"/>}
                    {nextDoc ? <AdjacentDocLink doc={nextDoc} direction="next"/> : <div className="flex-1"/>}
                </div>
            )}
        </>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const slugArrays = getAllDocSlugs('coinex');

    return {
        paths: slugArrays.map(slug => ({params: {slug}})),
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps<CoinexDocProps> = async ({params}) => {
    const slug = params?.slug as string[];
    const doc = await getDocBySlug(slug, 'coinex');
    const flatNav = getFlatNavItems(COINEX_NAV);
    const currentHref = `/coinex/${slug.join('/')}`;
    const {prevDoc, nextDoc} = getAdjacentDocs(flatNav, currentHref);

    return {
        props: {
            doc,
            prevDoc,
            nextDoc,
        },
    };
};

export default CoinexDocPage;
