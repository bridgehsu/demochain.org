import React, {useState} from 'react'
import Link from 'next/link'

const ALL_NODES = ['Node1', 'Node2', 'Node3', 'Node4', 'Node5', 'Node6', 'Node7']
const BYZANTINE = new Set(['Node6', 'Node7'])

type ProposalState = 'idle' | 'broadcasting' | 'done'

type Proposal = {height: number; data: string; proposer: string; hash: string}

function fakeHash(s: string): string {
    let h = 0
    for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0 }
    return '0x' + Math.abs(h).toString(16).padStart(8, '0')
}

export default function BFTProposePage(): React.ReactElement {
    const [leader, setLeader] = useState('Node1')
    const [state, setState] = useState<ProposalState>('idle')
    const [received, setReceived] = useState<Set<string>>(new Set())
    const [proposal, setProposal] = useState<Proposal | null>(null)
    const [height, setHeight] = useState(1)

    const propose = async () => {
        setState('broadcasting')
        setReceived(new Set())
        const p: Proposal = {
            height,
            data: `交易批次 #${height}`,
            proposer: leader,
            hash: fakeHash(`${leader}${height}${Date.now()}`),
        }
        setProposal(p)
        // animate broadcasting node by node
        const others = ALL_NODES.filter(n => n !== leader)
        for (const node of others) {
            await new Promise(r => setTimeout(r, 300))
            setReceived(prev => new Set([...prev, node]))
        }
        setState('done')
        setHeight(h => h + 1)
    }

    const reset = () => {
        setState('idle')
        setReceived(new Set())
        setProposal(null)
        setHeight(1)
    }

    return (
        <div className="px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">BFT 区块提案</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Leader 节点发起区块提案，广播给所有节点</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={reset} className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white">重置</button>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="text-sm text-gray-600 dark:text-gray-300">选择 Leader：</label>
                        <select value={leader} onChange={e => setLeader(e.target.value)}
                            className="h-8 px-2 rounded border border-gray-300 text-sm text-gray-900 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:border-red-500">
                            {ALL_NODES.map(n => <option key={n} value={n}>{n}{BYZANTINE.has(n) ? ' (拜占庭)' : ''}</option>)}
                        </select>
                        <button onClick={propose} disabled={state === 'broadcasting'}
                            className="px-4 py-1.5 rounded text-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">
                            {state === 'broadcasting' ? '广播中...' : '发起提案'}
                        </button>
                    </div>
                </div>

                {/* 提案内容 */}
                {proposal && (
                    <div className="mb-6 p-4 rounded-lg border-2 border-red-300 bg-red-50 dark:bg-red-900/10 dark:border-red-800">
                        <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">提案内容</h3>
                        <div className="space-y-1 text-sm text-red-700 dark:text-red-400">
                            <div>区块高度：<span className="font-mono font-bold">#{proposal.height}</span></div>
                            <div>提案数据：<span className="font-medium">{proposal.data}</span></div>
                            <div>提案者：<span className="font-medium">{proposal.proposer}</span></div>
                            <div>提案哈希：<span className="font-mono">{proposal.hash}</span></div>
                        </div>
                    </div>
                )}

                {/* 节点状态 */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                    {ALL_NODES.map(n => {
                        const isLeader = n === leader
                        const isByz = BYZANTINE.has(n)
                        const hasReceived = received.has(n)
                        return (
                            <div key={n} className={`p-4 rounded-lg border-2 text-center transition-all duration-300 ${isLeader ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : hasReceived ? (isByz ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/10' : 'border-green-400 bg-green-50 dark:bg-green-900/10') : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700'}`}>
                                <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm font-bold ${isLeader ? 'bg-red-600' : isByz ? 'bg-orange-500' : hasReceived ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-600'}`}>
                                    {n.replace('Node', 'N')}
                                </div>
                                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{n}</div>
                                <div className="text-xs mt-0.5">
                                    {isLeader ? <span className="text-red-600 dark:text-red-400">Leader</span>
                                        : isByz ? <span className="text-orange-500">拜占庭</span>
                                        : hasReceived ? <span className="text-green-600 dark:text-green-400">已收到</span>
                                        : <span className="text-gray-400">等待中</span>}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {state === 'done' && (
                    <div className="mb-6 p-3 rounded-lg bg-green-50 border border-green-200 dark:bg-green-900/10 dark:border-green-800 text-sm text-green-700 dark:text-green-400 text-center">
                        ✓ 提案已广播至所有节点，进入投票阶段
                    </div>
                )}

                <div className="p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/10 dark:border-red-800 mb-6">
                    <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">💡 BFT 提案与 Leader 选举</h3>
                    <p className="text-sm text-red-700 dark:text-red-400">BFT 协议中，每轮共识由一个 Leader 节点发起提案。Leader 可通过轮换、随机或基于 VRF 的方式选出。拜占庭 Leader 可能发送恶意提案，但后续的投票阶段（需 2/3 节点同意）会阻止其成功。</p>
                </div>

                <div className="flex justify-between items-center">
                    <Link href="/bft" className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">← 节点</Link>
                    <Link href="/bft/vote" className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors">下一步：投票 →</Link>
                </div>
            </div>
        </div>
    )
}
