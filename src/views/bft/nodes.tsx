import React, {useState} from 'react'
import Link from 'next/link'

type NodeStatus = 'normal' | 'byzantine'

type BFTNode = {name: string; status: NodeStatus}

const INITIAL: BFTNode[] = Array.from({length: 7}, (_, i) => ({
    name: `Node${i + 1}`,
    status: 'normal' as NodeStatus,
}))

export default function BFTNodesPage(): React.ReactElement {
    const [nodes, setNodes] = useState<BFTNode[]>(INITIAL)

    const toggle = (name: string) => {
        setNodes(prev => prev.map(n => n.name === name ? {...n, status: n.status === 'byzantine' ? 'normal' : 'byzantine'} : n))
    }

    const reset = () => setNodes(INITIAL)

    const normalCount = nodes.filter(n => n.status === 'normal').length
    const byzantineCount = nodes.filter(n => n.status === 'byzantine').length
    const threshold = Math.ceil(nodes.length * 2 / 3)
    const safe = normalCount >= threshold

    return (
        <div className="px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">BFT 网络节点</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">点击节点将其标记为拜占庭（恶意）节点，观察安全条件变化</p>
                        </div>
                        <button onClick={reset} className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white">重置</button>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                        <span className="text-gray-600 dark:text-gray-300">正常节点：<span className="font-bold text-green-600 dark:text-green-400">{normalCount}</span></span>
                        <span className="text-gray-600 dark:text-gray-300">拜占庭节点：<span className="font-bold text-red-600 dark:text-red-400">{byzantineCount}</span></span>
                        <span className={`font-medium px-2 py-0.5 rounded text-xs ${safe ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {safe ? '✓ 网络安全' : '✗ 安全条件不满足'}
                        </span>
                    </div>
                </div>

                {/* 节点网格 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {nodes.map(n => {
                        const isByz = n.status === 'byzantine'
                        return (
                            <button
                                key={n.name}
                                onClick={() => toggle(n.name)}
                                className={`p-5 rounded-lg border-2 text-center transition-all duration-200 cursor-pointer hover:scale-105 ${isByz ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-red-300'}`}
                            >
                                <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold ${isByz ? 'bg-red-500' : 'bg-gray-400 dark:bg-gray-600'}`}>
                                    {n.name.replace('Node', 'N')}
                                </div>
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{n.name}</div>
                                <div className={`text-xs mt-1 font-medium ${isByz ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                    {isByz ? '拜占庭' : '正常'}
                                </div>
                            </button>
                        )
                    })}
                </div>

                {/* 安全条件分析 */}
                <div className={`mb-6 p-4 rounded-lg border-2 ${safe ? 'border-green-300 bg-green-50 dark:bg-green-900/10 dark:border-green-800' : 'border-red-300 bg-red-50 dark:bg-red-900/10 dark:border-red-800'}`}>
                    <h3 className={`text-sm font-semibold mb-2 ${safe ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                        安全条件分析
                    </h3>
                    <div className="space-y-1 text-sm">
                        <div className="text-gray-600 dark:text-gray-400">总节点数：<span className="font-bold">{nodes.length}</span></div>
                        <div className="text-gray-600 dark:text-gray-400">安全阈值：正常节点 ≥ ⌈{nodes.length} × 2/3⌉ = <span className="font-bold">{threshold}</span> 个</div>
                        <div className="text-gray-600 dark:text-gray-400">当前正常节点：<span className={`font-bold ${safe ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{normalCount}</span> 个</div>
                        <div className={`font-medium ${safe ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                            {safe ? `✓ 满足条件：${normalCount} ≥ ${threshold}，网络可达成共识` : `✗ 不满足：${normalCount} < ${threshold}，拜占庭节点过多，共识可能被破坏`}
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/10 dark:border-red-800 mb-6">
                    <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">💡 拜占庭容错原理</h3>
                    <p className="text-sm text-red-700 dark:text-red-400">拜占庭将军问题描述了分布式系统中节点可能发送错误信息的场景。BFT 算法能够在最多 f = ⌊(n-1)/3⌋ 个恶意节点的情况下保证共识，即当 n ≥ 3f+1 时系统安全。</p>
                </div>

                <div className="flex justify-between items-center">
                    <div/>
                    <Link href="/bft/propose" className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors">下一步：区块提案 →</Link>
                </div>
            </div>
        </div>
    )
}
