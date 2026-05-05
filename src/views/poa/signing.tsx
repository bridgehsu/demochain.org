import React, {useState, useRef, useEffect} from 'react'
import Link from 'next/link'

const AUTHORITIES = ['Node1', 'Node2', 'Node3', 'Node4', 'Node5']

type SignRecord = {node: string; height: number; timestamp: string; sigHash: string}

function fakeHash(s: string): string {
    let h = 0
    for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0 }
    return '0x' + Math.abs(h).toString(16).padStart(8, '0') + Math.abs(h * 37).toString(16).padStart(6, '0')
}

export default function PoASigningPage(): React.ReactElement {
    const [currentIdx, setCurrentIdx] = useState<number | null>(null)
    const [records, setRecords] = useState<SignRecord[]>([])
    const [signing, setSigning] = useState(false)
    const [running, setRunning] = useState(false)
    const runRef = useRef(false)
    const roundRef = useRef(0)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const doSign = async () => {
        setSigning(true)
        const idx = roundRef.current % AUTHORITIES.length
        setCurrentIdx(idx)
        await new Promise(r => setTimeout(r, 800))
        const node = AUTHORITIES[idx]
        const height = roundRef.current + 1
        const ts = new Date().toLocaleTimeString()
        const sigHash = fakeHash(`${node}${height}${ts}`)
        setRecords(prev => [{node, height, timestamp: ts, sigHash}, ...prev.slice(0, 9)])
        roundRef.current++
        setSigning(false)
        if (runRef.current) {
            timerRef.current = setTimeout(doSign, 1200)
        } else {
            setCurrentIdx(null)
        }
    }

    const startAuto = () => {
        runRef.current = true
        setRunning(true)
        doSign()
    }

    const pause = () => {
        runRef.current = false
        setRunning(false)
        if (timerRef.current) clearTimeout(timerRef.current)
    }

    const reset = () => {
        pause()
        roundRef.current = 0
        setCurrentIdx(null)
        setRecords([])
    }

    const manualSign = () => {
        if (!signing && !running) doSign()
    }

    useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

    return (
        <div className="px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">PoA 签名出块</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">权威节点轮流对区块签名，签名即出块</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button onClick={reset} className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white">重置</button>
                            <button onClick={manualSign} disabled={signing || running}
                                className="px-3 py-1.5 rounded text-sm border bg-white text-green-700 border-green-300 hover:bg-green-50 disabled:opacity-40 dark:bg-transparent dark:border-green-500 dark:text-green-400">
                                单步出块
                            </button>
                            {!running
                                ? <button onClick={startAuto} disabled={signing}
                                    className="px-3 py-1.5 rounded text-sm bg-green-600 text-white hover:bg-green-700 disabled:opacity-40">
                                    ▶ 自动出块
                                </button>
                                : <button onClick={pause}
                                    className="px-3 py-1.5 rounded text-sm bg-red-500 text-white hover:bg-red-600">
                                    ⏸ 暂停
                                </button>
                            }
                        </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                        已出块：<span className="font-bold text-green-600 dark:text-green-400">{records.length}</span> 块 &nbsp;|&nbsp; 下一签名者：<span className="font-medium">{AUTHORITIES[roundRef.current % AUTHORITIES.length]}</span>
                    </div>
                </div>

                {/* 节点网格 */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                    {AUTHORITIES.map((node, i) => {
                        const active = currentIdx === i
                        return (
                            <div key={node} className={`p-4 rounded-lg border-2 text-center transition-all duration-300 ${active ? 'border-green-500 bg-green-50 dark:bg-green-900/20 scale-105 shadow-lg' : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700'}`}>
                                <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm font-bold transition-all ${active ? 'bg-green-600' : 'bg-gray-400 dark:bg-gray-600'}`}>
                                    {i + 1}
                                </div>
                                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{node}</div>
                                {active && <div className="text-xs text-green-600 dark:text-green-400 animate-pulse mt-1">签名中...</div>}
                            </div>
                        )
                    })}
                </div>

                {/* 签名记录 */}
                <div className="mb-6 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800 p-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">签名记录</h3>
                    {records.length === 0
                        ? <p className="text-sm text-gray-400 text-center py-4">点击"单步出块"或"自动出块"开始</p>
                        : <div className="space-y-2">
                            {records.map((r, i) => (
                                <div key={i} className={`p-3 rounded-lg text-sm ${i === 0 ? 'bg-green-50 border border-green-200 dark:bg-green-900/10 dark:border-green-800' : 'bg-gray-50 dark:bg-gray-900/50'}`}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-gray-900 dark:text-white">#{r.height} &nbsp;·&nbsp; {r.node}</span>
                                        <span className="text-xs text-gray-400">{r.timestamp}</span>
                                    </div>
                                    <div className="font-mono text-xs text-green-700 dark:text-green-400">签名: {r.sigHash}</div>
                                </div>
                            ))}
                        </div>
                    }
                </div>

                <div className="p-4 rounded-lg bg-green-50 border border-green-200 dark:bg-green-900/10 dark:border-green-800 mb-6">
                    <h3 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-1">💡 PoA 签名出块</h3>
                    <p className="text-sm text-green-700 dark:text-green-400">PoA 中权威节点使用私钥对区块签名，其他节点验证签名来确认出块者身份。无需复杂的共识投票，签名即代表授权。出块速度极快（可达毫秒级），适合需要高吞吐量的企业级场景。</p>
                </div>

                <div className="flex justify-between items-center">
                    <Link href="/poa" className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">← 权威节点</Link>
                    <Link href="/poa/chain" className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors">下一步：链视图 →</Link>
                </div>
            </div>
        </div>
    )
}
