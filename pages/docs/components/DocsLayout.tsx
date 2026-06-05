import React, {useState} from 'react';
import {useRouter} from 'next/router';
import DemoLink from './DemoLink';
import {DesktopSidebar, MobileSidebar} from './DocsSidebar';
import {DocsLayoutProps} from './shared';

const DocsLayout = ({children, demoHref, demoLabel}: DocsLayoutProps) => {
    const router = useRouter();
    const currentPath = router.asPath.split('?')[0];
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    
    return (
        <div className="flex gap-6 xl:gap-8">
            <main className="flex-1 min-w-0">
                <MobileSidebar
                    currentPath={currentPath}
                    open={mobileSidebarOpen}
                    onToggle={() => setMobileSidebarOpen(value => !value)}
                />
                {children}
                <DemoLink demoHref={demoHref} demoLabel={demoLabel}/>
            </main>
            <DesktopSidebar currentPath={currentPath}/>
        </div>
    );
};

export default DocsLayout;
