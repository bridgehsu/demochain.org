---
title: "业务扩展服务"
description: "业务扩展服务：依据 coinex-workspace 源码核对模块与流程。"
---

# 业务扩展服务

## 模块索引

当前工作空间包含 `coinex-otc`、`coinex-partner`、`coinex-partner-admin`、`coinex-robot`、`coinex-quantize`、`coinex-hft`、`coinex-futures3rd`、`coinex-activity`、`coinex-cms`、`coinex-report` 等业务与运营工程。目录名称是源码索引，不代表生产启用清单。

## 期权独立成篇

期权不再列为本节的普通业务扩展，进入[期权交易](/tgex/option/)查看独立的模块、购买、交割与触碰判定流程。现货、合约和期权在导航与业务地图中并列。

## 阅读方法

每个扩展分别核对触发入口、核心状态、账户影响、下游事件及运营查询。当前工作空间没有独立的 lever、margin-trade、agent 一级工程，不把其他代码库的这些模块直接列入本系统。

## 验证场景

为实际启用模块记录一条成功和一条失败路径，再核对对账户与核心交易服务的影响。
