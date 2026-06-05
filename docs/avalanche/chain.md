---
title: Avalanche 链视图
description: 查看 Avalanche 概率最终性的完整链结构
consensus: AVALANCHE
demoHref: /avalanche/chain
demoLabel: 去 Avalanche 链演示
order: 3
---

# Avalanche 链视图

Avalanche 链采用独特的 **DAG（有向无环图）** 结构，但在演示中我们以线性链形式展示其核心概念。

## Avalanche 的特殊性

真实的 Avalanche 不是简单的线性链，而是一个 DAG——多个区块可以同时被确认，而不必等待前一个区块。这是其高吞吐量的来源之一。

## 在演示中体验

在 Avalanche 链演示页面，你可以：
- 观察每个区块经过雪球共识后被最终确认
- 了解概率最终性与 BFT 确定性最终性的区别
- 感受 Avalanche 的快速出块节奏
