---
title: "仓位、保证金与强平"
description: "合约风险处理的服务及数据入口。"
---

# 仓位、保证金与强平

## 已发现的服务与实体

- `ContractMatchEngineService`：`addMargin`、`subMargin`、`changeContractLever`、`getActualPosition`、`getActualAccount` 和 `userContractStatus`。
- `ContractMatchLeverService`、`ContractForceDetailService`：杠杆与强平相关服务入口。
- `ContractPosition`、`UserContractPositionCache`、`UserContractAccountCache`：仓位及账户相关模型与缓存。
- `ContractRiskReserveCache` 和对应 Mapper：风险准备金相关数据入口。

以上为源码索引，不足以证明风险检查的触发顺序或具体公式。

## 建议按状态变化阅读

开仓成交后先查仓位如何建立，再查保证金、手续费和可用余额的变化；平仓则继续查持仓减少、盈亏结算和冻结释放。全仓与逐仓分支应分别记录。

## 强平链路需要确认什么

触发价格来自哪里，风险扫描由谁调度，如何计算风险状态，是否先撤销挂单，如何生成强平相关记录，以及失败后如何再次处理。每一步都应标明服务、输入、状态写入和幂等依据。

## 验证方法

在隔离环境构造临界仓位，对照调整保证金前后、价格变动前后和重复风险检查后的结果。本文不提供未核对的强平价格公式；公式、精度及舍入规则应逐一引用实现后补充。
