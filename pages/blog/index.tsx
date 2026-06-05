import React from 'react';
import type {GetStaticProps} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {FiArrowRight} from 'react-icons/fi';
import {getAllBlogMeta, type BlogMeta} from '@/utils/blog';

interface Props {
    posts: BlogMeta[];
}

export default function BlogIndex({posts}: Props) {
    return (
        <>
            <Head>
                <title>博客 - DemoChain</title>
                <meta name="description" content="DemoChain 博客，探索区块链共识机制的深度内容"/>
            </Head>

            <div className="max-w-3xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">博客</h1>
                    <p className="text-gray-500 dark:text-gray-400">关于区块链共识机制的深度文章</p>
                </div>

                <div className="space-y-4">
                    {posts.map((post, index) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group block p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-mono text-gray-400 dark:text-gray-500">
                                            #{String(index + 1).padStart(2, '0')}
                                        </span>
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 leading-snug">
                                        {post.title}
                                    </h2>
                                    {post.excerpt && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                    )}
                                </div>
                                <FiArrowRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 shrink-0 mt-1 transition-colors"/>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
    const posts = getAllBlogMeta();
    return {props: {posts}};
};
