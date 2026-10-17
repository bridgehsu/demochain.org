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
        "consensus": "option",
        "label": "期权交易 · 版本对照",
        "color": "text-cyan-600 dark:text-cyan-400",
        "activeBg": "bg-cyan-50 dark:bg-cyan-500/10",
        "borderColor": "border-cyan-300 dark:border-cyan-700",
        "rootHref": "/tgex/option",
        "items": [
            {
                "title": "模块与版本边界",
                "slug": [
                    "option",
                    "modules"
                ],
                "href": "/tgex/option/modules"
            },
            {
                "title": "期权行情与周期数据",
                "slug": [
                    "option",
                    "market"
                ],
                "href": "/tgex/option/market"
            }
        ]
    },
    {
        "consensus": "option-threshold",
        "label": "版本一 · 阈值型二元期权",
        "color": "text-cyan-600 dark:text-cyan-400",
        "activeBg": "bg-cyan-50 dark:bg-cyan-500/10",
        "borderColor": "border-cyan-300 dark:border-cyan-700",
        "rootHref": "/tgex/option/threshold",
        "items": [
            {
                "title": "期次与购买流程",
                "slug": [
                    "option",
                    "threshold",
                    "orders"
                ],
                "href": "/tgex/option/threshold/orders"
            },
            {
                "title": "结果判定与结算",
                "slug": [
                    "option",
                    "threshold",
                    "settlement"
                ],
                "href": "/tgex/option/threshold/settlement"
            },
            {
                "title": "行情与数据边界",
                "slug": [
                    "option",
                    "threshold",
                    "market"
                ],
                "href": "/tgex/option/threshold/market"
            }
        ]
    },
    {
        "consensus": "option-direction",
        "label": "版本二 · 涨跌型二元期权",
        "color": "text-cyan-600 dark:text-cyan-400",
        "activeBg": "bg-cyan-50 dark:bg-cyan-500/10",
        "borderColor": "border-cyan-300 dark:border-cyan-700",
        "rootHref": "/tgex/option/direction",
        "items": [
            {
                "title": "期次与购买流程",
                "slug": [
                    "option",
                    "direction",
                    "orders"
                ],
                "href": "/tgex/option/direction/orders"
            },
            {
                "title": "结果判定与结算",
                "slug": [
                    "option",
                    "direction",
                    "settlement"
                ],
                "href": "/tgex/option/direction/settlement"
            },
            {
                "title": "行情与数据边界",
                "slug": [
                    "option",
                    "direction",
                    "market"
                ],
                "href": "/tgex/option/direction/market"
            }
        ]
    },
    {
        "consensus": "option-touch",
        "label": "版本三 · 触碰型二元期权",
        "color": "text-cyan-600 dark:text-cyan-400",
        "activeBg": "bg-cyan-50 dark:bg-cyan-500/10",
        "borderColor": "border-cyan-300 dark:border-cyan-700",
        "rootHref": "/tgex/option/touch",
        "items": [
            {
                "title": "期次与购买流程",
                "slug": [
                    "option",
                    "touch",
                    "orders"
                ],
                "href": "/tgex/option/touch/orders"
            },
            {
                "title": "结果判定与结算",
                "slug": [
                    "option",
                    "touch",
                    "settlement"
                ],
                "href": "/tgex/option/touch/settlement"
            },
            {
                "title": "行情与数据边界",
                "slug": [
                    "option",
                    "touch",
                    "market"
                ],
                "href": "/tgex/option/touch/market"
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
                "title": "现货、合约与期权行情",
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
