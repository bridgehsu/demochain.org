---
title: "策略任务状态机"
description: "覆盖信号发现、执行提交、链上确认及异常处理。"
---

# 策略任务状态机

## 建议状态定义

以下命名为文档建议，与实际代码枚举待核对。

| 状态 | 含义 | 允许的下一步 |
| --- | --- | --- |
| DISCOVERED | 已接收信号 | RESOLVING |
| RESOLVING | 提取地址并识别链 | VALIDATING、REJECTED、RETRY_WAIT |
| VALIDATING | 策略与元数据校验 | PRECHECKING、REJECTED、RETRY_WAIT |
| PRECHECKING | 检查执行条件 | READY、REJECTED、RETRY_WAIT |
| READY | 形成执行意图 | SUBMITTING |
| SUBMITTING | 提交中 | PENDING、UNKNOWN、FAILED |
| PENDING | 已获得提交标识，等待链结果 | CONFIRMED、FAILED、UNKNOWN |
| UNKNOWN | 暂不能判定提交或确认结果 | 继续查询、人工处理 |
| RETRY_WAIT | 可重试阶段等待恢复 | 回到对应的可重试阶段 |
| CONFIRMED | 达到所选链的确认要求 | 终态或按链规则重新核对 |
| REJECTED / FAILED | 规则拒绝或已知失败 | 结束，或显式创建新意图 |

## 转移规则

每次状态变化记录旧状态、新状态、版本、原因和时间。建议使用版本检查或原子条件更新，避免旧 worker 覆盖新状态。任务重试与创建新交易意图分别计数。

## 超时不是链上失败

提交请求超时可能仍已被节点接收，进入 UNKNOWN 后先恢复查询。确认等待超时也不应直接生成一笔新交易。取消本地任务不意味着已经广播的链上交易被取消。

## 恢复与验证

应用重启后按状态恢复：未提交任务重新预检查，已提交任务先追踪标识，未知任务先查询。覆盖并发状态推进、旧结果迟到和异常后重启。
