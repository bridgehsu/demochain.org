---
title: "服务地图与模块边界"
description: "服务地图与模块边界：依据 coinex-workspace 源码核对模块与流程。"
---

# 服务地图与模块边界

## 源码依据

数字货币系统对应 `coinex-workspace` 工作空间。下表由该工作空间的实际一级目录整理，路径相对于工作空间根目录。文档站点是独立的 `demochain.org` 工程。

## 三类核心交易业务

| 业务域 | 业务工程 | 配套行情工程 |
| --- | --- | --- |
| 现货交易 | coinex-entrust、coinex-match | coinex-market、coinex-market3rd |
| 合约交易 | coinex-contract-entrust、coinex-contract-match | coinex-contract-market |
| 期权交易 | coinex-contract-option-new-cxex、coinex-contract-option-new-new、coinex-contract-option-touch | coinex-contract-option-market、coinex-contract-option-market-new-new、coinex-contract-option-market-touch |

期权独立包含期次、购买、交割和账户处理，不能简单套用现货或合约订单簿链路。三套期权实现需要分别核对，不由目录名称推断生产启用关系。

## 基础服务与客户端

账户与资产入口包括 `coinex-account`、`coinex-wallet`、`coinex-pay`；基础资料包括 `coinex-user`、`coinex-coin`、`coinex-sysconfig`。接入与运营入口包括 `coinex-app`、`coinex-applet`、`coinex-admin`、`coinex-partner-admin`，客户端分为 `coinex-ui-pc`、`coinex-ui-app`、`coinex-ui-admin`、`coinex-ui-partner`。

目录存在只说明有相应源码，实际职责需继续沿 Controller、接口实现和调用方确认。未将其他代码库里的 api_v2、独立 wallet-driver、user-data-socket、lever 等名称列为本工作空间一级工程。

## 实际一级目录清单

