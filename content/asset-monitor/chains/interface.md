---
title: "统一能力与链路差异"
description: "定义 Adapter 的公共职责和能力边界。"
---

# 统一能力与链路差异

## 项目已有抽象方向

Adapter 统一封装节点 RPC / WebSocket 接入、余额和 Token 查询、费用估算、交易构造、签名广播以及结果跟踪。

## 建议接口草案

```go
// 能力草案，非项目现有 API。
type ChainAdapter interface {
    Capabilities() Capabilities
    NormalizeAddress(raw string) (Address, error)
    QueryAsset(ctx context.Context, asset Address) (AssetInfo, error)
    Precheck(ctx context.Context, intent Intent) (CheckResult, error)
    Build(ctx context.Context, intent Intent) (UnsignedTx, error)
    Submit(ctx context.Context, tx SignedTx) (Submission, error)
    Track(ctx context.Context, id TxID) (TxObservation, error)
}
```

签名器可以通过独立依赖交给 Adapter 使用，业务编排不接触私钥。订阅能力应单独声明是否支持，而不是强迫所有链实现相同事件协议。

## 链路边界

ETH、BNB Chain、Base 放入 EVM 能力族进行实现复用；SOL 与 TRX 保留各自的地址、资源费用、交易有效性和确认状态处理。统一接口的职责是统一业务意图与结果结构，不是将底层交易编码强行统一。

## 能力发现

建议显式声明订阅、待确认信号、费用预估和状态查询等能力。不支持的能力返回明确结果，交由上层降级或拒绝。

## 验证场景

同一业务意图使用不同 Adapter 时，检查金额单位、费用字段与结果状态是否被上层正确解释。
