---
title: "期次与购买流程"
description: "期次与购买流程：依据 coinex-workspace 源码核对模块与流程。"
---

# 期次与购买流程

## 核对入口

`coinex-contract-option-new-new/contract-option-new-provider/src/main/java/com/exch/contract/optionnew/service/OptionOrderServiceImpl.java` 的 `add(OptionOrder)`。

## 已读取的处理顺序

1. 校验期次 ID、下单金额字段 `orderPrice` 和方向参数，按代码规则调整 `orderPrice` 精度。
2. 使用用户级 `UserLockUtils` 同步块处理本次购买。
3. 优先从 Redis 开放期次列表查找期次；缓存列表不存在时调用期次查询服务。
4. 检查用户当前订单及结果弹窗相关缓存，命中时返回对应错误。
5. 根据期次 scene 解析交割时间，用 `OptionConstants.DELIVERY_TIME_DURATION` 检查购买截止窗口。
6. 确认期次为 OPEN，核对用户、交易配置及 `compareOrderVal` 校验结果。
7. 检查商户交易配置是否停止买入，再调用 `addOrder(...)`。

截止窗口按常量值和使用点核对，不能仅凭“最后 10 秒”的注释认定生产参数。用户级 synchronized 是进程内机制，不能据此宣称跨实例全局防重。

## 期次、方向与订单分开

`OptionPeriodRecord` 表示期次，`OptionOrder` 表示用户订单。方向枚举可见 UP、DOWN、TIE，但某个方向是否能购买还要看交易配置及校验分支，不由枚举存在直接得出。

## 后续核对

`addOrder` 后续账户变更、落库与异常回退需要继续追踪对应实现。入口存在事务注解，不代表所有远程调用都被同一事务覆盖。

## 验证场景

期次不存在、期次不开放、临近截止、用户已有当前订单、商户停买、参数不合法、双实例重复购买、购买后账户处理失败。
