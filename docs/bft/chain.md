---
title: BFT 链视图
description: 查看具有即时最终性的 BFT 完整链结构
consensus: BFT
demoHref: /bft/chain
demoLabel: 去 BFT 链演示
order: 4
---

# BFT 链视图

BFT 链最大的特点是**即时最终性**：每个区块一旦提交，就永远不会被撤销，无需等待多次确认。

## 链的特点

- **无概率最终性**：与 PoW 的"6 次确认"不同，BFT 区块提交即最终
- **高吞吐量**：Cosmos 等 BFT 链可达到数千 TPS
- **节点数量有限**：通常验证者数量受限（如 Cosmos 最多 175 个）

## 在演示中体验

在 BFT 链演示页面，你可以：
- 观察区块被三阶段投票确认后加入链
- 查看每个区块的提案者和确认状态
- 感受 BFT 链的快速出块节奏
