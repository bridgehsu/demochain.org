import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

class MyDocument extends Document {
  render(): React.ReactElement {
    return (
      <Html lang="zh-CN">
        <Head>
          <meta charSet="utf-8"/>
          
          <meta name="author" content="DemoChain"/>
          <meta property="og:locale" content="zh_CN"/>
          
          {/* 图标和资源 */}
          <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
          <link rel="alternate icon" href="/favicon.ico"/>
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500;600&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet"/>
          
          {/* 预加载主题脚本 - 避免闪烁 */}
          <script src="/js/theme-script.js" />
        </Head>
        <body>
          <Main/>
          <NextScript/>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
