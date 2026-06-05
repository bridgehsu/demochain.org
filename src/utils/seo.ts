export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
}

export const defaultSEO: SEOConfig = {
  title: 'DemoChain - 区块链共识机制演示平台',
  description: 'DemoChain 是面向学习者的区块链共识机制可视化演示平台，支持 PoW、PoS、DPoS、PoA、BFT、Avalanche、PoH 七种共识，通过交互式演示帮助快速理解区块链原理。',
  keywords: '区块链,共识机制,区块链演示,PoW,PoS,BFT,可视化教育',
  ogImage: 'https://demochain.org/og-image.svg',
};

export const pageSEO: Record<string, Partial<SEOConfig>> = {
  // PoW
  '/': { title: 'DemoChain - 区块链共识演示平台', description: '通过交互式演示理解 PoW、PoS、DPoS 等七种共识机制的运作原理。' },
  '/pow/block': { title: '区块 · PoW - DemoChain', description: '可视化区块结构与字段组成，理解区块如何链接与验证。' },
  '/pow/blockchain': { title: '区块链 · PoW - DemoChain', description: '观察区块串联、哈希难度与链一致性的动态变化。' },
  '/pow/distribution': { title: '分布式 · PoW - DemoChain', description: '模拟分布式挖矿网络，直观认识去中心化竞争出块。' },
  '/pow/token': { title: '代币 · PoW - DemoChain', description: '演示代币账户与交易模型，理解 UTXO 与转账机制。' },
  '/pow/coinbase': { title: '币基 · PoW - DemoChain', description: '理解出块奖励与币基交易发行机制。' },
  // PoS
  '/pos': { title: '质押 · PoS - DemoChain', description: '演示 PoS 质押机制，理解权益权重与验证者参与流程。' },
  '/pos/validators': { title: '验证者 · PoS - DemoChain', description: '基于质押权重进行加权随机选择，直观理解出块概率。' },
  '/pos/slashing': { title: '惩罚 · PoS - DemoChain', description: '模拟 Slashing 惩罚机制，理解 PoS 安全性保障。' },
  '/pos/rewards': { title: '奖励 · PoS - DemoChain', description: '演示质押奖励与年化收益率计算。' },
  '/pos/chain': { title: '链 · PoS - DemoChain', description: '查看验证者按权重轮流出块的 PoS 完整链视图。' },
  // DPoS
  '/dpos': { title: '候选人 · DPoS - DemoChain', description: '理解 DPoS 候选人注册与竞选机制。' },
  '/dpos/vote': { title: '投票 · DPoS - DemoChain', description: '模拟持币者投票选出代表，理解委托权益证明。' },
  '/dpos/rounds': { title: '轮次 · DPoS - DemoChain', description: '当选代表按轮次顺序出块，演示 DPoS 出块节奏。' },
  '/dpos/chain': { title: '链 · DPoS - DemoChain', description: '查看代表轮流出块的 DPoS 完整链视图。' },
  // PoA
  '/poa': { title: '权威 · PoA - DemoChain', description: '理解 PoA 权威节点的信任机制与管理方式。' },
  '/poa/signing': { title: '签名 · PoA - DemoChain', description: '权威节点轮流签名出块，理解 PoA 出块流程。' },
  '/poa/chain': { title: '链 · PoA - DemoChain', description: '查看权威节点签名出块的 PoA 完整链视图。' },
  // BFT
  '/bft': { title: '节点 · BFT - DemoChain', description: '配置拜占庭节点，理解 BFT 容错机制的基本原理。' },
  '/bft/propose': { title: '提案 · BFT - DemoChain', description: '演示 Leader 提案广播过程，理解 BFT 共识起点。' },
  '/bft/vote': { title: '投票 · BFT - DemoChain', description: '动画展示 Prevote→Precommit→Commit 三阶段共识流程。' },
  '/bft/chain': { title: '链 · BFT - DemoChain', description: '查看具有即时最终性的 BFT 完整链视图。' },
  // Avalanche
  '/avalanche': { title: '采样 · Avalanche - DemoChain', description: '理解 Avalanche 随机采样机制的工作原理。' },
  '/avalanche/snowball': { title: '雪球 · Avalanche - DemoChain', description: '演示信心值累积收敛过程，理解雪球算法。' },
  '/avalanche/chain': { title: '链 · Avalanche - DemoChain', description: '查看概率最终性的 Avalanche 完整链视图。' },
  // PoH
  '/poh': { title: '序列 · PoH - DemoChain', description: '演示连续 SHA256 哈希序列作为可验证时钟。' },
  '/poh/timeline': { title: '时序 · PoH - DemoChain', description: '在哈希序列中插入事件，理解 PoH 时间戳证明。' },
  '/poh/chain': { title: '链 · PoH - DemoChain', description: '查看 Solana 风格 PoH Slot 的完整链视图。' },
  // 文档
  '/docs': { title: '文档 - DemoChain', description: '七种区块链共识机制的原理讲解与演示导览。' },
  '/docs/pow': { title: 'PoW 文档 - DemoChain', description: '工作量证明共识机制的原理解读与演示导览。' },
  '/docs/pos': { title: 'PoS 文档 - DemoChain', description: '权益证明共识机制的原理解读与演示导览。' },
  '/docs/dpos': { title: 'DPoS 文档 - DemoChain', description: '委托权益证明共识机制的原理解读与演示导览。' },
  '/docs/poa': { title: 'PoA 文档 - DemoChain', description: '权威证明共识机制的原理解读与演示导览。' },
  '/docs/bft': { title: 'BFT 文档 - DemoChain', description: '拜占庭容错共识机制的原理解读与演示导览。' },
  '/docs/avalanche': { title: 'Avalanche 文档 - DemoChain', description: 'Avalanche 雪崩协议的原理解读与演示导览。' },
  '/docs/poh': { title: 'PoH 文档 - DemoChain', description: '历史证明机制的原理解读与演示导览。' },
  '/coinex': { title: 'CoinEX 文档 - DemoChain', description: 'CoinEX 交易所项目文档与开发手册。' },
  '/coinex/quick-start': { title: '快速开始 - CoinEX', description: 'CoinEX 项目的简介、上手与致谢信息。' },
  '/coinex/backend-manual': { title: '后端手册 - CoinEX', description: 'CoinEX 后端模块、权限、缓存与运维文档。' },
  '/coinex/frontend-manual': { title: '前端手册 - CoinEX', description: 'CoinEX 前端路由、组件与异常处理文档。' },
  '/coinex/deployment': { title: '部署项目 - CoinEX', description: 'CoinEX 常规部署与容器部署方案。' },
};

export function getPageSEO(pathname: string): SEOConfig {
  const pageSEOConfig = pageSEO[pathname] || {};
  return {
    ...defaultSEO,
    ...pageSEOConfig,
    ogTitle: pageSEOConfig.ogTitle || pageSEOConfig.title || defaultSEO.title,
    ogDescription: pageSEOConfig.ogDescription || pageSEOConfig.description || defaultSEO.description,
    canonical: `https://demochain.org${pathname}`,
  };
}
