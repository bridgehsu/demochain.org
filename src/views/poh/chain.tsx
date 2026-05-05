import React, {useState, useCallback, useRef} from 'react'
import Link from 'next/link'

type PoHEvent = {content: string; seq: number}
type PoHBlock = {slot: number; fromSeq: number; toSeq: number; events: PoHEvent[]; hash: string; prevHash: string; timestamp: number}

async function sha256Hex(input: string): Promise<string> {
    const enc = new TextEncoder()
    const data = enc.encode(input)
    const buf = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function shortHash(s: string) { return s.slice(0, 8) + '...' + s.slice(-4) }

const SAMPLE_EVENTS = [
    ['Alice→Bob 转 5 SOL', 'Charlie→Dave 转 2 SOL'],
    ['Program Deploy: TokenX', 'Stake 100 SOL'],
    ['NFT Mint #1234', 'Swap SOL→USDC'],
    ['Vote Tx', 'Alice→Eve 转 1 SOL', 'Fee 0.000005 SOL'],
    ['Bridge: 10 ETH→Wormhole'],
]

const GENESIS: PoHBlock = {
    slot: 0, fromSeq: 0, toSeq: 400,
    events: [],
    timestamp: Date.now() - 120000,
    hash: '00000000genesis00000000',
    prevHash: '0000000000000000',
}

export default function PoHChainPage(): React.ReactElement {
    const [blocks, setBlocks] = useState<PoHBlock[]>([GENESIS])
    const [adding, setAdding] = useState(false)
    const seqRef = useRef(400)
    const slotRef = useRef(1)

    const addBlock = useCallback(async () => {
        setAdding(true)
        const seqStep = Math.floor(Math.random() * 200) + 300
        const fromSeq = seqRef.current + 1
        const toSeq = seqRef.current + seqStep
        seqRef.current = toSeq
        const slot = slotRef.current++
        const evData = SAMPLE_EVENTS[(slot - 1) % SAMPLE_EVENTS.length]
        const events: PoHEvent[] = evData.map((content, i) => ({content, seq: fromSeq + Math.floor((seqStep / evData.length) * i)}))
        const prev = blocks[blocks.length - 1]
        const hashInput = `${slot}${fromSeq}${toSeq}${prev.hash}${Date.now()}`
        const hash = await sha256Hex(hashInput)
        setBlocks(b => [...b, {
            slot,
            fromSeq,
            toSeq,
            events,
            hash,
            prevHash: prev.hash,
            timestamp: Date.now(),
        }])
        setAdding(false)
    }, [blocks])

    const reset = () => {
        setBlocks([GENESIS])
        seqRef.current = 400
        slotRef.current = 1
    }

    return (
        <div className="px-4 py-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">PoH 区块链（Solana 风格）</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">每个 Slot 包含一段 PoH 序列范围和其中插入的事件列表</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={reset} className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white">重置</button>
                            <button onClick={addBlock} disabled={adding}
                                className="px-4 py-2 rounded text-sm border bg-white text-orange-700 border-orange-300 hover:bg-orange-50 disabled:opacity-50 dark:bg-transparent dark:border-orange-500 dark:text-orange-400">
                                {adding ? '⏳ 生成中...' : '➕ 产生新 Slot'}
                            </button>
                        </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                        Slots：<span className="font-bold text-orange-600 dark:text-orange-400">{blocks.length}</span> &nbsp;|&nbsp; 当前 PoH 序号：<span className="font-bold">{seqRef.current.toLocaleString()}</span>
                    </div>
                </div>

                {/* 链视图 */}
                <div className="rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800 p-4 mb-6">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Slot 链视图</h3>
                    <div className="overflow-x-auto pb-2">
                        <div className="flex items-start gap-3 min-w-max">
                            {blocks.map((b, idx) => (
                                <div key={b.slot} className="flex items-start">
                                    <div className="w-52 p-3 rounded-lg border-2 border-orange-400 bg-white dark:bg-gray-900">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-gray-500">Slot #{b.slot}</span>
                                            <span className="text-xs px-1.5 py-0.5 rounded bg-orange-500 text-white font-medium">PoH</span>
                                        </div>
                                        <div className="text-xs text-orange-600 dark:text-orange-400 mb-2 font-mono">
                                            序号 {b.fromSeq.toLocaleString()} ~ {b.toSeq.toLocaleString()}
                                        </div>
                                        {b.events.length > 0 && (
                                            <div className="mb-2 space-y-1">
                                                {b.events.slice(0, 3).map((ev, i) => (
                                                    <div key={i} className="text-xs bg-orange-50 dark:bg-orange-900/20 rounded px-1.5 py-0.5 text-orange-700 dark:text-orange-400 truncate">
                                                        #{ev.seq} {ev.content}
                                                    </div>
                                                ))}
                                                {b.events.length > 3 && <div className="text-xs text-gray-400">+{b.events.length - 3} 更多...</div>}
                                            </div>
                                        )}
                                        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                                            <div>Hash: <span className="font-mono">{shortHash(b.hash)}</span></div>
                                            <div>Prev: <span className="font-mono">{shortHash(b.prevHash)}</span></div>
                                        </div>
                                    </div>
                                    {idx < blocks.length - 1 && (
                                        <div className="flex items-center mx-1 mt-8">
                                            <div className="w-4 h-0.5 bg-orange-400"/>
                                            <div className="w-0 h-0 border-l-4 border-l-orange-400 border-t-2 border-t-transparent border-b-2 border-b-transparent"/>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-3">💡 横向滚动查看完整链 · 每个 Slot 约 400ms（Solana 实际约 400ms/Slot）</p>
                </div>

                {/* Solana 特色 */}
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Solana PoH 架构特点</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="p-3 rounded bg-orange-50 dark:bg-orange-900/10">
                            <div className="font-medium text-orange-700 dark:text-orange-400 mb-1">全局时钟</div>
                            <div className="text-xs text-orange-600 dark:text-orange-400">PoH 序列作为全局时钟，无需节点间协商时间顺序</div>
                        </div>
                        <div className="p-3 rounded bg-orange-50 dark:bg-orange-900/10">
                            <div className="font-medium text-orange-700 dark:text-orange-400 mb-1">高吞吐量</div>
                            <div className="text-xs text-orange-600 dark:text-orange-400">每个 Slot 约 400ms，理论 TPS 可达 65000+</div>
                        </div>
                        <div className="p-3 rounded bg-orange-50 dark:bg-orange-900/10">
                            <div className="font-medium text-orange-700 dark:text-orange-400 mb-1">可验证顺序</div>
                            <div className="text-xs text-orange-600 dark:text-orange-400">任何人都可以重放哈希序列验证事件发生顺序</div>
                        </div>
                        <div className="p-3 rounded bg-orange-50 dark:bg-orange-900/10">
                            <div className="font-medium text-orange-700 dark:text-orange-400 mb-1">结合 PoS</div>
                            <div className="text-xs text-orange-600 dark:text-orange-400">PoH 提供时序，Tower BFT（基于 PoS）提供最终确认</div>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-lg bg-orange-50 border border-orange-200 dark:bg-orange-900/10 dark:border-orange-800 mb-6">
                    <h3 className="text-sm font-semibold text-orange-800 dark:text-orange-300 mb-1">💡 PoH 链 vs 传统区块链</h3>
                    <p className="text-sm text-orange-700 dark:text-orange-400">传统区块链的区块包含时间戳，但时间戳不可验证（节点可伪造）。Solana 的 PoH 链用 SHA256 哈希链替代时间戳，每个序号代表确定的计算工作量，使事件顺序无需信任即可验证。这是 Solana 实现超高吞吐量的核心技术之一。</p>
                </div>

                <div className="flex justify-between items-center">
                    <Link href="/poh/timeline" className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">← 事件时序</Link>
                    <Link href="/" className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">回到首页 →</Link>
                </div>
            </div>
        </div>
    )
}
