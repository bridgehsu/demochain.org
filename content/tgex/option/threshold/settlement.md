---
title: "阈值型二元期权：结果判定与结算"
description: "阈值型二元期权：结果判定与结算的源码工程、核心流程与验证边界。"
---

# 阈值型二元期权：结果判定与结算

## 核对位置

`coinex-contract-option-new-cxex` provider 的 `OptionOrderServiceImpl.hasPriceLimit(...)`。

## 结果判定

方法先将传入的 `priceLimit` 乘以 100，再按订单关联的 `OptionPeriodRecordRatio` 读取 `direction`、`ratio`。

| 方向 | 已读取分支的命中条件 |
| --- | --- |
| UP | 缩放后的 priceLimit > direction |
| DOWN | 缩放后的 priceLimit 取负后 > direction |
| TIE | priceLimit 的绝对值 <= 看平配置中的 direction |

这里记录的是该方法的代码比较关系。`priceLimit` 的计算来源和方向单位需继续沿调用方确认，不把变量名直接解释成涨幅百分比。

## 结算动作

从期次对应 Redis 列表读取订单，代码将原列表重命名为临时 Key，再更新订单交割时间、状态和倍率。命中时用配置倍率，未命中时倍率为零；批量更新订单、保存周期价格后，构造账户变更，`totalChange` 按订单金额乘以命中倍率或零计算。

重命名的代码意图是减少重复处理；不能由此认定数据库、账户与 Redis 之间已经满足全链路幂等。失败后如何恢复临时列表仍需专项验证。

## 与版本二的差异

本版本按期次变动和配置阈值判定；版本二直接比较订单买入价与到期价。两者不能共用结果判定说明。

## 验证场景

阈值恰好相等、看平边界、涨跌方向、临时列表重命名后进程退出、批量更新失败和账户更新失败。
