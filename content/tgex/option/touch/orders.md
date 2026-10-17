---
title: "触碰型二元期权：期次与购买流程"
description: "触碰型二元期权：期次与购买流程的源码工程、核心流程与验证边界。"
---

# 触碰型二元期权：期次与购买流程

## 核对入口

`coinex-contract-option-touch/contract-option-touch-provider/src/main/java/com/exch/contract/optiontouch/service/OptionOrderServiceImpl.java` 的 `add(OptionOrder, User)`。与其他两版本不同，此入口显式接收 User。

## 已读取的处理顺序

1. 先查询首赠金额；该值大于零时检查购买金额限制及用户当前订单、弹窗相关缓存。
2. 校验期次 ID、金额和方向，并按本方法设置金额精度。
3. 进入用户级同步块，设置订单时间并查开放期次。
4. 用 `Long.parseLong(scene) + DateUtil.MY_SECOND` 与当前秒时间比较是否超出窗口；不能直接替换成版本二的时间解析与截止规则。
5. 检查期次 OPEN、用户及交易配置，调用 `compareOrderVal`。
6. 核对商户停止买入开关后调用 `addOrder(...)`。

首赠相关缓存拦截在该入口具有条件，不能描述为所有订单无条件执行同一检查。用户级同步块只说明进程内互斥。

## 需要保留的订单上下文

购买时价格、方向、方向幅度、所属期次、配置倍率和首赠相关状态。具体 directionRate 的合法范围需对照参数校验实现，不只看前端输入。

## 验证场景

无首赠、有首赠且金额不足、当前订单冲突、购买时间边界、商户停买、不同方向幅度及重复请求。
