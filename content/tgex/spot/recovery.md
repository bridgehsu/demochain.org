---
title: "持久化与恢复"
description: "定位现货撮合的本地状态、初始化和恢复入口。"
---

# 持久化与恢复

## 已发现的入口

现货撮合模块中有 `LevelDBService`、`MatchingBootstrap`、`restart/AbstractRestart`、`restart/RestartListener` 以及 `SaveOrderHandler`。这些是恢复链路的阅读起点；本节尚未验证它们之间的完整执行顺序。

## 已确认的初始化分支

`MatchingBusinessHandler` 对 INIT_MATCH 使用 `MatchingEntrustDTO.leftCount` 重建订单簿，并传递 `event.isInitCompleted()`。因此重建时需要关注未成交数量，不能直接用原始委托量替代。

## 需要分别确认的状态

| 状态 | 核对内容 |
| --- | --- |
| 本地记录 | 写入内容、成功标记、失败后的引擎行为 |
| 活跃订单 | 哪些状态能够重新入簿，如何保持顺序 |
| 账户状态 | 冻结和可用余额的恢复来源 |
| 初始化完成 | 何时允许新的业务请求进入 |

## 恢复验证

在测试环境先保存订单、成交与账户基线，再停机恢复。比较恢复前后的挂单剩余量、成交数量和账户余额；另外覆盖部分成交订单、撤单事件和恢复期间的新请求。恢复完成的日志不能代替业务数据核对。
