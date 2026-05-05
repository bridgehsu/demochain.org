import React, {useState, useCallback} from 'react'
import Link from 'next/link'

type Validator = {name: string; stake: number; color: string}
type PosBlock = {height: number; validator: string; color: string; timestamp: number; hash: string; prevHash: string}

const VALIDATORS: Validator[] = [
    {name: 'Alice', stake: 3200, color: 'blue'},
    {name: 'Bob', stake: 1800, color: 'purple'},
    {name: 'Charlie', stake: 2500, color: 'green'},
    {name: 'Dave', stake: 500, color: 'orange'},
]

const BAR: Record<string, string> = {
    blue: 'bg-blue-500', purple: 'bg-purple-500', green: 'bg-green-500', orange: 'bg-orange-500',
}
const BORDER: Record<string, string> = {
    blue: 'border-blue-400', purple: 'border-purple-400', green: 'border-green-400', orange: 'border-orange-400',
}
const TEXT: Record<string, string> = {
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    green: 'text-green-600 dark:text-green-400',
    orange: 'text-orange-600 dark:text-orange-400',
}

function shortHash(s: string) {
    return s.slice(0, 8) + '...' + s.slice(-4)
}

function makeHash(height: number, validator: string, prev: string): string {
    let h = 0
    const str = `${height}${validator}${prev}${Date.now()}`
    for (let i = 0; i < str.length; i++) {
        h = (h << 5) - h + str.charCodeAt(i)
        h |= 0
    }
    return Math.abs(h).toString(16).padStart(8, '0') + Math.abs(h * 31).toString(16).padStart(8, '0')
}

function weightedPick(): number {
    const total = VALIDATORS.reduce((s, v) => s + v.stake, 0)
    let r = Math.random() * total
    for (let i = 0; i < VALIDATORS.length; i++) {
        r -= VALIDATORS[i].stake
        if (r <= 0) return i
    }
    return 0
}

const GENESIS: PosBlock = {
    height: 1,
    validator: 'Genesis',
    color: 'blue',
    timestamp: Date.now() - 60000,
    hash: '00000000genesis00000000',
    prevHash: '0000000000000000',
}

export default function PosChainPage(): React.ReactElement {
    const [blocks, setBlocks] = useState<PosBlock[]>([GENESIS])
    const [adding, setAdding] = useState(false)
    const [lastProducer, setLastProducer] = useState<string | null>(null)

    const addBlock = useCallback(async () => {
        setAdding(true)
        await new Promise(r => setTimeout(r, 600))
        const i = weightedPick()
        const v = VALIDATORS[i]
        const prev = blocks[blocks.length - 1]
        const hash = makeHash(prev.height + 1, v.name, prev.hash)
        setLastProducer(v.name)
        setBlocks(b => [...b, {
            height: prev.height + 1,
            validator: v.name,
            color: v.color,
            timestamp: Date.now(),
            hash,
            prevHash: prev.hash,
        }])
        setAdding(false)
    }, [blocks])

    const reset = () => {
        setBlocks([GENESIS])
        setLastProducer(null)
    }

    const total = VALIDATORS.reduce((s, v) => s + v.stake, 0)

    return (
        <div className="px-4 py-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">PoS 区块链</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">验证者按质押权重轮流出块，无需消耗算力</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={reset} className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white">重置</button>
                            <button onClick={addBlock} disabled={adding}
                                className="px-4 py-2 rounded text-sm border bg-white text-blue-700 border-blue-300 hover:bg-blue-50 disabled:opacity-50 dark:bg-transparent dark:border-blue-500 dark:text-blue-400">
                                {adding ? '⏳ 选择验证者...' : '➕ 产生新区块'}
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <span>链长：{blocks.length} 块</span>
                        {lastProducer && <span>上一出块者：<span className="font-medium">{lastProducer}</span></span>}
                    </div>
                </div>

                {/* 验证者权重 */}
                <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {VALIDATORS.map(v => {
                        const pct = v.stake / total * 100
                        const count = blocks.filter(b => b.validator === v.name).length
                        return (
                            <div key={v.name} className="p-3 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <span className={`w-2 h-2 rounded-full ${BAR[v.color]}`}/>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{v.name}</span>
                                </div>
                                <div className={`text-lg font-bold ${TEXT[v.color]}`}>{pct.toFixed(0)}%</div>
                                <div className="text-xs text-gray-400">出块 {count} 次</div>
                            </div>
                        )
                    })}
                </div>

                {/* 区块链 */}
                <div className="rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800 p-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">PoS 链视图</h3>
                    <div className="overflow-x-auto pb-2">
                        <div className="flex items-center gap-3 min-w-max">
                            {blocks.map((b, idx) => (
                                <div key={b.height} className="flex items-center">
                                    <div className={`w-44 p-3 rounded-lg border-2 ${BORDER[b.color]} bg-white dark:bg-gray-900`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-gray-500">#{b.height}</span>
                                            <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${BAR[b.color]} text-white`}>{b.validator}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                            <div>Hash: <span className="font-mono">{shortHash(b.hash)}</span></div>
                                            <div>Prev: <span className="font-mono">{shortHash(b.prevHash)}</span></div>
                                            <div>{new Date(b.timestamp).toLocaleTimeString()}</div>
                                        </div>
                                    </div>
                                    {idx < blocks.length - 1 && (
                                        <div className="flex items-center mx-1">
                                            <div className="w-4 h-0.5 bg-blue-400"/>
                                            <div className="w-0 h-0 border-l-4 border-l-blue-400 border-t-2 border-t-transparent border-b-2 border-b-transparent"/>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-3">💡 横向滚动查看完整链 · 颜色代表不同验证者</p>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-900/10 dark:border-blue-800">
                    <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">💡 PoS 链 vs PoW 链</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400">PoS 链中每个区块由被选中的验证者签名产生，无需哈希竞赛。出块速度更快、能耗极低，但安全性依赖于验证者的质押抵押。</p>
                </div>

                <div className="mt-6 flex justify-between items-center">
                    <Link href="/pos/rewards" className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">← 奖励</Link>
                    <Link href="/dpos" className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors">下一共识：DPoS →</Link>
                </div>
            </div>
        </div>
    )
}
