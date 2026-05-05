import React, {useState, useEffect, useRef} from 'react'
import Link from 'next/link'

const DELEGATES = [
    {name: 'Alice', color: 'purple'},
    {name: 'Bob', color: 'indigo'},
    {name: 'Charlie', color: 'violet'},
]

const COLORS: Record<string, {bg: string; border: string; text: string; badge: string}> = {
    purple: {bg: 'bg-purple-100 dark:bg-purple-900/20', border: 'border-purple-500', text: 'text-purple-700 dark:text-purple-300', badge: 'bg-purple-600'},
    indigo: {bg: 'bg-indigo-100 dark:bg-indigo-900/20', border: 'border-indigo-500', text: 'text-indigo-700 dark:text-indigo-300', badge: 'bg-indigo-600'},
    violet: {bg: 'bg-violet-100 dark:bg-violet-900/20', border: 'border-violet-500', text: 'text-violet-700 dark:text-violet-300', badge: 'bg-violet-600'},
}

export default function DPosRoundsPage(): React.ReactElement {
    const [running, setRunning] = useState(false)
    const [currentIdx, setCurrentIdx] = useState<number | null>(null)
    const [blockCounts, setBlockCounts] = useState<number[]>([0, 0, 0])
    const [totalBlocks, setTotalBlocks] = useState(0)
    const [roundLog, setRoundLog] = useState<{delegate: string; height: number; color: string}[]>([])
    const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const runningRef = useRef(false)
    const idxRef = useRef(0)

    const step = () => {
        const idx = idxRef.current % DELEGATES.length
        const d = DELEGATES[idx]
        setCurrentIdx(idx)
        setBlockCounts(prev => {
            const next = [...prev]
            next[idx]++
            return next
        })
        setTotalBlocks(t => {
            const h = t + 1
            setRoundLog(l => [{delegate: d.name, height: h, color: d.color}, ...l.slice(0, 9)])
            return h
        })
        idxRef.current++
        if (runningRef.current) {
            tickRef.current = setTimeout(step, 1200)
        }
    }

    const start = () => {
        if (runningRef.current) return
        runningRef.current = true
        setRunning(true)
        tickRef.current = setTimeout(step, 400)
    }

    const pause = () => {
        runningRef.current = false
        setRunning(false)
        if (tickRef.current) clearTimeout(tickRef.current)
    }

    const reset = () => {
        pause()
        idxRef.current = 0
        setCurrentIdx(null)
        setBlockCounts([0, 0, 0])
        setTotalBlocks(0)
        setRoundLog([])
    }

    useEffect(() => () => { if (tickRef.current) clearTimeout(tickRef.current) }, [])

    return (
        <div className="px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">DPoS 出块轮次</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">3位当选代表按固定顺序轮流出块</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={reset} className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white">重置</button>
                            {!running
                                ? <button onClick={start} className="px-3 py-1.5 rounded text-sm border bg-white text-purple-700 border-purple-300 hover:bg-purple-50 dark:bg-transparent dark:border-purple-500 dark:text-purple-400">▶ 开始轮次</button>
                                : <button onClick={pause} className="px-3 py-1.5 rounded text-sm border bg-white text-red-700 border-red-300 hover:bg-red-50 dark:bg-transparent dark:border-red-500 dark:text-red-400">⏸ 暂停</button>
                            }
                        </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">已出块：<span className="font-bold text-purple-600 dark:text-purple-400">{totalBlocks}</span> 块</div>
                </div>

                {/* 代表节点 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {DELEGATES.map((d, i) => {
                        const active = currentIdx === i
                        const c = COLORS[d.color]
                        return (
                            <div key={d.name} className={`p-5 rounded-lg border-2 transition-all duration-300 text-center ${active ? `${c.bg} ${c.border} scale-105 shadow-lg` : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700'}`}>
                                <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-lg font-bold ${active ? c.badge : 'bg-gray-300 dark:bg-gray-600'} transition-all duration-300`}>
                                    {d.name[0]}
                                </div>
                                <div className="font-semibold text-gray-900 dark:text-white mb-1">{d.name}</div>
                                {active && <div className={`text-xs font-medium ${c.text} animate-pulse mb-1`}>正在出块...</div>}
                                <div className="text-xs text-gray-500 dark:text-gray-400">出块 <span className="font-bold text-gray-700 dark:text-gray-300">{blockCounts[i]}</span> 次</div>
                            </div>
                        )
                    })}
                </div>

                {/* 出块记录 */}
                <div className="mb-6 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800 p-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">出块记录</h3>
                    {roundLog.length === 0
                        ? <p className="text-sm text-gray-400 text-center py-4">点击"开始轮次"查看出块过程</p>
                        : <div className="space-y-1.5">
                            {roundLog.map((r, i) => {
                                const c = COLORS[r.color]
                                return (
                                    <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded text-sm ${i === 0 ? c.bg : ''}`}>
                                        <span className="text-gray-400 w-8 text-right">#{r.height}</span>
                                        <span className={`font-medium ${c.text}`}>{r.delegate}</span>
                                        <span className="text-gray-400 text-xs">出块</span>
                                        {i === 0 && <span className={`text-xs px-1.5 py-0.5 rounded text-white ${c.badge}`}>最新</span>}
                                    </div>
                                )
                            })}
                        </div>
                    }
                </div>

                <div className="p-4 rounded-lg bg-purple-50 border border-purple-200 dark:bg-purple-900/10 dark:border-purple-800 mb-6">
                    <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-300 mb-1">💡 DPoS 出块轮次</h3>
                    <p className="text-sm text-purple-700 dark:text-purple-400">与 PoS 的随机加权选择不同，DPoS 采用固定顺序轮换：代表1出块→代表2出块→代表3出块→循环。这保证了出块的公平性和可预测性，每个代表都有均等的出块机会。</p>
                </div>

                <div className="flex justify-between items-center">
                    <Link href="/dpos/vote" className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">← 投票</Link>
                    <Link href="/dpos/chain" className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors">下一步：链视图 →</Link>
                </div>
            </div>
        </div>
    )
}
