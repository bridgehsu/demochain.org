import React, {useState} from 'react'
import Link from 'next/link'

const ALL_NODES = ['Node1', 'Node2', 'Node3', 'Node4', 'Node5', 'Node6', 'Node7']
const BYZANTINE = new Set(['Node6', 'Node7'])
const TOTAL = ALL_NODES.length
const THRESHOLD = Math.ceil(TOTAL * 2 / 3)

type Phase = 'idle' | 'prevote' | 'precommit' | 'commit' | 'done'

type VoteMap = Record<string, 'yes' | 'no' | null>

function initVotes(): VoteMap {
    return Object.fromEntries(ALL_NODES.map(n => [n, null]))
}

export default function BFTVotePage(): React.ReactElement {
    const [phase, setPhase] = useState<Phase>('idle')
    const [prevoteMap, setPrevoteMap] = useState<VoteMap>(initVotes())
    const [precommitMap, setPrecommitMap] = useState<VoteMap>(initVotes())
    const [commitMap, setCommitMap] = useState<VoteMap>(initVotes())
    const [confirmed, setConfirmed] = useState<boolean | null>(null)

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

    const runConsensus = async () => {
        setPhase('prevote')
        setPrevoteMap(initVotes())
        setPrecommitMap(initVotes())
        setCommitMap(initVotes())
        setConfirmed(null)

        // Prevote phase
        for (const node of ALL_NODES) {
            await sleep(250)
            const vote = BYZANTINE.has(node) ? 'no' : 'yes'
            setPrevoteMap(prev => ({...prev, [node]: vote}))
        }
        await sleep(500)

        // Precommit phase
        setPhase('precommit')
        const prevoteYes = ALL_NODES.filter(n => !BYZANTINE.has(n)).length
        if (prevoteYes >= THRESHOLD) {
            for (const node of ALL_NODES) {
                await sleep(250)
                const vote = BYZANTINE.has(node) ? 'no' : 'yes'
                setPrecommitMap(prev => ({...prev, [node]: vote}))
            }
        }
        await sleep(500)

        // Commit phase
        setPhase('commit')
        const precommitYes = ALL_NODES.filter(n => !BYZANTINE.has(n)).length
        if (precommitYes >= THRESHOLD) {
            for (const node of ALL_NODES) {
                await sleep(200)
                const vote = BYZANTINE.has(node) ? 'no' : 'yes'
                setCommitMap(prev => ({...prev, [node]: vote}))
            }
        }
        await sleep(600)

        const finalYes = ALL_NODES.filter(n => !BYZANTINE.has(n)).length
        setConfirmed(finalYes >= THRESHOLD)
        setPhase('done')
    }

    const reset = () => {
        setPhase('idle')
        setPrevoteMap(initVotes())
        setPrecommitMap(initVotes())
        setCommitMap(initVotes())
        setConfirmed(null)
    }

    const countYes = (map: VoteMap) => Object.values(map).filter(v => v === 'yes').length
    const countNo = (map: VoteMap) => Object.values(map).filter(v => v === 'no').length

    const PHASE_LABELS: Record<Phase, string> = {
        idle: '等待开始',
        prevote: '第一阶段：Prevote（预投票）',
        precommit: '第二阶段：Precommit（预提交）',
        commit: '第三阶段：Commit（确认）',
        done: '共识完成',
    }

    const renderPhaseRow = (label: string, map: VoteMap, active: boolean) => {
        const yesCount = countYes(map)
        const noCount = countNo(map)
        const reached = yesCount >= THRESHOLD
        return (
            <div className={`p-4 rounded-lg border-2 ${active ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 mb-3`}>
                <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-semibold ${active ? 'text-red-700 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>{label}</span>
                    <div className="flex items-center gap-3 text-xs">
                        <span className="text-green-600 dark:text-green-400 font-medium">✓ {yesCount}</span>
                        <span className="text-red-500 font-medium">✗ {noCount}</span>
                        {Object.values(map).some(v => v !== null) && (
                            <span className={`px-1.5 py-0.5 rounded font-medium ${reached ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                                {reached ? `✓ 达到 ${THRESHOLD}/7` : `需要 ${THRESHOLD}/7`}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {ALL_NODES.map(n => {
                        const v = map[n]
                        const isByz = BYZANTINE.has(n)
                        return (
                            <div key={n} className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${v === 'yes' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : v === 'no' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 text-gray-400 dark:bg-gray-700'}`}>
                                <span>{n}</span>
                                {isByz && <span className="text-orange-500">⚠</span>}
                                {v === 'yes' ? ' ✓' : v === 'no' ? ' ✗' : ''}
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <div className="px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">BFT 三阶段共识</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Prevote → Precommit → Commit，需要 ≥2/3 节点投票通过</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={reset} className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white">重置</button>
                            <button onClick={runConsensus} disabled={phase !== 'idle' && phase !== 'done'}
                                className="px-4 py-1.5 rounded text-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">
                                开始共识
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600 dark:text-gray-300">当前阶段：<span className="font-medium text-red-600 dark:text-red-400">{PHASE_LABELS[phase]}</span></span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">Node6/Node7 为拜占庭节点（⚠ 标记）</span>
                    </div>
                </div>

                {renderPhaseRow('Prevote（预投票）', prevoteMap, phase === 'prevote')}
                {renderPhaseRow('Precommit（预提交）', precommitMap, phase === 'precommit')}
                {renderPhaseRow('Commit（确认提交）', commitMap, phase === 'commit')}

                {confirmed !== null && (
                    <div className={`mb-6 p-4 rounded-lg border-2 text-center ${confirmed ? 'border-green-400 bg-green-50 dark:bg-green-900/10 dark:border-green-800' : 'border-red-400 bg-red-50 dark:bg-red-900/10 dark:border-red-800'}`}>
                        <div className={`text-lg font-bold ${confirmed ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                            {confirmed ? '✓ 区块确认成功！达到 2/3 共识' : '✗ 共识失败：拜占庭节点过多'}
                        </div>
                    </div>
                )}

                <div className="p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/10 dark:border-red-800 mb-6">
                    <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">💡 BFT 三阶段投票</h3>
                    <p className="text-sm text-red-700 dark:text-red-400">Tendermint/PBFT 等 BFT 协议通过三轮投票保证安全性：Prevote 收集初步意见，Precommit 锁定倾向，Commit 最终确认。每阶段都需要 ≥2/3 节点同意才能进入下一阶段，拜占庭节点的恶意投票无法影响最终结果。</p>
                </div>

                <div className="flex justify-between items-center">
                    <Link href="/bft/propose" className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">← 提案</Link>
                    <Link href="/bft/chain" className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors">下一步：链视图 →</Link>
                </div>
            </div>
        </div>
    )
}
