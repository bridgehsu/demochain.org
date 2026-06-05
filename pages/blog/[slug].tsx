import React from 'react';
import type {GetStaticPaths, GetStaticProps} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {FiArrowLeft} from 'react-icons/fi';
import {getBlogBySlug, getAllBlogSlugs, type BlogPost} from '@/utils/blog';

interface Props {
    post: BlogPost;
}

export default function BlogPostPage({post}: Props) {
    return (
        <>
            <Head>
                <title>{post.title} - DemoChain</title>
                <meta name="description" content={post.excerpt}/>
                <meta property="og:title" content={`${post.title} - DemoChain`}/>
                <meta property="og:description" content={post.excerpt}/>
            </Head>

            <div className="max-w-3xl mx-auto">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-8"
                >
                    <FiArrowLeft className="w-4 h-4"/>
                    返回博客
                </Link>

                <article className="prose-docs">
                    <div dangerouslySetInnerHTML={{__html: post.contentHtml}}/>
                </article>
            </div>
        </>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const slugs = getAllBlogSlugs();
    return {
        paths: slugs.map(slug => ({params: {slug}})),
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps<Props> = async ({params}) => {
    const slug = params?.slug as string;
    const post = await getBlogBySlug(slug);
    return {props: {post}};
};
