---
title: "触碰期权判定"
description: "触碰期权判定：依据 coinex-workspace 源码核对模块与流程。"
---

# 触碰期权判定

## 独立实现

`coinex-contract-option-touch` README 标注触碰二元期权业务，包名为 `com.exch.contract.optiontouch`。不能把其结算规则直接替换为新版普通方向期权的收盘价比较。

## 已核对的结算输入

`contract-option-touch-provider/src/main/java/com/exch/contract/optiontouch/service/SettlementOrderService.java` 的 `singleSettlement(...)` 接收 `Period`，读取 `shou`、`gao`、`di`，分别参与收盘与区间高低价处理。

代码用 `buyTimePrice` 与 `directionRate` 计算目标价，再按方向、幅度正负及区间高低价比较判定。触及目标边界时，代码包含 `>=`、`<`、`<=`、`>` 不同分支，应按分支验证，不能简化为统一的大于规则。

## 最终结果还受其他分支影响

在初步价格判定后，代码还调用 `orderService.getOrderWL(orderId)`；结果非空时会调用 `doUpdateOrderPriceAction(...)` 并覆盖 `isWin`。因此，当前实现不能被文档描述为“仅由公开市场价格决定结果”。这一分支的配置来源、权限与生效范围需继续审查。

代码还包含 `hasPriceLimit` 为假时的 REFUND 分支，以及首赠金额相关结算分支。触碰实现的 winRatio 计算与新版实现不同，不能共用未核对的收益公式。

## 验证场景

幅度为正或负、方向不同、价格恰等于目标、区间最高最低价不同、结果覆盖存在或为空、退还分支、首赠金额和重复结算。按最终订单记录与资金流水确认结果。
