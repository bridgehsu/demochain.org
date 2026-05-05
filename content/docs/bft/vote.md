---
title: 三阶段投票
description: 理解 BFT 共识的 Prevote → Precommit → Commit 三阶段流程
consensus: BFT
demoHref: /bft/vote
demoLabel: 去投票演示
order: 3
---

# 三阶段投票

BFT 共识通过多轮投票确保即使有恶意节点，诚实节点也能达成一致。Tendermint 使用经典的三阶段协议。

## 三个阶段

### 阶段一：Prevote（预投票）

收到 Leader 提案后，每个诚实节点验证提案的合法性，然后广播 **Prevote** 消息：

```
如果提案合法 → 广播 Prevote(区块哈希)
如果提案无效 → 广播 Prevote(nil)
```

### 阶段二：Precommit（预提交）

收到 **2/3 以上节点**的 Prevote 后，节点广播 **Precommit** 消息：

```
如果收到 ≥ 2/3 Prevote(区块哈希) → 广播 Precommit(区块哈希)
否则 → 广播 Precommit(nil)
```

### 阶段三：Commit（提交）

收到 **2/3 以上节点**的 Precommit 后，区块被**最终确认**，写入链中：

```
收到 ≥ 2/3 Precommit(区块哈希) → 区块提交，不可撤销
```

## 为什么需要两轮投票

单轮投票无法在拜占庭节点存在的情况下保证安全性。两轮投票确保：
- 第一轮（Prevote）：节点声明"我看到了有效提案"
- 第二轮（Precommit）：节点声明"我确认足够多的人也看到了"

这防止了拜占庭节点伪造"足够多人同意"的假象。

## 在演示中体验

在投票演示页面，你可以：
- 观察 Prevote → Precommit → Commit 的动画流程
- 看到消息在节点之间传播的过程
- 理解 2/3 阈值如何确保最终一致性
