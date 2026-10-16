---
title: "服务地图与模块边界"
description: "以实际 Maven 模块为索引定位 TGEX 服务。"
---

# 服务地图与模块边界

## 先区分业务域

| 业务域 | 已发现的模块前缀 | 阅读重点 |
| --- | --- | --- |
| 现货交易 | entrust、entrust-k8s、match | 委托入口、引擎执行、订单状态 |
| 合约交易 | contract-entrust、contract-match | 合约委托、仓位、保证金与风险 |
| 资产钱包 | account、wallet-server、wallet-driver、wallet-admin | 账户变动、链上交互、运营入口 |
| 行情 | market、contract-market、market3rd | 行情生成、聚合与外部数据 |
| 接入与推送 | api、api_v2、web、app、netty-*、user-data-socket | 外部请求与实时结果 |
| 平台及扩展 | user、coin、sysconfig、otc、lever、margin-trade、contract-option-* | 基础资料及独立业务 |

模块存在不等于生产环境全部启用。服务职责先由命名归类，实际调用关系需继续沿接口实现、注入和消费者核对。

## 实际模块索引

以下清单来自本地源码目录中具有 `pom.xml` 的一级模块。路径相对于 `tgex-backend`；它是源码入口清单，不是启动顺序。

| 模块目录 | 构建入口 |
| --- | --- |
| `account-new-cxex-release1.1.1` | `account-new-cxex-release1.1.1/pom.xml` |
| `activity-new-cxex-release1.1.1` | `activity-new-cxex-release1.1.1/pom.xml` |
| `admin-new-cxex-release1.1.1` | `admin-new-cxex-release1.1.1/pom.xml` |
| `agent-admin-master` | `agent-admin-master/pom.xml` |
| `agent-master` | `agent-master/pom.xml` |
| `api-new-cxex-release1.1.1` | `api-new-cxex-release1.1.1/pom.xml` |
| `api_v2-new-cxex-release1.1.1` | `api_v2-new-cxex-release1.1.1/pom.xml` |
| `app-new-cxex-release1.1.1` | `app-new-cxex-release1.1.1/pom.xml` |
| `applet-new-cxex-release1.1.1` | `applet-new-cxex-release1.1.1/pom.xml` |
| `base-log-new-cxex-release1.1.1` | `base-log-new-cxex-release1.1.1/pom.xml` |
| `ca-server-new-cxex-release1.1.1` | `ca-server-new-cxex-release1.1.1/pom.xml` |
| `chainexplorer-new-cxex-release1.1.1` | `chainexplorer-new-cxex-release1.1.1/pom.xml` |
| `cms-new-cxex-release1.1.1` | `cms-new-cxex-release1.1.1/pom.xml` |
| `coin-new-cxex-release1.1.1` | `coin-new-cxex-release1.1.1/pom.xml` |
| `contract-entrust-new-cxex-release1.1.1` | `contract-entrust-new-cxex-release1.1.1/pom.xml` |
| `contract-market-new-cxex-release1.1.1` | `contract-market-new-cxex-release1.1.1/pom.xml` |
| `contract-match-new-cxex-release1.1.1` | `contract-match-new-cxex-release1.1.1/pom.xml` |
| `contract-option-market-new-cxex-release1.1.1` | `contract-option-market-new-cxex-release1.1.1/pom.xml` |
| `contract-option-market-new-new-cxex-release1.1.1` | `contract-option-market-new-new-cxex-release1.1.1/pom.xml` |
| `contract-option-market-touch-cxex-release1.1.1` | `contract-option-market-touch-cxex-release1.1.1/pom.xml` |
| `contract-option-new-cxex-release1.1.1` | `contract-option-new-cxex-release1.1.1/pom.xml` |
| `contract-option-new-new-cxex-release1.1.1` | `contract-option-new-new-cxex-release1.1.1/pom.xml` |
| `contract-option-touch-cxex-release1.1.1` | `contract-option-touch-cxex-release1.1.1/pom.xml` |
| `devops-new-cxex-release1.1.1` | `devops-new-cxex-release1.1.1/pom.xml` |
| `devops-platform-new-cxex-release1.1.1` | `devops-platform-new-cxex-release1.1.1/pom.xml` |
| `entrust-k8s-new-cxex-release1.1.1` | `entrust-k8s-new-cxex-release1.1.1/pom.xml` |
| `entrust-new-cxex-release1.1.1` | `entrust-new-cxex-release1.1.1/pom.xml` |
| `excel-new-cxex-release1.1.1` | `excel-new-cxex-release1.1.1/pom.xml` |
| `excloud-admin-new-cxex-release1.1.1` | `excloud-admin-new-cxex-release1.1.1/pom.xml` |
| `excloud-new-cxex-release1.1.1` | `excloud-new-cxex-release1.1.1/pom.xml` |
| `fmz-api-new-cxex-release1.1.1` | `fmz-api-new-cxex-release1.1.1/pom.xml` |
| `futures3rd-new-cxex-release1.1.1` | `futures3rd-new-cxex-release1.1.1/pom.xml` |
| `hft-new-cxex-release1.1.1` | `hft-new-cxex-release1.1.1/pom.xml` |
| `i18n-new-cxex-release1.1.1` | `i18n-new-cxex-release1.1.1/pom.xml` |
| `idworker-new-cxex-release1.1.1` | `idworker-new-cxex-release1.1.1/pom.xml` |
| `imserver-new-cxex-release1.1.1` | `imserver-new-cxex-release1.1.1/pom.xml` |
| `lever-new-cxex-release1.1.1` | `lever-new-cxex-release1.1.1/pom.xml` |
| `log-new-cxex-release1.1.1` | `log-new-cxex-release1.1.1/pom.xml` |
| `mail-new-cxex-release1.1.1` | `mail-new-cxex-release1.1.1/pom.xml` |
| `margin-trade-new-cxex-release1.1.1` | `margin-trade-new-cxex-release1.1.1/pom.xml` |
| `market-new-cxex-release1.1.1` | `market-new-cxex-release1.1.1/pom.xml` |
| `market3rd-new-cxex-release1.1.1` | `market3rd-new-cxex-release1.1.1/pom.xml` |
| `match-new-cxex-release1.1.1` | `match-new-cxex-release1.1.1/pom.xml` |
| `msg-new-cxex-release1.1.1` | `msg-new-cxex-release1.1.1/pom.xml` |
| `netty-client-new-cxex-release1.1.1` | `netty-client-new-cxex-release1.1.1/pom.xml` |
| `netty-protocol-new-cxex-release1.1.1` | `netty-protocol-new-cxex-release1.1.1/pom.xml` |
| `netty-server-new-cxex-release1.1.1` | `netty-server-new-cxex-release1.1.1/pom.xml` |
| `otc-new-cxex-release1.1.1` | `otc-new-cxex-release1.1.1/pom.xml` |
| `partner-admin-new-cxex-release1.1.1` | `partner-admin-new-cxex-release1.1.1/pom.xml` |
| `partner-new-cxex-release1.1.1` | `partner-new-cxex-release1.1.1/pom.xml` |
| `pay-server-new-cxex-release1.1.1` | `pay-server-new-cxex-release1.1.1/pom.xml` |
| `quantize-new-cxex-release1.1.1` | `quantize-new-cxex-release1.1.1/pom.xml` |
| `raward-new-cxex-release1.1.1` | `raward-new-cxex-release1.1.1/pom.xml` |
| `report-new-cxex-release1.1.1` | `report-new-cxex-release1.1.1/pom.xml` |
| `robot-new-cxex-release1.1.1` | `robot-new-cxex-release1.1.1/pom.xml` |
| `scm-new-cxex-release1.1.1` | `scm-new-cxex-release1.1.1/pom.xml` |
| `security-start-master` | `security-start-master/pom.xml` |
| `slider-new-cxex-develop` | `slider-new-cxex-develop/pom.xml` |
| `sms-new-cxex-release1.1.1` | `sms-new-cxex-release1.1.1/pom.xml` |
| `sysconfig-new-cxex-release1.1.1` | `sysconfig-new-cxex-release1.1.1/pom.xml` |
| `tgpay-new-cxex-release1.1.1` | `tgpay-new-cxex-release1.1.1/pom.xml` |
| `upload-new-cxex-release1.1.1` | `upload-new-cxex-release1.1.1/pom.xml` |
| `user-data-socket-new-cxex-release1.1.1` | `user-data-socket-new-cxex-release1.1.1/pom.xml` |
| `user-new-cxex-release1.1.1` | `user-new-cxex-release1.1.1/pom.xml` |
| `user-relation-new-cxex-release1.1.1` | `user-relation-new-cxex-release1.1.1/pom.xml` |
| `vex_migrate-new-cxex-release1.1.1` | `vex_migrate-new-cxex-release1.1.1/pom.xml` |
| `wallet-admin-new-cxex-release1.1.1` | `wallet-admin-new-cxex-release1.1.1/pom.xml` |
| `wallet-driver-new-cxex-release1.1.1` | `wallet-driver-new-cxex-release1.1.1/pom.xml` |
| `wallet-server-new-cxex-release1.1.1` | `wallet-server-new-cxex-release1.1.1/pom.xml` |
| `web-app-new-cxex-release1.1.1` | `web-app-new-cxex-release1.1.1/pom.xml` |
| `web-new-cxex-release1.1.1` | `web-new-cxex-release1.1.1/pom.xml` |

## 如何确认边界

从模块 POM 的依赖开始，找到启动类和暴露的接口，再定位调用方、Mapper 与消息处理器。保留 API 定义和 provider 实现之间的区别；不能仅凭一个服务引用就认定调用已经发生。
