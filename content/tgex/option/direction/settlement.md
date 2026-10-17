---
title: "涨跌型二元期权：交割与账户处理"
description: "涨跌型二元期权：交割与账户处理的源码工程、核心流程与验证边界。"
---

# 涨跌型二元期权：交割与账户处理

## 已核对的调度入口

新版 provider 的 `scheduled/OptionCycleScheduled.java` 中，`statementOrder()` 在 `TestJobConfig.getEnableRunJob()` 为真时调用 `IOptionOrderService.statementOrder()`。源码注解为 `@Scheduled(cron="10/20 * * * * ?")`；旁边的“每分钟”注释与该表达式并不一致，不能把注释当作实际频率。

## 服务调用

新版 `OptionOrderServiceImpl.statementOrder()` 可见对 `SettlementOrderService.settlementOfAccounts(...)` 与 `singleSettlement(...)` 的调用。前者按期次批量更新订单为 EXEC，并保存周期价格；即使没有用户订单，也会保存期次价格后返回对应结果。

`SettlementOrderService.singleSettlement(...)` 带事务注解，接收收盘价、交割时间、交易配置、订单与 `hasPriceLimit`，读取方向及买入时价格并推进结算。订单状态和资金变更应在同一订单上下文下追踪。

## 状态与枚举边界

`OptionOrderStatusEnum` 中可见 WAIT_OPEN、OPEN、WAIT、EXEC、OVER、REFUND，以及方向相关枚举项。它们是定义清单，不能未经分支核对就画成所有订单必经的单向状态链。期次状态与用户订单状态也应分别记录。

## 账户服务

相同业务模块的 `provider/ContractOptionEngineService` 暴露 `userRecharge`、`userWithdraw`、`updateUserAccount`、`accountManualDeduction`。这些是期权账户入口，不应因为类名含 Engine 就描述为下单撮合入口。下单入口应从订单服务追踪。

## 验证场景

到期重复调度、同一期次无订单、周期价格缺失、订单更新失败、账户入账失败与服务重启。必须结合 Mapper 条件更新及账户幂等实现验证重复结算，不能仅靠调度频率或事务注解断言安全。


## 本版本的价格判定与金额

`singleSettlement(...)` 将 `buyTimePrice` 与 `closePrice` 比较：UP 在买入价小于到期价时命中，DOWN 在买入价大于到期价时命中。命中时 `realRation` 使用订单 `ration`，未命中为零。

资金变动分支按 `orderPrice × 命中倍率` 计算，同时处理订单冻结量；展示字段 `delivery_price` 在 Mapper 中按 `order_price × realRation - order_price` 更新。资金到账与净收益字段不能当作同一口径。

这不是普通香草期权按行权价计算内在价值的结算模型。等价、hasPriceLimit 为假及退还分支应单独验证。
