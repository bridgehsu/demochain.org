# DemoChain - 区块链共识演示平台

一个交互式区块链共识机制演示网站，通过可视化的方式帮助初学者理解不同共识算法的工作原理。支持 7 种主流共识机制的交互演示，所有计算均在浏览器端完成，无需后端服务。

## 🛠 技术栈

- **框架**: Next.js 13 + React 18 + TypeScript
- **样式**: Tailwind CSS 3
- **图标**: react-icons (Feather Icons)
- **部署**: GitHub Pages（静态导出）
- **字体**: Inter (UI) + Fira Code (代码)

## ✨ 支持的共识机制

| 共识 | 路由 | 演示内容 |
|---|---|---|
| **PoW** 工作量证明 | `/` ~ `/pow/*` | 哈希计算、区块结构、区块链、分布式网络、代币、币基奖励 |
| **PoS** 权益证明 | `/pos/*` | 质押、验证者、惩罚机制、奖励分配、链结构 |
| **DPoS** 委托权益证明 | `/dpos/*` | 候选人、投票、轮次、链结构 |
| **PoA** 权威证明 | `/poa/*` | 权威节点、签名验证、链结构 |
| **BFT** 拜占庭容错 | `/bft/*` | 节点网络、提案、投票、链结构 |
| **Avalanche** | `/avalanche/*` | 采样机制、雪球协议、链结构 |
| **PoH** 历史证明 | `/poh/*` | 序列、时序、链结构 |

## 🚀 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 📦 构建

```bash
pnpm install
pnpm build
```

产物输出到 `dist/`。本地预览：`pnpm preview`。

## ☁ GitHub Pages 自动部署

推送到 `main` 后由 GitHub Actions 构建并发布到 GitHub Pages，无需自建服务器。

1. 打开仓库 **Settings → Pages**
2. **Build and deployment → Source** 选择 **GitHub Actions**
3. 推送代码后查看 **Actions** 工作流 `Deploy GitHub Pages`
4. 默认地址：`https://bridgehsu.github.io/demochain.org/`
5. 自定义域名：仓库已含 `public/CNAME`（`demochain.org`）。在 Pages 设置里确认 Custom domain，并把域名 DNS 指到 GitHub Pages（通常是 `A`/`CNAME` 记录）

> 使用自定义域名 `demochain.org` 时路径在站点根目录；若只用 `*.github.io/demochain.org` 且资源 404，需要再配置 Next.js `basePath`。

### 部署包体积

- 清理后约 **3MB**（含所有页面和资源）
- 用户首次访问首页仅需加载约 **500KB**
- 共享 JS/CSS 会被浏览器永久缓存
- 页面间切换仅加载几 KB 的新页面 chunk

## � 特性

- **交互式演示**: 所有共识算法均可实时交互操作
- **暗黑模式**: 自动/手动切换，深色主题优化
- **响应式设计**: 适配桌面端和移动端
- **图标导航**: 菜单项配有语义化图标
- **共识切换器**: 一键切换不同共识机制
- **纯前端**: 无后端依赖，无需数据库或 API

## 📁 项目结构

```
pages/              # Next.js 页面路由
  pow/              # PoW 相关页面
  pos/              # PoS 相关页面
  dpos/             # DPoS 相关页面
  poa/              # PoA 相关页面
  bft/              # BFT 相关页面
  avalanche/        # Avalanche 相关页面
  poh/              # PoH 相关页面
src/
  views/            # 页面视图组件
  components/       # 可复用组件
  layout/           # 布局组件 (Header, Menu, Footer, Theme)
  types/            # TypeScript 类型定义
  utils/            # 工具函数
styles/             # 全局样式
public/             # 静态资源
```

## ⚡ 性能优化

- 静态导出模式，无服务端渲染开销
- Next.js 自动代码分割，按需加载页面 chunk
- 构建后自动清理 cache、server 等无用文件
- CDN 边缘节点分发，全球低延迟访问
