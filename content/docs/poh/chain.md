---
title: PoH 链视图
description: 查看 Solana 风格 PoH Slot 的完整链结构
consensus: POH
demoHref: /poh/chain
demoLabel: 去 PoH 链演示
order: 3
---

# PoH 链视图

PoH 链以 Slot 为单位组织，每个 Slot 包含一段哈希序列和期间发生的交易。

## Slot 结构

| 字段 | 说明 |
|------|------|
| **Slot 编号** | Slot 在链中的序号 |
| **Leader** | 该 Slot 的出块节点 |
| **哈希范围** | 该 Slot 覆盖的 PoH 步骤范围 |
| **交易数** | 打包的交易数量 |
| **哈希** | Slot 结束时的 PoH 哈希值 |

## 与 PoW 区块的对比

| 维度 | PoW 区块 | PoH Slot |
|------|---------|---------|
| 时间确定性 | 不固定（挖矿随机） | 固定（约 400ms） |
| 顺序证明 | 哈希难度 | PoH 序列 |
| 时间戳 | 矿工可以伪造 | PoH 哈希序列保证 |
| 吞吐量 | 低 | 极高 |

## 在演示中体验

在 PoH 链演示页面，你可以：
- 观察每个 Slot 的生成过程
- 查看 Slot 内嵌的 PoH 哈希信息
- 感受 Solana 式高速出块的节奏
