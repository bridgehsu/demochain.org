import React, {useState, useCallback, useRef} from 'react'
import Link from 'next/link'

type PoABlock = {height: number; signer: string; signerIdx: number; hash: string; prevHash: string; timestamp: number}

const AUTHORITIES = ['Node1', 'Node2', 'Node3', 'Node4', 'Node5']
const NODE_COLORS = ['bg-green-600', 'bg-teal-600', 'bg-emerald-600', 'bg-lime-600', 'bg-cyan-600']
const NODE_BORDER = ['border-green-400', 'border-teal-400', 'border-emerald-400', 'border-lime-400', 'border-cyan-400']
const NODE_TEXT = [
    'text-green-600 dark:text-green-400',
    'text-teal-600 dark:text-teal-400',
    'text-emerald-600 dark:text-emerald-400',
    'text-lime-600 dark:text-lime-400',
    'text-cyan-600 dark:text-cyan-400',
]

function makeHash(h: number, s: string, prev: string): string {
    let n = 0
    const str = `${h}${s}${prev}${Date.now()}`
    for (let i = 0; i < str.length; i++) { n = (n << 5) - n + str.charCodeAt(i); n |= 0 }
    return Math.abs(n).toString(16).padStart(8, '0') + Math.abs(n * 41).toString(16).padStart(8, '0')
}

function shortHash(s: string) { return s.slice(0, 8) + '...' + s.slice(-4) }

const GENESIS: PoABlock = {
    height: 1, signer: 'Genesis', signerIdx: 0,
    timestamp: Date.now() - 60000,
    hash: '00000000genesis00000000',
    prevHash: '0000000000000000',
}

export default function PoAChainPage(): React.ReactElement {
    const [blocks, setBlocks] = useState<PoABlock[]>([GENESIS])
    const [adding, setAdding] = useState(false)
    const roundRef = useRef(0)

    const addBlock = useCallback(async () => {
        setAdding(true)
        await new Promise(r => setTimeout(r, 500))
        const idx = roundRef.current % AUTHORITIES.length
        const signer = AUTHORITIES[idx]
        roundRef.current++
        const prev = blocks[blocks.length - 1]
        const hash = makeHash(prev.height + 1, signer, prev.hash)
        setBlocks(b => [...b, {
            height: prev.height + 1,
            signer,
            signerIdx: idx,
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

    const counts = AUTHORITIES.map((a, i) => ({
        name: a, idx: i,
        count: blocks.filter(b => b.signer === a).length,
    }))

    return (
        <div className="px-4 py-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">PoA 区块链</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">5个权威节点按顺序轮流签名出块</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={reset} className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white">重置</button>
                            <button onClick={addBlock} disabled={adding}
                                className="px-4 py-2 rounded text-sm border bg-white text-green-700 border-green-300 hover:bg-green-50 disabled:opacity-50 dark:bg-transparent dark:border-green-500 dark:text-green-400">
                                {adding ? '⏳ 签名中...' : '➕ 产生新区块'}
                            </button>
                        </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">链长：<span className="font-bold text-green-600 dark:text-green-400">{blocks.length}</span> 块</div>
                </div>

                {/* 统计 */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-6">
                    {counts.map(c => (
                        <div key={c.name} className="p-3 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-center">
                            <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${NODE_COLORS[c.idx]}`}/>
                            <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{c.name}</div>
                            <div className={`text-lg font-bold ${NODE_TEXT[c.idx]}`}>{c.count}</div>
                            <div className="text-xs text-gray-400">块</div>
                        </div>
                    ))}
                </div>

                {/* 链视图 */}
                <div className="rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800 p-4 mb-6">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">链视图</h3>
                    <div className="overflow-x-auto pb-2">
                        <div className="flex items-center gap-3 min-w-max">
                            {blocks.map((b, idx) => {
                                const ci = b.signerIdx
                                return (
                                    <div key={b.height} className="flex items-center">
                                        <div className={`w-44 p-3 rounded-lg border-2 ${NODE_BORDER[ci] || 'border-gray-400'} bg-white dark:bg-gray-900`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-bold text-gray-500">#{b.height}</span>
                                                <span className={`text-xs font-medium px-1.5 py-0.5 rounded text-white ${NODE_COLORS[ci] || 'bg-gray-500'}`}>{b.signer}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                                <div>Hash: <span className="font-mono">{shortHash(b.hash)}</span></div>
                                                <div>Prev: <span className="font-mono">{shortHash(b.prevHash)}</span></div>
                                                <div>{new Date(b.timestamp).toLocaleTimeString()}</div>
                                            </div>
                                        </div>
                                        {idx < blocks.length - 1 && (
                                            <div className="flex items-center mx-1">
                                                <div className="w-4 h-0.5 bg-green-400"/>
                                                <div className="w-0 h-0 border-l-4 border-l-green-400 border-t-2 border-t-transparent border-b-2 border-b-transparent"/>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-3">💡 横向滚动查看完整链 · 颜色代表不同权威节点</p>
                </div>

                <div className="p-4 rounded-lg bg-green-50 border border-green-200 dark:bg-green-900/10 dark:border-green-800 mb-6">
                    <h3 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-1">💡 PoA 链的特点</h3>
                    <p className="text-sm text-green-700 dark:text-green-400">PoA 链的每个区块都附带权威节点的数字签名，任何人都可以验证签名的真实性。出块者身份透明可追溯，适合需要合规监管的企业场景。缺点是牺牲了去中心化，权威节点需要事先经过审查认证。</p>
                </div>

                <div className="flex justify-between items-center">
                    <Link href="/poa/signing" className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">← 签名出块</Link>
                    <Link href="/bft" className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors">下一共识：BFT →</Link>
                </div>
            </div>
        </div>
    )
}
