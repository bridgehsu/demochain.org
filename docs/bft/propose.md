---
title: 提案
description: 了解 BFT 共识的 Leader 提案广播过程
consensus: BFT
demoHref: /bft/propose
demoLabel: 去提案演示
order: 2
---

# 提案

BFT 共识的每一轮从 **Leader 提案**开始。Leader 收集待打包的交易，构建一个候选区块并广播给所有节点。

## Leader 选举

谁来担任本轮的 Leader？常见方法：

- **轮流担任**：所有验证者按顺序轮流担任 Leader
- **随机选择**：根据质押权重随机选取（如 Tendermint）
- **固定 Leader**：性能最好但单点故障风险最高

## 提案广播

```
1. Leader 选取待打包交易，构建区块头
2. 对区块进行签名
3. 将提案区块广播给所有验证者
4. 验证者接收提案，进入 Prevote 阶段
```

## 视图切换（View Change）

如果 Leader 在规定时间内没有发出提案（离线或作恶），系统会触发**视图切换**，选出新的 Leader 重新开始本轮。

这是 BFT 保证活性（Liveness）的关键机制。

## 在演示中体验

在提案演示页面，你可以：
- 观察 Leader 如何被选出
- 看到提案消息如何从 Leader 广播到各节点
- 模拟 Leader 失败时的视图切换过程
