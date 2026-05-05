import React, {useState, useCallback} from 'react'
import Link from 'next/link'

type DPosBlock = {height: number; delegate: string; color: string; hash: string; prevHash: string; timestamp: number}

const DELEGATES = [
    {name: 'Alice', color: 'purple'},
    {name: 'Bob', color: 'indigo'},
    {name: 'Charlie', color: 'violet'},
]

const BORDER: Record<string, string> = {
    purple: 'border-purple-400',
    indigo: 'border-indigo-400',
    violet: 'border-violet-400',
}
const BADGE: Record<string, string> = {
    purple: 'bg-purple-600',
    indigo: 'bg-indigo-600',
    violet: 'bg-violet-600',
}
const TEXT: Record<string, string> = {
    purple: 'text-purple-600 dark:text-purple-400',
    indigo: 'text-indigo-600 dark:text-indigo-400',
    violet: 'text-violet-600 dark:text-violet-400',
}

function makeHash(h: number, d: string, prev: string): string {
    let n = 0
    const s = `${h}${d}${prev}${Date.now()}`
    for (let i = 0; i < s.length; i++) { n = (n << 5) - n + s.charCodeAt(i); n |= 0 }
    return Math.abs(n).toString(16).padStart(8, '0') + Math.abs(n * 31).toString(16).padStart(8, '0')
}

function shortHash(s: string) { return s.slice(0, 8) + '...' + s.slice(-4) }

const GENESIS: DPosBlock = {
    height: 1, delegate: 'Genesis', color: 'purple',
    timestamp: Date.now() - 60000,
    hash: '00000000genesis00000000',
    prevHash: '0000000000000000',
}

export default function DPosChainPage(): React.ReactElement {
    const [blocks, setBlocks] = useState<DPosBlock[]>([GENESIS])
    const [adding, setAdding] = useState(false)
    const roundRef = React.useRef(0)

    const addBlock = useCallback(async () => {
        setAdding(true)
        await new Promise(r => setTimeout(r, 500))
        const d = DELEGATES[roundRef.current % DELEGATES.length]
        roundRef.current++
        const prev = blocks[blocks.length - 1]
        const hash = makeHash(prev.height + 1, d.name, prev.hash)
        setBlocks(b => [...b, {
            height: prev.height + 1,
            delegate: d.name,
            color: d.color,
            hash,
            prevHash: prev.hash,
            timestamp: Date.now(),
        }])
        setAdding(false)
    }, [blocks])

    const reset = () => {
        setBlocks([GENESIS])
        roundRef.current = 0
    }

    const counts = DELEGATES.map(d => ({...d, count: blocks.filter(b => b.delegate === d.name).length}))

    return (
        <div className="px-4 py-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">DPoS 区块链</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">3位代表按固定顺序轮流出块（Alice → Bob → Charlie → 循环）</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button onClick={reset} className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white">重置</button>
                            <button onClick={addBlock} disabled={adding}
                                className="px-4 py-2 rounded text-sm border bg-white text-purple-700 border-purple-300 hover:bg-purple-50 disabled:opacity-50 dark:bg-transparent dark:border-purple-500 dark:text-purple-400">
                                {adding ? '⏳ 出块中...' : '➕ 产生新区块'}
                            </button>
                        </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">链长：<span className="font-bold text-purple-600 dark:text-purple-400">{blocks.length}</span> 块 &nbsp;|&nbsp; 下一出块代表：<span className="font-medium">{DELEGATES[roundRef.current % DELEGATES.length]?.name}</span></div>
                </div>

                {/* 代表出块统计 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                    {counts.map(d => (
                        <div key={d.name} className="p-3 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-center">
                            <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${BADGE[d.color]}`}/>
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{d.name}</div>
                            <div className={`text-lg font-bold ${TEXT[d.color]}`}>{d.count}</div>
                            <div className="text-xs text-gray-400">次出块</div>
                        </div>
                    ))}
                </div>

                {/* 链视图 */}
                <div className="rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800 p-4 mb-6">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">链视图</h3>
                    <div className="overflow-x-auto pb-2">
                        <div className="flex items-center gap-3 min-w-max">
                            {blocks.map((b, idx) => (
                                <div key={b.height} className="flex items-center">
                                    <div className={`w-44 p-3 rounded-lg border-2 ${BORDER[b.color]} bg-white dark:bg-gray-900`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-gray-500">#{b.height}</span>
                                            <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${BADGE[b.color]} text-white`}>{b.delegate}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                            <div>Hash: <span className="font-mono">{shortHash(b.hash)}</span></div>
                                            <div>Prev: <span className="font-mono">{shortHash(b.prevHash)}</span></div>
                                            <div>{new Date(b.timestamp).toLocaleTimeString()}</div>
                                        </div>
                                    </div>
                                    {idx < blocks.length - 1 && (
                                        <div className="flex items-center mx-1">
                                            <div className="w-4 h-0.5 bg-purple-400"/>
                                            <div className="w-0 h-0 border-l-4 border-l-purple-400 border-t-2 border-t-transparent border-b-2 border-b-transparent"/>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-3">💡 横向滚动查看完整链 · 颜色代表不同委托人</p>
                </div>

                <div className="p-4 rounded-lg bg-purple-50 border border-purple-200 dark:bg-purple-900/10 dark:border-purple-800 mb-6">
                    <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-300 mb-1">💡 DPoS 链的特点</h3>
                    <p className="text-sm text-purple-700 dark:text-purple-400">DPoS 与 PoS 最大的区别在于出块顺序：DPoS 代表按固定顺序轮换，而非随机权重选择。这使出块更加规律可预测。如果某个代表离线，系统会跳过并继续下一位。</p>
                </div>

                <div className="flex justify-between items-center">
                    <Link href="/dpos/rounds" className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">← 轮次</Link>
                    <Link href="/poa" className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors">下一共识：PoA →</Link>
                </div>
            </div>
        </div>
    )
}
