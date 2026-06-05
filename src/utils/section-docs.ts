import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {remark} from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import {type SectionKey} from './section-manifest';

const getSectionDir = (section: SectionKey) => (
    path.join(process.cwd(), section)
);

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

const resolveDocPath = (section: SectionKey, slug: string[]) => {
    const sectionDir = getSectionDir(section);
    const directPath = path.join(sectionDir, ...slug) + '.md';

    if (fs.existsSync(directPath)) {
        return directPath;
    }

    return path.join(sectionDir, ...slug, 'index.md');
};

export const getDocBySlug = async (
    slug: string[],
    section: SectionKey = 'docs',
): Promise<DocData> => {
    const raw = fs.readFileSync(resolveDocPath(section, slug), 'utf8');
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
};

export const getAllDocSlugs = (section: SectionKey = 'docs'): string[][] => {
    const sectionDir = getSectionDir(section);
    const slugs: string[][] = [];

    const scan = (dir: string, prefix: string[]) => {
        const entries = fs.readdirSync(dir, {withFileTypes: true});

        for (const entry of entries) {
            if (entry.isDirectory()) {
                scan(path.join(dir, entry.name), [...prefix, entry.name]);
                continue;
            }

            if (!entry.name.endsWith('.md')) {
                continue;
            }

            const base = entry.name.replace(/\.md$/, '');

            if (base === 'index') {
                if (prefix.length > 0) {
                    slugs.push(prefix);
                }
                continue;
            }

            slugs.push([...prefix, base]);
        }
    };

    scan(sectionDir, []);
    return slugs;
};
