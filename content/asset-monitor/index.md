---
title: "EVM 资产监测与策略系统"
description: "多链资产监测和策略执行的核心流程与服务文档。"
---

# EVM 资产监测与策略系统

**技术标签：Solidity · Golang · EVM · Redis · 多链节点**

面向社交媒体信号与链上事件，识别潜在资产地址和资产异动，再完成链路路由、策略校验、交易构造、执行提交和结果追踪。项目覆盖 ETH、BNB Chain、Base、SOL、TRX 等链路。

## 一条信号的完整旅程

```text
社交媒体 / 链上事件
    → 信号接入 → 地址提取 → 链路识别 → 重复过滤
    → 元数据与链上状态校验 → 策略校验 → 交易预检查
    → 交易构造 → 签名与提交 → 状态追踪 → 结果与告警
```

## 推荐阅读

1. [系统目标与核心流程](/asset-monitor/guide/overview/)：先理解输入、输出与状态边界。
2. [CA 地址提取与链路识别](/asset-monitor/signals/address/)：从文本候选定位链与资产。
3. [统一能力与链路差异](/asset-monitor/chains/interface/)：了解 Adapter 的公共能力与差异。
4. [策略任务状态机](/asset-monitor/strategy/state-machine/)：串联执行、确认和异常处理。
5. [确认、超时与失败重试](/asset-monitor/transactions/confirmation/)：处理结果未知的交易。

## 文档范围与依据

本文档根据项目负责人提供的项目描述、技术亮点和个人贡献整理，尚未对照该系统源码。文中的模块职责来源于项目描述；接口草案、字段、状态名、Redis Key、流程细分和验证场景均为建议设计，不代表已核验的实现、服务名称或部署参数。

项目名称沿用“EVM 资产监测与策略系统”；SOL 与 TRX 应保留各自的地址、交易及确认语义，不视为 Ethereum RPC 的直接替代。Solidity 为项目技术标签，具体链上合约职责尚未提供，本文不虚构合约名称或能力。
