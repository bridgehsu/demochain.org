---
title: "委托接入与撤单"
description: "现货委托入口与撮合查询的阅读边界。"
---

# 委托接入与撤单

## 服务边界

委托业务位于 `coinex-entrust`，撮合业务位于 `coinex-match`。本工作空间一级目录没有独立的 entrust-k8s 工程，不将其列为现货必经服务。

撮合 provider 内的 `MatchingEntrustService` 暴露缓存委托查询，包括 `selectCacheEntrustById`、`selectCacheEntrustByClientOrderId` 以及批量与分页查询。它是已核对的查询入口，不能作为下单入口使用。

## 从业务动作追源码

1. 在接入模块定位下单 Controller，记录用户、交易对、方向、价格、数量及客户端订单号。
2. 沿调用接口定位 `MatchEngineExecuteService`，核对事件构造和返回结果。
3. 对照 [撮合核心流程](/tgex/spot/matching/) 中的 ADD_ORDER 与 CANCEL_ORDER。
4. 用查询服务观察委托状态，并继续追踪成交记录和资金变动。

## 撤单的关键边界

撤单请求进入系统时，订单可能已经部分成交或全部成交。验证时应以处理时的剩余量与最终结果为准。客户端订单号的唯一范围、重复请求行为与撤单返回码，需以入口实现确认。

## 验证场景

记录同一订单的创建、部分成交、撤单和查询结果；分别验证订单不存在、订单已完成和重复请求。跨模块完整调用链仍需进一步核对。
