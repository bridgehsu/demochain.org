import React from 'react';
import Link from 'next/link';
import {FiExternalLink} from 'react-icons/fi';
import {DEMO_LABEL, DEMO_LINK_CLASS, DocsLayoutProps} from './shared';

type DemoLinkProps = Pick<DocsLayoutProps, 'demoHref' | 'demoLabel'>;

const DemoLink = ({demoHref, demoLabel}: DemoLinkProps) => {
    if (!demoHref) {
        return null;
    }

    return (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link href={demoHref} className={DEMO_LINK_CLASS}>
                <FiExternalLink className="w-4 h-4"/>
                {demoLabel || DEMO_LABEL}
            </Link>
        </div>
    );
};

export default DemoLink;
