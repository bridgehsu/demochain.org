---
title: "期权行情与周期数据"
description: "期权行情与周期数据：依据 coinex-workspace 源码核对模块与流程。"
---

# 期权行情与周期数据

## 配套工程

- `coinex-contract-option-market`
- `coinex-contract-option-market-new-new`
- `coinex-contract-option-market-touch`

新版和触碰行情 provider 中均存在 `scheduled/OptionScheduled`、`kline/job/OptionJobsServiceImpl`、`GetThirdKlineScheduled` 及 `kline/ws/manager/JobManager` 等入口。存在这些类并不等于已确认生产行情来源、所有调度开关或调用顺序。

## 行情与结算的边界

业务侧使用 `OptionPeriodRecord` 与 `Period` 组织周期数据。已读取的结算服务会调用 `IOptionKlineCoefficientService.savePeriodPrice(...)`；触碰实现还使用周期最高价、最低价参与判定。因此，周期定义、采样区间和最终结算数据要与界面行情分别核对。

## 需要进一步追踪

从具体交易配置找到 symbol、周期及来源，再定位行情接入、缓存更新、周期价格生成和结算读取。多个版本同时存在时，确认使用的是对应包与配置，不按相似类名混用数据。

## 验证场景

行情中断、周期边界、数据延迟、周期高低价缺失、重启后周期恢复及同一资产不同期次。记录数据时间和来源，比较前端展示与实际结算取值。
