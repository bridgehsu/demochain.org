import type {DocNavGroup} from './docs-manifest';

export const QUANT_TRADING_NAV: DocNavGroup[] = [
    {
        "consensus": "quant-trading",
        "label": "量化交易系统",
        "color": "text-sky-700 dark:text-sky-300",
        "activeBg": "bg-sky-50 dark:bg-sky-400/10",
        "borderColor": "border-sky-200 dark:border-sky-800",
        "rootHref": "/quant-trading",
        "items": [
            {
                "title": "项目概述",
                "slug": [
                    "overview"
                ],
                "href": "/quant-trading/#overview"
            },
            {
                "title": "系统架构与模块职责",
                "slug": [
                    "architecture"
                ],
                "href": "/quant-trading/#architecture"
            },
            {
                "title": "管理后台与运营流程",
                "slug": [
                    "operations"
                ],
                "href": "/quant-trading/#operations"
            },
            {
                "title": "Golang 机器人框架",
                "slug": [
                    "framework"
                ],
                "href": "/quant-trading/#framework"
            },
            {
                "title": "策略任务调度",
                "slug": [
                    "scheduling"
                ],
                "href": "/quant-trading/#scheduling"
            },
            {
                "title": "价格触发与订单状态机",
                "slug": [
                    "execution"
                ],
                "href": "/quant-trading/#execution"
            },
            {
                "title": "交易所接入层",
                "slug": [
                    "exchange"
                ],
                "href": "/quant-trading/#exchange"
            },
            {
                "title": "消息队列与订单持久化",
                "slug": [
                    "persistence"
                ],
                "href": "/quant-trading/#persistence"
            },
            {
                "title": "利润统计与对账",
                "slug": [
                    "profit"
                ],
                "href": "/quant-trading/#profit"
            },
            {
                "title": "密钥管理、日志与告警",
                "slug": [
                    "security"
                ],
                "href": "/quant-trading/#security"
            },
            {
                "title": "部署、恢复与验证",
                "slug": [
                    "deployment"
                ],
                "href": "/quant-trading/#deployment"
            },
            {
                "title": "项目角色与技术价值",
                "slug": [
                    "contribution"
                ],
                "href": "/quant-trading/#contribution"
            }
        ]
    }
];
