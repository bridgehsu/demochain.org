---
title: BFT 拜占庭容错
description: 了解 Cosmos 和 Tendermint 使用的拜占庭容错共识机制
consensus: BFT
order: 1
---

# BFT 拜占庭容错

**拜占庭容错（Byzantine Fault Tolerance）** 源于经典的分布式计算问题，描述在存在"叛徒"（恶意节点）的情况下如何达成共识。

## 拜占庭将军问题

想象几位将军围攻一座城市，他们只能通过信使传递消息，但其中可能有叛徒发送假消息。如何确保忠诚的将军能达成一致的攻击/撤退决策？

这就是拜占庭将军问题的本质：**在有恶意节点的网络中，诚实节点如何达成一致？**

## 容错比例

经典的 BFT 算法可以容忍至多 **f** 个拜占庭节点，只要总节点数 **n ≥ 3f + 1**。

```
n = 4 → 容忍 1 个拜占庭节点
n = 7 → 容忍 2 个拜占庭节点
n = 10 → 容忍 3 个拜占庭节点
```

以太坊、Cosmos 等使用的 BFT 变种要求 2/3 以上节点诚实。

## Tendermint BFT

Tendermint 是最广为人知的 BFT 实现，分为三个阶段：

1. **Propose**：Leader 提案一个区块
2. **Prevote**：所有节点对提案投 Prevote 票
3. **Precommit**：收到 2/3 Prevote 后，节点投 Precommit 票
4. **Commit**：收到 2/3 Precommit 后，区块最终确认

## 即时最终性

BFT 最大的优点是**即时最终性**：区块一旦提交，永远不会被回滚，不需要等待多次确认。

## 本章演示内容

| 演示页面 | 你能学到什么 |
|---------|-------------|
| [节点](/docs/bft/nodes) | 拜占庭节点配置与容错分析 |
| [提案](/docs/bft/propose) | Leader 提案广播过程 |
| [投票](/docs/bft/vote) | 三阶段投票共识流程 |
| [链](/docs/bft/chain) | BFT 完整链视图 |
