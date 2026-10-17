---
title: "现货撮合核心流程"
description: "从 Disruptor 处理顺序到订单簿分支解析现货撮合。"
---

# 现货撮合核心流程

## 模块与职责

源码模块为 `coinex-match`，实现位于 `matching-provider/src/main/java/com/exch/matching`。撮合处理并非只有价格比较：前置事件处理还接收账户变动和配置变化。

## 已确认的处理顺序

`MatchingEngineManager` 中以 `handleEventsWith(new SaveOrderHandler(...)).then(new MatchingBusinessHandler(...))` 连接两个处理阶段。

```text
RequestMatchEvent
    → SaveOrderHandler
    → MatchingBusinessHandler
    → OrderBook 的对应操作
```

`MatchingBusinessHandler.onEvent` 首先判断引擎的 `isRunning`，然后检查 `event.isSaveFile()`。只有通过这个前置标记的事件才进入撮合分支。这个标记不能直接等同于整笔业务已完成或数据库事务已提交。

| 请求类型 | 已核对的处理 |
| --- | --- |
| ADD_ORDER | 从 MatchingEntrustDTO 取订单 ID、方向、价格、数量和交易对，调用 orderbook.enter |
| CANCEL_ORDER | 调用 orderbook.cancel(id, 0) |
| INIT_MATCH | 调用 orderbook.enterInit，使用 leftCount 和初始化完成标记 |

## 为什么分阶段

前一阶段处理请求及其前置状态，后一阶段才执行订单簿操作。阅读失败路径时，必须观察前置标记和运行状态，不能仅看请求是否进入队列。

## 异常路径

处理器记录异常，对 `MatchingSaveFileException` 继续抛出；其他异常在该处理器中被捕获。`finally` 调用 `ResizeSemaphore.release()`。因此，日志中出现异常后，还需检查事件结果、引擎状态和上层异常策略，不能假设系统自动重试。

## 源码阅读路线

1. `service/MatchingEngineManager.java`：事件处理顺序、publish、引擎管理。
2. `disruptor/SaveOrderHandler.java`：前置处理与事件结果。
3. `disruptor/MatchingBusinessHandler.java`：订单簿调用。
4. `book/OrderBook.java` 与 `book/RBTreeOrderBook.java`：订单簿接口与实现。
5. `processor/MatchingEngineProcessor.java`：沿成交回调继续追踪。

## 验证场景

在隔离环境中覆盖可立即成交、无法成交、部分成交后撤单、重复撤单和初始化剩余数量。分别记录请求结果、订单簿余量、委托状态及账户变化。价格优先和同价排序的完整规则，需要进一步结合订单簿代码与用例验证。
