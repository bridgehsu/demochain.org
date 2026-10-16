---
title: "账户与资金流水"
description: "账户与资金流水的模块索引、流程阅读方法与验证场景。"
---

# 账户与资金流水

## 模块索引

`account、match、contract-match`。完整目录名见[服务地图](/tgex/guide/services/)。

## 当前核对范围

账户余额与业务状态需要一起阅读。现货 SaveOrderHandler 的事件分支包含 RECHARGE、WITHDRAW、UPDATE_USER_ACCOUNT；合约引擎服务也暴露账户相关入口。因此资金变动不能仅从 account 模块单独理解。

## 核心流程阅读方法

先选一笔转入或交易，确认可用、冻结和流水的变更位置；继续核对跨服务请求的唯一标识、失败响应和补偿路径。

## 验证场景

检查失败前后余额、冻结量、流水与委托是否一致；重复处理同一业务请求，确认没有重复入账。
