import React, {useEffect} from 'react';
import {useRouter} from 'next/router';

const RouteProgress = (): React.ReactElement => {
    const router = useRouter();

    useEffect(() => {
        const bar = document.getElementById('route-progress');
        if (!bar) return;

        const start = () => {
            bar.className = 'loading';
        };

        const done = () => {
            bar.className = 'done';
            window.setTimeout(() => {
                bar.className = '';
            }, 500);
        };

        router.events.on('routeChangeStart', start);
        router.events.on('routeChangeComplete', done);
        router.events.on('routeChangeError', done);

        return () => {
            router.events.off('routeChangeStart', start);
            router.events.off('routeChangeComplete', done);
            router.events.off('routeChangeError', done);
        };
    }, [router.events]);

    return <div id="route-progress"/>;
};

export default RouteProgress;
