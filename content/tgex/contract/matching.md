---
title: "合约撮合核心流程"
description: "合约事件分支与现货撮合的实现差异。"
---

# 合约撮合核心流程

## 独立模块

合约撮合位于 `contract-match-new-cxex-release1.1.1/contract-match-provider/src/main/java/com/exch/contract/match`，使用 `ContractMatchEntrustDTO` 和 `MatchEngineManager`。不能直接把现货 DTO 和事件字段套用到合约。

## 已核对的处理分支

`MatchingBusinessHandler.onEvent` 检查 `matchEngineManager.isRunning` 和 `event.isSaveFile()` 后进入分支：

| 事件 | 订单簿操作 |
| --- | --- |
| ADD_ORDER | orderbook.enter(ContractMatchEntrustDTO) |
| CANCEL_ORDER | orderbook.cancel(id, BigDecimal.ZERO, Boolean.TRUE) |
| INIT_MATCH | orderbook.enterInit(dto, event.isInitCompleted()) |

合约 enter 传入整个 DTO；现货 enter 则拆开订单 ID、方向、价格、数量和交易对等参数。这是入口形态的差异，具体合约约束应继续在订单簿和前置处理代码中确认。

## 服务入口与扩展职责

`provider/ContractMatchEngineService` 暴露 `addOrder`、`cancelOrder`、`forceCancelOrder`，同时包含条件单、保证金、账户与杠杆相关入口。这说明引擎服务承担了多类业务请求，分析时应分开交易事件和账户事件。

## 异常与资源释放

该处理器会记录异常，将 `MatchingSaveFileException` 继续抛出，并在 finally 中释放 `ResizeSemaphore`。捕获异常不代表业务成功；需要追踪上层响应和持久化状态。

## 源码阅读路线

`ContractMatchEngineService` → 事件与 `service/MatchEngineManager` → `disruptor/SaveOrderHandler` → `disruptor/MatchingBusinessHandler` → `book/OrderBook`、`book/RBTreeOrderBook` → 成交及仓位处理。

其中事件分支已经核对；完整前置校验、成交价格规则和跨服务后续处理仍需逐段确认。

## 验证场景

覆盖开仓与平仓、部分成交撤单、保证金不足、强制撤单、恢复初始化。对每个场景同时检查委托、仓位、账户和手续费，避免只验证订单是否成交。
