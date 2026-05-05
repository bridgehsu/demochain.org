import React, {useState, useRef, useEffect, useCallback} from 'react'
import Link from 'next/link'

type HashEntry = {seq: number; hash: string}

async function sha256Hex(input: string): Promise<string> {
    const enc = new TextEncoder()
    const data = enc.encode(input)
    const buf = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function PoHSequencePage(): React.ReactElement {
    const [entries, setEntries] = useState<HashEntry[]>([])
    const [running, setRunning] = useState(false)
    const [speed, setSpeed] = useState(300)
    const runRef = useRef(false)
    const lastHashRef = useRef('genesis_seed_0000')
    const seqRef = useRef(0)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const step = useCallback(async () => {
        const newHash = await sha256Hex(lastHashRef.current)
        lastHashRef.current = newHash
        seqRef.current++
        const seq = seqRef.current
        setEntries(prev => [{seq, hash: newHash}, ...prev.slice(0, 19)])
        if (runRef.current) {
            timerRef.current = setTimeout(step, speed)
        }
    }, [speed])

    const start = () => {
        if (runRef.current) return
        runRef.current = true
        setRunning(true)
        timerRef.current = setTimeout(step, 0)
    }

    const pause = () => {
        runRef.current = false
        setRunning(false)
        if (timerRef.current) clearTimeout(timerRef.current)
    }

    const reset = () => {
        pause()
        lastHashRef.current = 'genesis_seed_0000'
        seqRef.current = 0
        setEntries([])
    }

    useEffect(() => {
        if (running) {
            // speed changed while running: nothing, next tick uses new speed naturally
        }
    }, [speed, running])

    useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

    return (
        <div className="px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">PoH 哈希序列</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">持续对上一个哈希值做 SHA256，构建可验证的时间证明</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={reset} className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white">重置</button>
                            {!running
                                ? <button onClick={start}
                                    className="px-4 py-1.5 rounded text-sm bg-orange-500 text-white hover:bg-orange-600">
                                    ▶ 开始生成
                                </button>
                                : <button onClick={pause}
                                    className="px-4 py-1.5 rounded text-sm bg-gray-500 text-white hover:bg-gray-600">
                                    ⏸ 暂停
                                </button>
                            }
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 dark:text-gray-300">生成速度：</span>
                        <input type="range" min={100} max={1000} step={100} value={speed}
                            onChange={e => setSpeed(Number(e.target.value))}
                            className="w-32 accent-orange-500"/>
                        <span className="text-sm text-gray-500">{speed}ms/哈希</span>
                        <span className="text-sm text-gray-600 dark:text-gray-300 ml-4">已生成：<span className="font-bold text-orange-600 dark:text-orange-400">{seqRef.current}</span></span>
                    </div>
                </div>

                {/* 哈希流 */}
                <div className="mb-6 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800 p-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">最新哈希序列（显示最近20条）</h3>
                    {entries.length === 0
                        ? <div className="text-center py-8 text-gray-400">点击"开始生成"开始产生 SHA256 哈希链</div>
                        : <div className="space-y-2">
                            {entries.map((e, i) => (
                                <div key={e.seq} className={`flex items-center gap-4 px-3 py-2 rounded text-sm font-mono ${i === 0 ? 'bg-orange-50 border border-orange-200 dark:bg-orange-900/10 dark:border-orange-800' : 'bg-gray-50 dark:bg-gray-900/50'}`}>
                                    <span className={`w-12 text-right font-sans font-bold shrink-0 ${i === 0 ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'}`}>#{e.seq}</span>
                                    <span className="text-gray-600 dark:text-gray-400 break-all text-xs">{e.hash}</span>
                                    {i === 0 && <span className="shrink-0 text-xs text-orange-500 font-sans">最新</span>}
                                </div>
                            ))}
                        </div>
                    }
                </div>

                {/* 说明：链式结构 */}
                {entries.length >= 2 && (
                    <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">链式结构验证</h3>
                        <div className="text-xs font-mono space-y-1 text-gray-600 dark:text-gray-400">
                            <div>序号 #{entries[1]?.seq}：{entries[1]?.hash.slice(0, 32)}...</div>
                            <div className="text-orange-500 pl-4">↓ SHA256</div>
                            <div>序号 #{entries[0]?.seq}：{entries[0]?.hash.slice(0, 32)}...</div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">任何人都可以重新计算验证：SHA256(哈希N) = 哈希N+1，伪造需要重新计算所有中间步骤</p>
                    </div>
                )}

                <div className="p-4 rounded-lg bg-orange-50 border border-orange-200 dark:bg-orange-900/10 dark:border-orange-800 mb-6">
                    <h3 className="text-sm font-semibold text-orange-800 dark:text-orange-300 mb-1">💡 PoH 的核心：可验证延迟函数</h3>
                    <p className="text-sm text-orange-700 dark:text-orange-400">历史证明（Proof of History）利用 SHA256 的顺序不可并行性：你无法在不逐步计算的情况下跳到第 N 个哈希。这就像一个密码学时钟——生成 N 个哈希证明了至少经过了 N 个计算步骤的时间。Solana 用此为所有交易提供全局时序。</p>
                </div>

                <div className="flex justify-between items-center">
                    <div/>
                    <Link href="/poh/timeline" className="px-4 py-2 rounded-lg text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors">下一步：事件时序 →</Link>
                </div>
            </div>
        </div>
    )
}
