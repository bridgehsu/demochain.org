import React, {useState, useRef} from 'react'
import Link from 'next/link'

type PoHEvent = {seq: number; content: string; hash: string; prevHash: string; timestamp: string}

async function sha256Hex(input: string): Promise<string> {
    const enc = new TextEncoder()
    const data = enc.encode(input)
    const buf = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function PoHTimelinePage(): React.ReactElement {
    const [events, setEvents] = useState<PoHEvent[]>([])
    const [input, setInput] = useState('')
    const [currentHash, setCurrentHash] = useState('genesis_seed_0000')
    const [seqCount, setSeqCount] = useState(0)
    const [inserting, setInserting] = useState(false)
    const seqRef = useRef(0)

    const insertEvent = async () => {
        if (!input.trim() || inserting) return
        setInserting(true)
        // Advance the PoH sequence a few steps first (simulate time passing)
        let hash = currentHash
        const steps = Math.floor(Math.random() * 10) + 5
        for (let i = 0; i < steps; i++) {
            hash = await sha256Hex(hash)
            seqRef.current++
        }
        setSeqCount(seqRef.current)
        // Mix the event content into the current hash
        const eventHash = await sha256Hex(hash + input.trim())
        const prevHash = hash
        seqRef.current++
        setSeqCount(seqRef.current)
        const newEvent: PoHEvent = {
            seq: seqRef.current,
            content: input.trim(),
            hash: eventHash,
            prevHash,
            timestamp: new Date().toLocaleTimeString(),
        }
        setCurrentHash(eventHash)
        setEvents(prev => [newEvent, ...prev])
        setInput('')
        setInserting(false)
    }

    const reset = () => {
        setEvents([])
        setCurrentHash('genesis_seed_0000')
        seqRef.current = 0
        setSeqCount(0)
        setInput('')
    }

    return (
        <div className="px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">PoH 事件时序</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">在哈希序列中插入事件，为每个事件生成可验证的时间戳证明</p>
                        </div>
                        <button onClick={reset} className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white">重置</button>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') insertEvent() }}
                            placeholder="输入事件内容（如：Alice→Bob 转账 10 SOL）"
                            className="flex-1 h-9 px-3 rounded border border-gray-300 text-sm text-gray-900 bg-white dark:bg-black/20 dark:border-white/30 dark:text-white focus:outline-none focus:border-orange-500"
                        />
                        <button onClick={insertEvent} disabled={!input.trim() || inserting}
                            className="px-4 py-2 rounded text-sm bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50">
                            {inserting ? '插入中...' : '插入事件'}
                        </button>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">当前序号：<span className="font-bold text-orange-500">{seqCount}</span> &nbsp;|&nbsp; 当前哈希：<span className="font-mono">{currentHash.slice(0, 24)}...</span></div>
                </div>

                {/* 时间轴 */}
                <div className="mb-6 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800 p-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">PoH 时间轴</h3>
                    {events.length === 0
                        ? <div className="text-center py-10 text-gray-400">
                            <div className="text-4xl mb-3">⏱</div>
                            <div className="text-sm">输入事件内容并点击"插入事件"</div>
                            <div className="text-xs mt-1 text-gray-300">每次插入会在序列中推进若干步骤，模拟时间流逝</div>
                        </div>
                        : <div className="relative">
                            {/* 时间轴线 */}
                            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-orange-200 dark:bg-orange-900"/>
                            <div className="space-y-4">
                                {events.map((ev, i) => (
                                    <div key={ev.seq} className="relative flex gap-4">
                                        <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold z-10 ${i === 0 ? 'bg-orange-500' : 'bg-orange-300'}`}>
                                            {events.length - i}
                                        </div>
                                        <div className={`flex-1 p-3 rounded-lg border ${i === 0 ? 'border-orange-300 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-800' : 'border-gray-200 bg-gray-50 dark:bg-gray-900/50 dark:border-gray-700'}`}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-medium text-sm text-gray-900 dark:text-white">{ev.content}</span>
                                                <span className="text-xs text-gray-400">{ev.timestamp}</span>
                                            </div>
                                            <div className="space-y-0.5 text-xs text-gray-500 dark:text-gray-400 font-mono">
                                                <div>序号：<span className="text-orange-600 dark:text-orange-400 font-bold">#{ev.seq}</span></div>
                                                <div className="truncate">事件哈希：{ev.hash.slice(0, 32)}...</div>
                                                <div className="truncate">前哈希：{ev.prevHash.slice(0, 32)}...</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                </div>

                <div className="p-4 rounded-lg bg-orange-50 border border-orange-200 dark:bg-orange-900/10 dark:border-orange-800 mb-6">
                    <h3 className="text-sm font-semibold text-orange-800 dark:text-orange-300 mb-1">💡 PoH 时间戳证明</h3>
                    <p className="text-sm text-orange-700 dark:text-orange-400">在 PoH 序列中插入事件时，事件内容会被混入（hash）当前哈希值。任何人都能验证：该事件确实发生在序号 N 处，因为必须先计算完 N 步才能得到该哈希。这为去中心化网络中的每笔交易提供了无需信任时间服务器的时序证明。</p>
                </div>

                <div className="flex justify-between items-center">
                    <Link href="/poh" className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">← 哈希序列</Link>
                    <Link href="/poh/chain" className="px-4 py-2 rounded-lg text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors">下一步：链视图 →</Link>
                </div>
            </div>
        </div>
    )
}
