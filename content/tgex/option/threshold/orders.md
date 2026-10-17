---
title: "阈值型二元期权：期次与购买流程"
description: "阈值型二元期权：期次与购买流程的源码工程、核心流程与验证边界。"
---

# 阈值型二元期权：期次与购买流程

## 已核对入口

`coinex-contract-option-new-cxex/contract-option-provider/src/main/java/com/exch/contract/option/service/OptionOrderServiceImpl.java` 的 `add(OptionOrder)`。

## 处理顺序

1. 设置订单时间与创建、更新时间。
2. 从 Redis 开放期次列表查找期次；列表不存在时查期次服务。
3. 期次不存在则返回错误；存在则填入交易配置 ID 并检查 OPEN 状态。
4. 查询用户，核对交易配置，写入商户标识。
5. 调用 `compareOrderVal` 检查订单参数。
6. 查询商户交易配置，停止买入时返回错误。
7. 进入 `addOrder(...)`。

这是本版本已读取的 add 方法，不将涨跌版本中的当前订单缓存检查和截止窗口校验自动视为本版本行为。调用链其他位置是否还有相同限制，需要继续追踪。

## 关键关联

订单与 `OptionPeriodRecord`、`OptionPeriodRecordRatio` 关联；后者包含后续结算使用的方向阈值与倍率。期次、方向与收益配置需要分别记录。

## 验证场景

期次缺失、期次关闭、用户不存在、商户停买、阈值配置缺失和重复购买。账户变更与事务边界继续沿 addOrder 及其调用方核对。