| 目录 | 类型 | 入口 |
| --- | --- | --- |
| `coinex` | Maven 工程 | `coinex/pom.xml` |
| `coinex-account` | Maven 工程 | `coinex-account/pom.xml` |
| `coinex-activity` | Maven 工程 | `coinex-activity/pom.xml` |
| `coinex-admin` | Maven 工程 | `coinex-admin/pom.xml` |
| `coinex-app` | Maven 工程 | `coinex-app/pom.xml` |
| `coinex-applet` | Maven 工程 | `coinex-applet/pom.xml` |
| `coinex-base-log` | Maven 工程 | `coinex-base-log/pom.xml` |
| `coinex-cms` | Maven 工程 | `coinex-cms/pom.xml` |
| `coinex-coin` | Maven 工程 | `coinex-coin/pom.xml` |
| `coinex-common` | Maven 工程 | `coinex-common/pom.xml` |
| `coinex-contract` | 工作目录 / 聚合目录 | `coinex-contract/` |
| `coinex-contract-entrust` | Maven 工程 | `coinex-contract-entrust/pom.xml` |
| `coinex-contract-market` | Maven 工程 | `coinex-contract-market/pom.xml` |
| `coinex-contract-match` | Maven 工程 | `coinex-contract-match/pom.xml` |
| `coinex-contract-option-market` | Maven 工程 | `coinex-contract-option-market/pom.xml` |
| `coinex-contract-option-market-new-new` | Maven 工程 | `coinex-contract-option-market-new-new/pom.xml` |
| `coinex-contract-option-market-touch` | Maven 工程 | `coinex-contract-option-market-touch/pom.xml` |
| `coinex-contract-option-new-cxex` | Maven 工程 | `coinex-contract-option-new-cxex/pom.xml` |
| `coinex-contract-option-new-new` | Maven 工程 | `coinex-contract-option-new-new/pom.xml` |
| `coinex-contract-option-touch` | Maven 工程 | `coinex-contract-option-touch/pom.xml` |
| `coinex-cskefu` | 工作目录 / 聚合目录 | `coinex-cskefu/` |
| `coinex-devops` | 工作目录 / 聚合目录 | `coinex-devops/` |
| `coinex-entrust` | Maven 工程 | `coinex-entrust/pom.xml` |
| `coinex-excel` | Maven 工程 | `coinex-excel/pom.xml` |
| `coinex-excloud` | Maven 工程 | `coinex-excloud/pom.xml` |
| `coinex-futures3rd` | Maven 工程 | `coinex-futures3rd/pom.xml` |
| `coinex-hft` | Maven 工程 | `coinex-hft/pom.xml` |
| `coinex-i18n` | Maven 工程 | `coinex-i18n/pom.xml` |
| `coinex-idworker` | Maven 工程 | `coinex-idworker/pom.xml` |
| `coinex-log` | Maven 工程 | `coinex-log/pom.xml` |
| `coinex-mail` | Maven 工程 | `coinex-mail/pom.xml` |
| `coinex-market` | Maven 工程 | `coinex-market/pom.xml` |
| `coinex-market3rd` | Maven 工程 | `coinex-market3rd/pom.xml` |
| `coinex-match` | Maven 工程 | `coinex-match/pom.xml` |
| `coinex-msg` | Maven 工程 | `coinex-msg/pom.xml` |
| `coinex-netty-client` | Maven 工程 | `coinex-netty-client/pom.xml` |
| `coinex-netty-protocol` | Maven 工程 | `coinex-netty-protocol/pom.xml` |
| `coinex-netty-server` | Maven 工程 | `coinex-netty-server/pom.xml` |
| `coinex-option` | 工作目录 / 聚合目录 | `coinex-option/` |
| `coinex-otc` | Maven 工程 | `coinex-otc/pom.xml` |
| `coinex-parent` | 工作目录 / 聚合目录 | `coinex-parent/` |
| `coinex-partner` | Maven 工程 | `coinex-partner/pom.xml` |
| `coinex-partner-admin` | Maven 工程 | `coinex-partner-admin/pom.xml` |
| `coinex-pay` | Maven 工程 | `coinex-pay/pom.xml` |
| `coinex-quantize` | Maven 工程 | `coinex-quantize/pom.xml` |
| `coinex-raward` | Maven 工程 | `coinex-raward/pom.xml` |
| `coinex-report` | Maven 工程 | `coinex-report/pom.xml` |
| `coinex-robot` | Maven 工程 | `coinex-robot/pom.xml` |
| `coinex-scm` | Maven 工程 | `coinex-scm/pom.xml` |
| `coinex-sms` | Maven 工程 | `coinex-sms/pom.xml` |
| `coinex-sysconfig` | Maven 工程 | `coinex-sysconfig/pom.xml` |
| `coinex-tasks` | 工作目录 / 聚合目录 | `coinex-tasks/` |
| `coinex-ui-admin` | 前端 / Node 工程 | `coinex-ui-admin/package.json` |
| `coinex-ui-app` | 前端 / Node 工程 | `coinex-ui-app/package.json` |
| `coinex-ui-partner` | 前端 / Node 工程 | `coinex-ui-partner/package.json` |
| `coinex-ui-pc` | 前端 / Node 工程 | `coinex-ui-pc/package.json` |
| `coinex-upload` | Maven 工程 | `coinex-upload/pom.xml` |
| `coinex-user` | Maven 工程 | `coinex-user/pom.xml` |
| `coinex-user-relation` | Maven 工程 | `coinex-user-relation/pom.xml` |
| `coinex-wallet` | Maven 工程 | `coinex-wallet/pom.xml` |

## 聚合目录与重复源码

`coinex-option` 内还存在六个 release 命名的期权及行情目录；工作空间同时有顶层 `coinex-contract-option-*` 工程。不能把它们相加当作十二套正在运行的独立服务。部署采用哪个 checkout、哪些版本同时启用，需通过构建和部署配置核实。

## 核对范围

现货与合约撮合关键处理器、现货引擎管理器及合约引擎服务已在当前工作空间重新核对；期权章节核对了新版购买入口、结算调度及触碰结算分支。外围服务保留阅读指南属性，不把目录归类当成完整调用链证明。
