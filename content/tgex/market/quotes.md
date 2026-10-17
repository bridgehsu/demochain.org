---
title: "现货、合约与期权行情"
description: "现货、合约与期权行情的模块索引、流程阅读方法与验证场景。"
---

# 现货、合约与期权行情

## 模块索引

`coinex-market、coinex-contract-market、coinex-market3rd、coinex-contract-option-market、coinex-contract-option-market-new-new、coinex-contract-option-market-touch`。完整目录名见[服务地图](/tgex/guide/services/)。

## 当前核对范围

现货、合约、外部行情和期权相关行情目录分别存在。成交价、盘口价格与用于风险计算的价格，必须按消费者区分，不能统一当作同一种价格。

## 核心流程阅读方法

从某个交易对的一个行情更新开始，查找输入消息、聚合逻辑、缓存及输出。K 线继续核对时间窗口、成交量口径和空窗口处理。

## 验证场景

比较成交、深度与 K 线的价格和数量；覆盖延迟、重复消息、断流恢复与时间窗口边界。
