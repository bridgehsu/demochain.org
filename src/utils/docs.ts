import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {remark} from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

const docsDir = path.join(process.cwd(), 'docs');

export interface DocFrontmatter {
    title: string;
    description: string;
    consensus: string | null;
    demoHref: string | null;
    demoLabel: string | null;
    order: number | null;
}

export interface DocData extends DocFrontmatter {
    slug: string[];
    contentHtml: string;
}

export async function getDocBySlug(slug: string[]): Promise<DocData> {
    // Try exact file first: pow/hash.md
    let filePath = path.join(docsDir, ...slug) + '.md';
    if (!fs.existsSync(filePath)) {
        // Fall back to index: pow/index.md (when slug = ['pow'])
        filePath = path.join(docsDir, ...slug, 'index.md');
    }

    const raw = fs.readFileSync(filePath, 'utf8');
    const {data, content} = matter(raw);

    const processed = await remark()
        .use(remarkGfm)
        .use(remarkHtml, {sanitize: false})
        .process(content);

    return {
        slug,
        contentHtml: processed.toString(),
        title: data.title ?? '',
        description: data.description ?? '',
        consensus: data.consensus ?? null,
        demoHref: data.demoHref ?? null,
        demoLabel: data.demoLabel ?? null,
        order: data.order ?? null,
    };
}

/** Returns all slug arrays for getStaticPaths, excluding root index (handled by pages/docs/index.tsx) */
export function getAllDocSlugs(): string[][] {
    const slugs: string[][] = [];

    function scan(dir: string, prefix: string[]) {
        const entries = fs.readdirSync(dir, {withFileTypes: true});
        for (const entry of entries) {
            if (entry.isDirectory()) {
                scan(path.join(dir, entry.name), [...prefix, entry.name]);
            } else if (entry.name.endsWith('.md')) {
                const base = entry.name.replace(/\.md$/, '');
                if (base === 'index') {
                    // consensus root: e.g. ['pow']
                    if (prefix.length > 0) slugs.push(prefix);
                    // top-level index handled separately
                } else {
                    slugs.push([...prefix, base]);
                }
            }
        }
    }

    scan(docsDir, []);
    return slugs;
}
