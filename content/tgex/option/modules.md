---
title: "模块与版本边界"
description: "模块与版本边界：依据 coinex-workspace 源码核对模块与流程。"
---

# 模块与版本边界

## 三版本文档

- [版本一：阈值型二元期权](/tgex/option/threshold/)
- [版本二：涨跌型二元期权](/tgex/option/direction/)
- [版本三：触碰型二元期权](/tgex/option/touch/)

## 顶层工程

| 业务实现 | Java 包 | 配套行情工程 |
| --- | --- | --- |
| coinex-contract-option-new-cxex | com.exch.contract.option | coinex-contract-option-market |
| coinex-contract-option-new-new | com.exch.contract.optionnew | coinex-contract-option-market-new-new |
| coinex-contract-option-touch | com.exch.contract.optiontouch | coinex-contract-option-market-touch |

对应关系按包名和工程结构整理，不表示运行时一定互相调用。

## 工程内部边界

新版实现包含 `contract-option-new-api`、`contract-option-new-core`、`contract-option-new-provider`、`contract-option-new-es`；触碰实现有对应的 touch 子模块。API 定义接口与模型，provider 中包含订单、账户和结算服务，core 中可见周期模型等公共代码；实际读写边界仍需沿使用点核对。

## 版本与聚合目录

`coinex-option` 下保留六个 release 命名目录，顶层也有对应业务与行情工程。文档以顶层明确路径标识来源，不把相同类名当作同一实现，不推断旧版已经停用或新版已经替代。

## 核对方法

对照实际启动产物、部署配置和入口调用方确定生效版本，再核对交易配置、期次状态、账户流水和行情来源。业务路径不因名称包含 contract 就自动归入合约撮合。
