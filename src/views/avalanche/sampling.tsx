import React, {useState} from 'react'
import Link from 'next/link'

const TOTAL_NODES = 20
const K = 6 // sample size

type Preference = 'red' | 'blue'

function initNodes(redCount: number): Preference[] {
    return Array.from({length: TOTAL_NODES}, (_, i) => i < redCount ? 'red' : 'blue')
}

export default function AvalancheSamplingPage(): React.ReactElement {
    const [redCount, setRedCount] = useState(12)
    const [nodes, setNodes] = useState<Preference[]>(() => initNodes(12))
    const [sampled, setSampled] = useState<Set<number>>(new Set())
    const [result, setResult] = useState<{red: number; blue: number; majority: Preference | null} | null>(null)
    const [sampling, setSampling] = useState(false)

    const applyRatio = () => {
        const shuffled = initNodes(redCount)
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        setNodes(shuffled)
        setSampled(new Set())
        setResult(null)
    }

    const doSample = async () => {
        setSampling(true)
        setSampled(new Set())
        setResult(null)
        // pick K random indices
        const indices = new Set<number>()
        while (indices.size < K) {
            indices.add(Math.floor(Math.random() * TOTAL_NODES))
        }
        // animate reveal one by one
        const arr = [...indices]
        for (let i = 0; i < arr.length; i++) {
            await new Promise(r => setTimeout(r, 150))
            setSampled(prev => new Set([...prev, arr[i]]))
        }
        const redVotes = arr.filter(i => nodes[i] === 'red').length
        const blueVotes = arr.filter(i => nodes[i] === 'blue').length
        setResult({
            red: redVotes,
            blue: blueVotes,
            majority: redVotes > blueVotes ? 'red' : blueVotes > redVotes ? 'blue' : null,
        })
        setSampling(false)
    }

    const reset = () => {
        setNodes(initNodes(redCount))
        setSampled(new Set())
        setResult(null)
    }

    const blueCount = TOTAL_NODES - redCount

    return (
        <div className="px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Avalanche 随机采样</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">从 {TOTAL_NODES} 个节点中随机采样 k={K} 个，统计多数偏好</p>
                        </div>
                        <button onClick={reset} className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white">重置</button>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-300">红色（支持）节点数：</span>
                            <input type="range" min={0} max={TOTAL_NODES} value={redCount}
                                onChange={e => setRedCount(Number(e.target.value))}
                                className="w-32 accent-cyan-500"/>
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300 w-6">{redCount}</span>
                        </div>
                        <button onClick={applyRatio}
                            className="px-3 py-1.5 rounded text-sm border bg-white text-cyan-700 border-cyan-300 hover:bg-cyan-50 dark:bg-transparent dark:border-cyan-500 dark:text-cyan-400">
                            应用比例
                        </button>
                        <button onClick={doSample} disabled={sampling}
                            className="px-4 py-1.5 rounded text-sm bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50">
                            {sampling ? '采样中...' : '开始采样'}
                        </button>
                    </div>
                </div>

                {/* 节点网格 */}
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">节点偏好（{TOTAL_NODES} 个节点）</h3>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"/>红色 {redCount}</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block"/>蓝色 {blueCount}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-10 gap-2">
                        {nodes.map((pref, i) => {
                            const isSampled = sampled.has(i)
                            return (
                                <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold text-white transition-all duration-200 ${pref === 'red' ? 'bg-red-400' : 'bg-blue-400'} ${isSampled ? 'ring-4 ring-yellow-400 scale-110 shadow-lg' : ''}`}>
                                    {i + 1}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* 采样结果 */}
                {result && (
                    <div className="mb-6 p-4 rounded-lg border-2 border-cyan-300 bg-cyan-50 dark:bg-cyan-900/10 dark:border-cyan-800">
                        <h3 className="text-sm font-semibold text-cyan-800 dark:text-cyan-300 mb-2">采样结果（k={K}）</h3>
                        <div className="flex items-center gap-6 text-sm mb-2">
                            <span className="text-red-600 dark:text-red-400 font-medium">红色：{result.red} 票</span>
                            <span className="text-blue-600 dark:text-blue-400 font-medium">蓝色：{result.blue} 票</span>
                            {result.majority
                                ? <span className={`font-bold px-2 py-0.5 rounded text-white ${result.majority === 'red' ? 'bg-red-500' : 'bg-blue-500'}`}>
                                    多数偏好：{result.majority === 'red' ? '红色' : '蓝色'}
                                </span>
                                : <span className="text-gray-500">平局</span>
                            }
                        </div>
                        <p className="text-xs text-cyan-700 dark:text-cyan-400">节点收到采样结果后，若多数支持某偏好，将自己的信心值 +1</p>
                    </div>
                )}

                <div className="p-4 rounded-lg bg-cyan-50 border border-cyan-200 dark:bg-cyan-900/10 dark:border-cyan-800 mb-6">
                    <h3 className="text-sm font-semibold text-cyan-800 dark:text-cyan-300 mb-1">💡 Avalanche 采样原理</h3>
                    <p className="text-sm text-cyan-700 dark:text-cyan-400">Avalanche 中每个节点不向所有节点广播，而是随机采样 k 个节点询问其偏好。若多数（如 &gt;k/2）回答支持某选项，自己也倾向该选项并累积信心值。重复多轮后，全网迅速收敛到一致结论，通信量仅为 O(log n)。</p>
                </div>

                <div className="flex justify-between items-center">
                    <div/>
                    <Link href="/avalanche/snowball" className="px-4 py-2 rounded-lg text-sm font-medium bg-cyan-600 text-white hover:bg-cyan-700 transition-colors">下一步：雪球算法 →</Link>
                </div>
            </div>
        </div>
    )
}
