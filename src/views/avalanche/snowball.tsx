import React, {useState, useRef, useEffect} from 'react'
import Link from 'next/link'

const N = 20
const K = 6
const ALPHA = 4 // majority threshold within sample
const BETA = 8  // confidence threshold to finalize

type Preference = 'red' | 'blue' | null

type NodeState = {pref: Preference; confidence: number; finalized: boolean}

function initNodes(redCount: number): NodeState[] {
    const prefs: Preference[] = Array.from({length: N}, (_, i) => (i < redCount ? 'red' : 'blue'))
    // shuffle
    for (let i = prefs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [prefs[i], prefs[j]] = [prefs[j], prefs[i]]
    }
    return prefs.map(p => ({pref: p, confidence: 0, finalized: false}))
}

export default function AvalancheSnowballPage(): React.ReactElement {
    const [nodes, setNodes] = useState<NodeState[]>(() => initNodes(11))
    const [round, setRound] = useState(0)
    const [running, setRunning] = useState(false)
    const [redInit, setRedInit] = useState(11)
    const runRef = useRef(false)
    const nodesRef = useRef(nodes)
    const roundRef = useRef(0)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    nodesRef.current = nodes

    const step = () => {
        setNodes(prev => {
            const next = prev.map(node => {
                if (node.finalized) return node
                // sample K random nodes
                const indices = new Set<number>()
                while (indices.size < K) indices.add(Math.floor(Math.random() * N))
                const sample = [...indices].map(i => prev[i])
                const redVotes = sample.filter(s => s.pref === 'red').length
                const blueVotes = sample.filter(s => s.pref === 'blue').length
                const majority: Preference = redVotes >= ALPHA ? 'red' : blueVotes >= ALPHA ? 'blue' : null
                if (!majority) return node
                if (majority === node.pref) {
                    const newConf = node.confidence + 1
                    return {...node, confidence: newConf, finalized: newConf >= BETA}
                } else {
                    return {...node, pref: majority, confidence: 1}
                }
            })
            return next
        })
        setRound(r => r + 1)
        roundRef.current++

        if (runRef.current) {
            const allFinalized = nodesRef.current.every(n => n.finalized)
            if (!allFinalized) {
                timerRef.current = setTimeout(step, 300)
            } else {
                runRef.current = false
                setRunning(false)
            }
        }
    }

    const start = () => {
        if (runRef.current) return
        runRef.current = true
        setRunning(true)
        timerRef.current = setTimeout(step, 200)
    }

    const pause = () => {
        runRef.current = false
        setRunning(false)
        if (timerRef.current) clearTimeout(timerRef.current)
    }

    const reset = () => {
        pause()
        setNodes(initNodes(redInit))
        setRound(0)
        roundRef.current = 0
    }

    useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

    const redCount = nodes.filter(n => n.pref === 'red').length
    const blueCount = nodes.filter(n => n.pref === 'blue').length
    const finalizedCount = nodes.filter(n => n.finalized).length
    const allDone = finalizedCount === N

    const dominantColor = redCount >= blueCount ? 'red' : 'blue'

    return (
        <div className="px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Avalanche 雪球算法</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">重复采样累积信心，信心达 β={BETA} 后节点最终确信并固定偏好</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button onClick={reset} className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white">重置</button>
                            {!running
                                ? <button onClick={start} disabled={allDone}
                                    className="px-3 py-1.5 rounded text-sm border bg-white text-cyan-700 border-cyan-300 hover:bg-cyan-50 disabled:opacity-40 dark:bg-transparent dark:border-cyan-500 dark:text-cyan-400">
                                    ▶ 开始收敛
                                </button>
                                : <button onClick={pause}
                                    className="px-3 py-1.5 rounded text-sm border bg-white text-red-600 border-red-300 hover:bg-red-50 dark:bg-transparent dark:border-red-500 dark:text-red-400">
                                    ⏸ 暂停
                                </button>
                            }
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-300">初始红色：</span>
                        <input type="range" min={0} max={N} value={redInit}
                            onChange={e => setRedInit(Number(e.target.value))}
                            className="w-32 accent-cyan-500"/>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{redInit}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm flex-wrap">
                        <span className="text-gray-600 dark:text-gray-300">第 <span className="font-bold text-cyan-600 dark:text-cyan-400">{round}</span> 轮</span>
                        <span className="text-red-500">红色 {redCount}</span>
                        <span className="text-blue-500">蓝色 {blueCount}</span>
                        <span className="text-gray-500 dark:text-gray-400">已确信 {finalizedCount}/{N}</span>
                    </div>
                </div>

                {/* 节点网格 */}
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">节点状态（格子颜色=偏好，数字=信心值）</h3>
                    <div className="grid grid-cols-10 gap-2">
                        {nodes.map((n, i) => (
                            <div key={i}
                                className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-all duration-200 ${n.pref === 'red' ? (n.finalized ? 'bg-red-600' : 'bg-red-300') : n.pref === 'blue' ? (n.finalized ? 'bg-blue-600' : 'bg-blue-300') : 'bg-gray-300'} ${n.finalized ? 'ring-2 ring-yellow-400' : ''}`}>
                                <span className="text-white text-xs font-bold">{n.confidence}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-300 inline-block"/>红色（低信心）</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-600 inline-block"/>红色（已确信）</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-300 inline-block"/>蓝色（低信心）</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-600 inline-block"/>蓝色（已确信）</span>
                    </div>
                </div>

                {allDone && (
                    <div className={`mb-6 p-4 rounded-lg border-2 text-center ${dominantColor === 'red' ? 'border-red-400 bg-red-50 dark:bg-red-900/10' : 'border-blue-400 bg-blue-50 dark:bg-blue-900/10'}`}>
                        <div className={`text-lg font-bold ${dominantColor === 'red' ? 'text-red-700 dark:text-red-400' : 'text-blue-700 dark:text-blue-400'}`}>
                            全网收敛！所有节点确信 {dominantColor === 'red' ? '红色' : '蓝色'}（共 {round} 轮）
                        </div>
                    </div>
                )}

                <div className="p-4 rounded-lg bg-cyan-50 border border-cyan-200 dark:bg-cyan-900/10 dark:border-cyan-800 mb-6">
                    <h3 className="text-sm font-semibold text-cyan-800 dark:text-cyan-300 mb-1">💡 雪球算法</h3>
                    <p className="text-sm text-cyan-700 dark:text-cyan-400">Snowball 在 Snowflake 基础上增加了信心计数器。每次采样多数同意就信心+1，信心达阈值 β 后最终确信。由于网络中原本多数方更容易积累信心，少数方节点不断被说服转变，最终像雪球一样滚动收敛到一致结果。</p>
                </div>

                <div className="flex justify-between items-center">
                    <Link href="/avalanche" className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">← 采样</Link>
                    <Link href="/avalanche/chain" className="px-4 py-2 rounded-lg text-sm font-medium bg-cyan-600 text-white hover:bg-cyan-700 transition-colors">下一步：链视图 →</Link>
                </div>
            </div>
        </div>
    )
}
