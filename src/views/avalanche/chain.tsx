import React, {useState, useCallback, useRef} from 'react'
import Link from 'next/link'

type AvalancheBlock = {height: number; confidence: number; hash: string; prevHash: string; timestamp: number; txCount: number}

function makeHash(h: number, prev: string): string {
    let n = 0
    const s = `${h}${prev}${Date.now()}`
    for (let i = 0; i < s.length; i++) { n = (n << 5) - n + s.charCodeAt(i); n |= 0 }
    return Math.abs(n).toString(16).padStart(8, '0') + Math.abs(n * 59).toString(16).padStart(8, '0')
}

function shortHash(s: string) { return s.slice(0, 8) + '...' + s.slice(-4) }

const GENESIS: AvalancheBlock = {
    height: 1, confidence: 99.9,
    timestamp: Date.now() - 60000,
    hash: '00000000genesis00000000',
    prevHash: '0000000000000000',
    txCount: 0,
}

export default function AvalancheChainPage(): React.ReactElement {
    const [blocks, setBlocks] = useState<AvalancheBlock[]>([GENESIS])
    const [adding, setAdding] = useState(false)
    const roundRef = useRef(0)

    const addBlock = useCallback(async () => {
        setAdding(true)
        await new Promise(r => setTimeout(r, 500))
        const prev = blocks[blocks.length - 1]
        const hash = makeHash(prev.height + 1, prev.hash)
        // Simulate near-instant finality with high confidence
        const confidence = 95 + Math.random() * 4.9
        const txCount = Math.floor(Math.random() * 200) + 50
        roundRef.current++
        setBlocks(b => [...b, {
            height: prev.height + 1,
            confidence: Math.round(confidence * 10) / 10,
            hash,
            prevHash: prev.hash,
            timestamp: Date.now(),
            txCount,
        }])
        setAdding(false)
    }, [blocks])

    const reset = () => {
        setBlocks([GENESIS])
        roundRef.current = 0
    }

    const confidenceColor = (c: number) => {
        if (c >= 99) return 'text-green-600 dark:text-green-400'
        if (c >= 97) return 'text-cyan-600 dark:text-cyan-400'
        return 'text-yellow-600 dark:text-yellow-400'
    }

    return (
        <div className="px-4 py-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Avalanche 区块链</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">概率最终性：每块附带置信度，极高置信度下视为确认</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={reset} className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white">重置</button>
                            <button onClick={addBlock} disabled={adding}
                                className="px-4 py-2 rounded text-sm border bg-white text-cyan-700 border-cyan-300 hover:bg-cyan-50 disabled:opacity-50 dark:bg-transparent dark:border-cyan-500 dark:text-cyan-400">
                                {adding ? '⏳ 共识中...' : '➕ 产生新区块'}
                            </button>
                        </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                        链长：<span className="font-bold text-cyan-600 dark:text-cyan-400">{blocks.length}</span> 块 &nbsp;|&nbsp; 平均置信度：<span className="font-bold">{blocks.length > 1 ? (blocks.slice(1).reduce((s, b) => s + b.confidence, 0) / (blocks.length - 1)).toFixed(1) : 'N/A'}%</span>
                    </div>
                </div>

                {/* 链视图 */}
                <div className="rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800 p-4 mb-6">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">链视图</h3>
                    <div className="overflow-x-auto pb-2">
                        <div className="flex items-center gap-3 min-w-max">
                            {blocks.map((b, idx) => (
                                <div key={b.height} className="flex items-center">
                                    <div className="w-48 p-3 rounded-lg border-2 border-cyan-400 bg-white dark:bg-gray-900">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-gray-500">#{b.height}</span>
                                            <span className={`text-xs font-bold ${confidenceColor(b.confidence)}`}>{b.confidence}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-2">
                                            <div className="bg-cyan-500 h-1.5 rounded-full" style={{width: `${b.confidence}%`}}/>
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                            <div>交易：<span className="font-medium">{b.txCount}</span> 笔</div>
                                            <div>Hash: <span className="font-mono">{shortHash(b.hash)}</span></div>
                                            <div>Prev: <span className="font-mono">{shortHash(b.prevHash)}</span></div>
                                        </div>
                                    </div>
                                    {idx < blocks.length - 1 && (
                                        <div className="flex items-center mx-1">
                                            <div className="w-4 h-0.5 bg-cyan-400"/>
                                            <div className="w-0 h-0 border-l-4 border-l-cyan-400 border-t-2 border-t-transparent border-b-2 border-b-transparent"/>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-3">💡 数字表示确认置信度，≥99% 视为实际最终确认</p>
                </div>

                {/* 对比说明 */}
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Avalanche 的独特优势</h3>
                    <div className="grid grid-cols-3 gap-3 text-xs text-center">
                        {[
                            {label: '吞吐量', value: '4500+ TPS', sub: '亚秒级确认'},
                            {label: '置信度', value: '≥99.9%', sub: '概率最终性'},
                            {label: '网络规模', value: '数千节点', sub: '去中心化'},
                        ].map(item => (
                            <div key={item.label} className="p-2 rounded bg-cyan-50 dark:bg-cyan-900/10">
                                <div className="font-bold text-cyan-700 dark:text-cyan-400">{item.value}</div>
                                <div className="text-gray-500">{item.label}</div>
                                <div className="text-gray-400">{item.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 rounded-lg bg-cyan-50 border border-cyan-200 dark:bg-cyan-900/10 dark:border-cyan-800 mb-6">
                    <h3 className="text-sm font-semibold text-cyan-800 dark:text-cyan-300 mb-1">💡 概率最终性</h3>
                    <p className="text-sm text-cyan-700 dark:text-cyan-400">Avalanche 采用概率最终性而非确定性最终性。通过足够多轮次的随机采样，区块被回滚的概率指数级降低，实践中可忽略不计。相比 PoW 需要等待多个确认块，Avalanche 在不到 2 秒内即可达到 &gt;99.9% 置信度。</p>
                </div>

                <div className="flex justify-between items-center">
                    <Link href="/avalanche/snowball" className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">← 雪球算法</Link>
                    <Link href="/poh" className="px-4 py-2 rounded-lg text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors">下一共识：PoH →</Link>
                </div>
            </div>
        </div>
    )
}
