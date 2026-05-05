import React, {useState} from 'react'
import Link from 'next/link'

type Authority = {name: string; org: string; status: 'active' | 'inactive' | 'suspended'; trust: number}

const INITIAL: Authority[] = [
    {name: 'Node1', org: '银行机构A', status: 'active', trust: 5},
    {name: 'Node2', org: '监管机构B', status: 'active', trust: 5},
    {name: 'Node3', org: '企业联盟C', status: 'active', trust: 4},
    {name: 'Node4', org: '研究机构D', status: 'inactive', trust: 3},
    {name: 'Node5', org: '政府部门E', status: 'active', trust: 5},
]

const STATUS_STYLE: Record<string, string> = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    inactive: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
    suspended: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
}

const STATUS_LABEL: Record<string, string> = {
    active: '活跃',
    inactive: '未激活',
    suspended: '已暂停',
}

export default function PoAAuthorityPage(): React.ReactElement {
    const [nodes, setNodes] = useState<Authority[]>(INITIAL)
    const [log, setLog] = useState<string[]>([])

    const activate = () => {
        setNodes(prev => prev.map(n => n.name === 'Node4' ? {...n, status: 'active'} : n))
        setLog(l => ['Node4（研究机构D）已添加为权威节点', ...l.slice(0, 4)])
    }

    const suspend = (name: string) => {
        setNodes(prev => prev.map(n => n.name === name ? {...n, status: n.status === 'suspended' ? 'active' : 'suspended'} : n))
        const node = nodes.find(n => n.name === name)
        const action = node?.status === 'suspended' ? '恢复' : '暂停'
        setLog(l => [`${name} 已${action}`, ...l.slice(0, 4)])
    }

    const reset = () => { setNodes(INITIAL); setLog([]) }

    const activeCount = nodes.filter(n => n.status === 'active').length

    return (
        <div className="px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">PoA 权威节点</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">经过认证的可信机构，无需质押或算力即可参与出块</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button onClick={reset} className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white">重置</button>
                            <button onClick={activate} disabled={nodes.find(n => n.name === 'Node4')?.status === 'active'}
                                className="px-3 py-1.5 rounded text-sm border bg-white text-green-700 border-green-300 hover:bg-green-50 disabled:opacity-40 dark:bg-transparent dark:border-green-500 dark:text-green-400">
                                添加 Node4
                            </button>
                        </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                        活跃节点：<span className="font-bold text-green-600 dark:text-green-400">{activeCount}</span> / {nodes.length}
                    </div>
                </div>

                <div className="space-y-3 mb-6">
                    {nodes.map(n => (
                        <div key={n.name} className={`p-4 rounded-lg border-2 transition-all ${n.status === 'active' ? 'border-green-300 bg-green-50 dark:bg-green-900/10 dark:border-green-800' : n.status === 'suspended' ? 'border-red-300 bg-red-50 dark:bg-red-900/10 dark:border-red-800' : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${n.status === 'active' ? 'bg-green-600' : n.status === 'suspended' ? 'bg-red-500' : 'bg-gray-400'}`}>
                                    {n.name.replace('Node', 'N')}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="font-semibold text-gray-900 dark:text-white">{n.name}</span>
                                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${STATUS_STYLE[n.status]}`}>{STATUS_LABEL[n.status]}</span>
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{n.org}</div>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-xs text-gray-400">信任等级：</span>
                                        {Array.from({length: 5}).map((_, i) => (
                                            <span key={i} className={`text-xs ${i < n.trust ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`}>★</span>
                                        ))}
                                    </div>
                                </div>
                                {n.status !== 'inactive' && (
                                    <button onClick={() => suspend(n.name)}
                                        className={`px-3 py-1 rounded text-xs border ${n.status === 'suspended' ? 'text-green-700 border-green-300 hover:bg-green-50 dark:text-green-400 dark:border-green-700' : 'text-red-700 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700'} bg-white dark:bg-transparent`}>
                                        {n.status === 'suspended' ? '恢复' : '暂停'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {log.length > 0 && (
                    <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">操作记录</h3>
                        {log.map((l, i) => <div key={i} className="text-sm text-gray-600 dark:text-gray-400 py-0.5">✓ {l}</div>)}
                    </div>
                )}

                <div className="p-4 rounded-lg bg-green-50 border border-green-200 dark:bg-green-900/10 dark:border-green-800 mb-6">
                    <h3 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-1">💡 什么是 PoA？</h3>
                    <p className="text-sm text-green-700 dark:text-green-400">权威证明（Proof of Authority）中，出块权只授予经过身份认证的可信机构。节点无需质押代币或消耗算力，靠身份信誉作保证。常用于企业联盟链、私有链场景，出块速度极快，但中心化程度较高。</p>
                </div>

                <div className="flex justify-between items-center">
                    <div/>
                    <Link href="/poa/signing" className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors">下一步：签名出块 →</Link>
                </div>
            </div>
        </div>
    )
}
