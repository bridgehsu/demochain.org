import React, {useState} from 'react'
import Link from 'next/link'

type Candidate = {name: string; votes: number; active: boolean; color: string}

const INITIAL: Candidate[] = [
    {name: 'Alice', votes: 4200, active: true, color: 'purple'},
    {name: 'Bob', votes: 3100, active: true, color: 'indigo'},
    {name: 'Charlie', votes: 2800, active: true, color: 'violet'},
    {name: 'Dave', votes: 800, active: false, color: 'fuchsia'},
]

export default function DPosCandidatesPage(): React.ReactElement {
    const [candidates, setCandidates] = useState<Candidate[]>(INITIAL)
    const [log, setLog] = useState<string[]>([])

    const sorted = [...candidates].sort((a, b) => b.votes - a.votes)

    const activate = () => {
        setCandidates(prev => prev.map(c => c.name === 'Dave' ? {...c, active: true} : c))
        setLog(l => ['Dave 成功注册为候选人，状态变为 active', ...l.slice(0, 4)])
    }

    const reset = () => {
        setCandidates(INITIAL)
        setLog([])
    }

    const daveActive = candidates.find(c => c.name === 'Dave')?.active

    return (
        <div className="px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">DPoS 候选人</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">持币者投票选出代表，票数前3名将当选代表并轮流出块</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={reset} className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white">重置</button>
                            <button
                                onClick={activate}
                                disabled={!!daveActive}
                                className="px-3 py-1.5 rounded text-sm border bg-white text-purple-700 border-purple-300 hover:bg-purple-50 disabled:opacity-40 dark:bg-transparent dark:border-purple-500 dark:text-purple-400"
                            >
                                注册候选人 (Dave)
                            </button>
                        </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                        候选人数：<span className="font-bold text-purple-600 dark:text-purple-400">{candidates.filter(c => c.active).length}</span> 人活跃 &nbsp;|&nbsp; 当选名额：<span className="font-bold">前 3 名</span>
                    </div>
                </div>

                {/* 候选人排名 */}
                <div className="space-y-3 mb-6">
                    {sorted.map((c, rank) => {
                        const isElected = rank < 3 && c.active
                        return (
                            <div key={c.name} className={`p-4 rounded-lg border-2 transition-all ${isElected ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/10' : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700'}`}>
                                <div className="flex items-center gap-4">
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${rank < 3 ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300'}`}>
                                        {rank + 1}
                                    </span>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-gray-900 dark:text-white">{c.name}</span>
                                                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${c.active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                                                    {c.active ? 'active' : 'inactive'}
                                                </span>
                                                {isElected && <span className="text-xs px-1.5 py-0.5 rounded bg-purple-600 text-white font-medium">当选代表</span>}
                                            </div>
                                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{c.votes.toLocaleString()} 票</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-500 ${isElected ? 'bg-purple-500' : 'bg-gray-400'}`}
                                                style={{width: `${(c.votes / 4200) * 100}%`}}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* 日志 */}
                {log.length > 0 && (
                    <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">操作记录</h3>
                        {log.map((l, i) => (
                            <div key={i} className="text-sm text-gray-600 dark:text-gray-400 py-0.5">✓ {l}</div>
                        ))}
                    </div>
                )}

                {/* 说明 */}
                <div className="p-4 rounded-lg bg-purple-50 border border-purple-200 dark:bg-purple-900/10 dark:border-purple-800 mb-6">
                    <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-300 mb-1">💡 什么是 DPoS 候选人？</h3>
                    <p className="text-sm text-purple-700 dark:text-purple-400">DPoS（委托权益证明）中，任何人都可以注册成为候选人。持币者将票投给他们信任的候选人，票数最多的前 N 名候选人成为代表（Delegate），负责打包交易和出块。</p>
                </div>

                <div className="flex justify-between items-center">
                    <div/>
                    <Link href="/dpos/vote" className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                        下一步：投票 →
                    </Link>
                </div>
            </div>
        </div>
    )
}
