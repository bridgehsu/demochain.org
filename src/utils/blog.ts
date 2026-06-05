import fs from 'fs';
import path from 'path';
import {remark} from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

const blogsDir = path.join(process.cwd(), 'blogs');

export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    contentHtml: string;
}

export interface BlogMeta {
    slug: string;
    title: string;
    excerpt: string;
}

function extractMeta(raw: string, slug: string): {title: string; excerpt: string} {
    const titleMatch = raw.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : slug;

    const excerptMatch = raw.match(/^>\s+(.+)$/m);
    const excerpt = excerptMatch ? excerptMatch[1].trim() : '';

    return {title, excerpt};
}

export function getAllBlogSlugs(): string[] {
    return fs.readdirSync(blogsDir)
        .filter(f => f.endsWith('.md'))
        .map(f => f.replace(/\.md$/, ''))
        .sort();
}

export function getAllBlogMeta(): BlogMeta[] {
    return getAllBlogSlugs().map(slug => {
        const raw = fs.readFileSync(path.join(blogsDir, `${slug}.md`), 'utf8');
        return {slug, ...extractMeta(raw, slug)};
    });
}

export async function getBlogBySlug(slug: string): Promise<BlogPost> {
    const filePath = path.join(blogsDir, `${slug}.md`);
    const raw = fs.readFileSync(filePath, 'utf8');

    const processed = await remark()
        .use(remarkGfm)
        .use(remarkHtml, {sanitize: false})
        .process(raw);

    return {
        slug,
        ...extractMeta(raw, slug),
        contentHtml: processed.toString(),
    };
}
