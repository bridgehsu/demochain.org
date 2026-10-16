import type {DocNavGroup} from './docs-manifest';

export const TGEX_NAV: DocNavGroup[] = [
    {
        "consensus": "guide",
        "label": "开始阅读",
        "color": "text-cyan-600 dark:text-cyan-400",
        "activeBg": "bg-cyan-50 dark:bg-cyan-500/10",
        "borderColor": "border-cyan-300 dark:border-cyan-700",
        "rootHref": "/tgex/guide",
        "items": [
            {
                "title": "序言与阅读路线",
                "slug": [
                    "guide",
                    "preface"
                ],
                "href": "/tgex/guide/preface"
            },
            {
                "title": "服务地图与模块边界",
                "slug": [
                    "guide",
                    "services"
                ],
                "href": "/tgex/guide/services"
            }
        ]
    },
    {
        "consensus": "spot",
        "label": "现货交易",
        "color": "text-cyan-600 dark:text-cyan-400",
        "activeBg": "bg-cyan-50 dark:bg-cyan-500/10",
        "borderColor": "border-cyan-300 dark:border-cyan-700",
        "rootHref": "/tgex/spot",
        "items": [
            {
                "title": "委托接入与撤单",
                "slug": [
                    "spot",
                    "orders"
                ],
                "href": "/tgex/spot/orders"
            },
            {
                "title": "现货撮合核心流程",
                "slug": [
                    "spot",
                    "matching"
                ],
                "href": "/tgex/spot/matching"
            },
            {
                "title": "持久化与恢复",
                "slug": [
                    "spot",
                    "recovery"
                ],
                "href": "/tgex/spot/recovery"
            }
        ]
    },
    {
        "consensus": "contract",
        "label": "合约交易",
        "color": "text-cyan-600 dark:text-cyan-400",
        "activeBg": "bg-cyan-50 dark:bg-cyan-500/10",
        "borderColor": "border-cyan-300 dark:border-cyan-700",
        "rootHref": "/tgex/contract",
        "items": [
            {
                "title": "合约委托与条件单",
                "slug": [
                    "contract",
                    "orders"
                ],
                "href": "/tgex/contract/orders"
            },
            {
                "title": "合约撮合核心流程",
                "slug": [
                    "contract",
                    "matching"
                ],
                "href": "/tgex/contract/matching"
            },
            {
                "title": "仓位、保证金与强平",
                "slug": [
                    "contract",
                    "risk"
                ],
                "href": "/tgex/contract/risk"
            },
            {
                "title": "资金费率",
                "slug": [
                    "contract",
                    "funding"
                ],
                "href": "/tgex/contract/funding"
            }
        ]
    },
    {
        "consensus": "assets",
        "label": "资产与钱包",
        "color": "text-cyan-600 dark:text-cyan-400",
        "activeBg": "bg-cyan-50 dark:bg-cyan-500/10",
        "borderColor": "border-cyan-300 dark:border-cyan-700",
        "rootHref": "/tgex/assets",
        "items": [
            {
                "title": "账户与资金流水",
                "slug": [
                    "assets",
                    "accounts"
                ],
                "href": "/tgex/assets/accounts"
            },
            {
                "title": "充值、提现与钱包",
                "slug": [
                    "assets",
                    "wallet"
                ],
                "href": "/tgex/assets/wallet"
            }
        ]
    },
    {
        "consensus": "market",
        "label": "行情与推送",
        "color": "text-cyan-600 dark:text-cyan-400",
        "activeBg": "bg-cyan-50 dark:bg-cyan-500/10",
        "borderColor": "border-cyan-300 dark:border-cyan-700",
        "rootHref": "/tgex/market",
        "items": [
            {
                "title": "现货与合约行情",
                "slug": [
                    "market",
                    "quotes"
                ],
                "href": "/tgex/market/quotes"
            },
            {
                "title": "用户数据与实时推送",
                "slug": [
                    "market",
                    "push"
                ],
                "href": "/tgex/market/push"
            }
        ]
    },
    {
        "consensus": "platform",
        "label": "平台服务",
        "color": "text-cyan-600 dark:text-cyan-400",
        "activeBg": "bg-cyan-50 dark:bg-cyan-500/10",
        "borderColor": "border-cyan-300 dark:border-cyan-700",
        "rootHref": "/tgex/platform",
        "items": [
            {
                "title": "接入、用户与权限",
                "slug": [
                    "platform",
                    "access"
                ],
                "href": "/tgex/platform/access"
            },
            {
                "title": "业务扩展服务",
                "slug": [
                    "platform",
                    "business"
                ],
                "href": "/tgex/platform/business"
            }
        ]
    },
    {
        "consensus": "operations",
        "label": "运行与维护",
        "color": "text-cyan-600 dark:text-cyan-400",
        "activeBg": "bg-cyan-50 dark:bg-cyan-500/10",
        "borderColor": "border-cyan-300 dark:border-cyan-700",
        "rootHref": "/tgex/operations",
        "items": [
            {
                "title": "消息与一致性",
                "slug": [
                    "operations",
                    "consistency"
                ],
                "href": "/tgex/operations/consistency"
            },
            {
                "title": "排障与验证",
                "slug": [
                    "operations",
                    "troubleshooting"
                ],
                "href": "/tgex/operations/troubleshooting"
            }
        ]
    }
];
