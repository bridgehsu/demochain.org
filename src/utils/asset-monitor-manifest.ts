import type {DocNavGroup} from './docs-manifest';

export const ASSET_MONITOR_NAV: DocNavGroup[] = [
    {
        "consensus": "guide",
        "label": "架构与阅读路线",
        "color": "text-emerald-600 dark:text-emerald-400",
        "activeBg": "bg-emerald-50 dark:bg-emerald-500/10",
        "borderColor": "border-emerald-300 dark:border-emerald-700",
        "rootHref": "/asset-monitor/guide",
        "items": [
            {
                "title": "系统目标与核心流程",
                "slug": [
                    "guide",
                    "overview"
                ],
                "href": "/asset-monitor/guide/overview"
            },
            {
                "title": "模块边界与个人贡献",
                "slug": [
                    "guide",
                    "modules"
                ],
                "href": "/asset-monitor/guide/modules"
            }
        ]
    },
    {
        "consensus": "signals",
        "label": "信号接入与识别",
        "color": "text-emerald-600 dark:text-emerald-400",
        "activeBg": "bg-emerald-50 dark:bg-emerald-500/10",
        "borderColor": "border-emerald-300 dark:border-emerald-700",
        "rootHref": "/asset-monitor/signals",
        "items": [
            {
                "title": "异步信号接入",
                "slug": [
                    "signals",
                    "ingestion"
                ],
                "href": "/asset-monitor/signals/ingestion"
            },
            {
                "title": "CA 地址提取与链路识别",
                "slug": [
                    "signals",
                    "address"
                ],
                "href": "/asset-monitor/signals/address"
            },
            {
                "title": "重复信号与事件关联",
                "slug": [
                    "signals",
                    "dedup"
                ],
                "href": "/asset-monitor/signals/dedup"
            }
        ]
    },
    {
        "consensus": "chains",
        "label": "多链 Adapter",
        "color": "text-emerald-600 dark:text-emerald-400",
        "activeBg": "bg-emerald-50 dark:bg-emerald-500/10",
        "borderColor": "border-emerald-300 dark:border-emerald-700",
        "rootHref": "/asset-monitor/chains",
        "items": [
            {
                "title": "统一能力与链路差异",
                "slug": [
                    "chains",
                    "interface"
                ],
                "href": "/asset-monitor/chains/interface"
            },
            {
                "title": "RPC 与 WebSocket 节点接入",
                "slug": [
                    "chains",
                    "nodes"
                ],
                "href": "/asset-monitor/chains/nodes"
            },
            {
                "title": "资产元数据与状态校验",
                "slug": [
                    "chains",
                    "metadata"
                ],
                "href": "/asset-monitor/chains/metadata"
            }
        ]
    },
    {
        "consensus": "strategy",
        "label": "策略与任务调度",
        "color": "text-emerald-600 dark:text-emerald-400",
        "activeBg": "bg-emerald-50 dark:bg-emerald-500/10",
        "borderColor": "border-emerald-300 dark:border-emerald-700",
        "rootHref": "/asset-monitor/strategy",
        "items": [
            {
                "title": "策略校验与执行预检查",
                "slug": [
                    "strategy",
                    "validation"
                ],
                "href": "/asset-monitor/strategy/validation"
            },
            {
                "title": "策略任务状态机",
                "slug": [
                    "strategy",
                    "state-machine"
                ],
                "href": "/asset-monitor/strategy/state-machine"
            },
            {
                "title": "协程、Channel 与任务调度",
                "slug": [
                    "strategy",
                    "scheduling"
                ],
                "href": "/asset-monitor/strategy/scheduling"
            }
        ]
    },
    {
        "consensus": "transactions",
        "label": "交易执行与追踪",
        "color": "text-emerald-600 dark:text-emerald-400",
        "activeBg": "bg-emerald-50 dark:bg-emerald-500/10",
        "borderColor": "border-emerald-300 dark:border-emerald-700",
        "rootHref": "/asset-monitor/transactions",
        "items": [
            {
                "title": "交易构造与签名边界",
                "slug": [
                    "transactions",
                    "construction"
                ],
                "href": "/asset-monitor/transactions/construction"
            },
            {
                "title": "执行提交与广播结果",
                "slug": [
                    "transactions",
                    "submission"
                ],
                "href": "/asset-monitor/transactions/submission"
            },
            {
                "title": "确认、超时与失败重试",
                "slug": [
                    "transactions",
                    "confirmation"
                ],
                "href": "/asset-monitor/transactions/confirmation"
            }
        ]
    },
    {
        "consensus": "redis",
        "label": "Redis 与并发控制",
        "color": "text-emerald-600 dark:text-emerald-400",
        "activeBg": "bg-emerald-50 dark:bg-emerald-500/10",
        "borderColor": "border-emerald-300 dark:border-emerald-700",
        "rootHref": "/asset-monitor/redis",
        "items": [
            {
                "title": "去重、状态与缓存设计",
                "slug": [
                    "redis",
                    "keys"
                ],
                "href": "/asset-monitor/redis/keys"
            },
            {
                "title": "执行锁与幂等控制",
                "slug": [
                    "redis",
                    "locking"
                ],
                "href": "/asset-monitor/redis/locking"
            }
        ]
    },
    {
        "consensus": "operations",
        "label": "运行与复盘",
        "color": "text-emerald-600 dark:text-emerald-400",
        "activeBg": "bg-emerald-50 dark:bg-emerald-500/10",
        "borderColor": "border-emerald-300 dark:border-emerald-700",
        "rootHref": "/asset-monitor/operations",
        "items": [
            {
                "title": "日志、告警与结果追踪",
                "slug": [
                    "operations",
                    "observability"
                ],
                "href": "/asset-monitor/operations/observability"
            },
            {
                "title": "异常场景与验证清单",
                "slug": [
                    "operations",
                    "verification"
                ],
                "href": "/asset-monitor/operations/verification"
            }
        ]
    }
];
