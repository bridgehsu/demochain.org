import React, {useState, useCallback, useRef} from 'react'
import Link from 'next/link'

type BFTBlock = {height: number; proposer: string; votes: number; total: number; hash: string; prevHash: string; timestamp: number; finalized: boolean}

const NODES = ['Node1', 'Node2', 'Node3', 'Node4', 'Node5', 'Node6', 'Node7']
const TOTAL = NODES.length

function makeHash(h: number, p: string, prev: string): string {
    let n = 0
    const s = `${h}${p}${prev}${Date.now()}`
    for (let i = 0; i < s.length; i++) { n = (n << 5) - n + s.charCodeAt(i); n |= 0 }
    return Math.abs(n).toString(16).padStart(8, '0') + Math.abs(n * 53).toString(16).padStart(8, '0')
}

function shortHash(s: string) { return s.slice(0, 8) + '...' + s.slice(-4) }

const GENESIS: BFTBlock = {
    height: 1, proposer: 'Genesis', votes: 7, total: TOTAL,
    timestamp: Date.now() - 60000,
    hash: '00000000genesis00000000',
    prevHash: '0000000000000000',
    finalized: true,
}

export default function BFTChainPage(): React.ReactElement {
    const [blocks, setBlocks] = useState<BFTBlock[]>([GENESIS])
    const [adding, setAdding] = useState(false)
    const roundRef = useRef(0)

    const addBlock = useCallback(async () => {
        setAdding(true)
        await new Promise(r => setTimeout(r, 700))
        const proposer = NODES[roundRef.current % NODES.length]
        roundRef.current++
        const prev = blocks[blocks.length - 1]
        const hash = makeHash(prev.height + 1, proposer, prev.hash)
        // BFT: 5 out of 7 vote yes (2 byzantine always no)
        const votes = 5
        setBlocks(b => [...b, {
            height: prev.height + 1,
            proposer,
            votes,
            total: TOTAL,
            hash,
            prevHash: prev.hash,
            timestamp: Date.now(),
            finalized: true,
        }])
        setAdding(false)
    }, [blocks])

    const reset = () => {
        setBlocks([GENESIS])
        roundRef.current = 0
    }

    return (
        <div className="px-4 py-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">BFT 区块链</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">BFT 共识保证即时最终性，每块确认后永不回滚</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={reset} className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white">重置</button>
                            <button onClick={addBlock} disabled={adding}
                                className="px-4 py-2 rounded text-sm border bg-white text-red-700 border-red-300 hover:bg-red-50 disabled:opacity-50 dark:bg-transparent dark:border-red-500 dark:text-red-400">
                                {adding ? '⏳ 共识中...' : '➕ 产生新区块'}
                            </button>
                        </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">链长：<span className="font-bold text-red-600 dark:text-red-400">{blocks.length}</span> 块 &nbsp;|&nbsp; 全部即时最终确认</div>
                </div>

                {/* 链视图 */}
                <div className="rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800 p-4 mb-6">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">链视图</h3>
                    <div className="overflow-x-auto pb-2">
                        <div className="flex items-center gap-3 min-w-max">
                            {blocks.map((b, idx) => (
                                <div key={b.height} className="flex items-center">
                                    <div className="w-48 p-3 rounded-lg border-2 border-red-400 bg-white dark:bg-gray-900">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-bold text-gray-500">#{b.height}</span>
                                            <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-green-500 text-white">✓ 已确认</span>
                                        </div>
                                        <div className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">提案者：{b.proposer}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                            <div>投票：<span className="font-medium text-green-600 dark:text-green-400">{b.votes}/{b.total}</span>
                                                <span className="ml-1 text-gray-400">({Math.round(b.votes/b.total*100)}%)</span>
                                            </div>
                                            <div>Hash: <span className="font-mono">{shortHash(b.hash)}</span></div>
                                            <div>Prev: <span className="font-mono">{shortHash(b.prevHash)}</span></div>
                                        </div>
                                    </div>
                                    {idx < blocks.length - 1 && (
                                        <div className="flex items-center mx-1">
                                            <div className="w-4 h-0.5 bg-red-400"/>
                                            <div className="w-0 h-0 border-l-4 border-l-red-400 border-t-2 border-t-transparent border-b-2 border-b-transparent"/>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-3">💡 横向滚动查看完整链 · 每块均有确认投票数</p>
                </div>

                {/* BFT 最终性说明 */}
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">即时最终性 vs 概率最终性</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 rounded bg-red-50 dark:bg-red-900/10">
                            <div className="font-medium text-red-700 dark:text-red-400 mb-1">BFT（即时最终性）</div>
                            <div className="text-red-600 dark:text-red-400 text-xs">区块一旦确认，永不回滚。无需等待多个确认块，1个区块就是最终结果。</div>
                        </div>
                        <div className="p-3 rounded bg-gray-50 dark:bg-gray-900/50">
                            <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">PoW/PoS（概率最终性）</div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">区块越深越安全，但理论上始终有被替换的极小概率，需要等待多个确认。</div>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/10 dark:border-red-800 mb-6">
                    <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">💡 BFT 链的关键特性</h3>
                    <p className="text-sm text-red-700 dark:text-red-400">BFT 链每个区块都附带完整的投票证明（≥2/3 节点签名集合），任何人都可以验证最终性。Cosmos/Tendermint 等采用此方案，代价是节点数量受限（通常 &lt;100 个验证者），以保证消息复杂度可控。</p>
                </div>

                <div className="flex justify-between items-center">
                    <Link href="/bft/vote" className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">← 投票</Link>
                    <Link href="/avalanche" className="px-4 py-2 rounded-lg text-sm font-medium bg-cyan-600 text-white hover:bg-cyan-700 transition-colors">下一共识：Avalanche →</Link>
                </div>
            </div>
        </div>
    )
}
