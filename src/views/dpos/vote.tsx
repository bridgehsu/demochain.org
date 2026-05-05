import React, {useState} from 'react'
import Link from 'next/link'

type Candidate = {name: string; votes: number}

const INITIAL_CANDIDATES: Candidate[] = [
    {name: 'Alice', votes: 2000},
    {name: 'Bob', votes: 1500},
    {name: 'Charlie', votes: 1800},
    {name: 'Dave', votes: 300},
]

const MY_TOTAL = 1000

export default function DPosVotePage(): React.ReactElement {
    const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES)
    const [myVotes, setMyVotes] = useState<Record<string, number>>({Alice: 0, Bob: 0, Charlie: 0, Dave: 0})
    const [inputs, setInputs] = useState<Record<string, string>>({Alice: '250', Bob: '250', Charlie: '250', Dave: '250'})
    const [log, setLog] = useState<string[]>([])

    const usedVotes = Object.values(myVotes).reduce((s, v) => s + v, 0)
    const remaining = MY_TOTAL - usedVotes

    const vote = (name: string) => {
        const amt = parseInt(inputs[name] || '0')
        if (!amt || amt <= 0 || amt > remaining) return
        setCandidates(prev => prev.map(c => c.name === name ? {...c, votes: c.votes + amt} : c))
        setMyVotes(prev => ({...prev, [name]: (prev[name] || 0) + amt}))
        setLog(l => [`投 ${amt} 票给 ${name}，已用 ${usedVotes + amt}/${MY_TOTAL} 票`, ...l.slice(0, 4)])
    }

    const withdraw = (name: string) => {
        const myAmt = myVotes[name] || 0
        if (!myAmt) return
        setCandidates(prev => prev.map(c => c.name === name ? {...c, votes: c.votes - myAmt} : c))
        setMyVotes(prev => ({...prev, [name]: 0}))
        setLog(l => [`从 ${name} 撤回 ${myAmt} 票`, ...l.slice(0, 4)])
    }

    const reset = () => {
        setCandidates(INITIAL_CANDIDATES)
        setMyVotes({Alice: 0, Bob: 0, Charlie: 0, Dave: 0})
        setLog([])
    }

    const sorted = [...candidates].sort((a, b) => b.votes - a.votes)
    const maxVotes = Math.max(...candidates.map(c => c.votes))

    return (
        <div className="px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">DPoS 投票</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">将你的 {MY_TOTAL} 票分配给候选人，票数前3名当选代表</p>
                        </div>
                        <button onClick={reset} className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white">重置</button>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600 dark:text-gray-300">我的可用票数：<span className="font-bold text-purple-600 dark:text-purple-400">{remaining}</span> / {MY_TOTAL}</span>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full transition-all" style={{width: `${(usedVotes / MY_TOTAL) * 100}%`}}/>
                        </div>
                    </div>
                </div>

                {/* 候选人列表 */}
                <div className="space-y-3 mb-6">
                    {sorted.map((c, rank) => {
                        const isElected = rank < 3
                        const pct = maxVotes > 0 ? (c.votes / maxVotes) * 100 : 0
                        return (
                            <div key={c.name} className={`p-4 rounded-lg border-2 ${isElected ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/10' : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700'}`}>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isElected ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300'}`}>{rank + 1}</span>
                                    <span className="font-semibold text-gray-900 dark:text-white flex-1">{c.name}</span>
                                    {isElected && <span className="text-xs px-1.5 py-0.5 rounded bg-purple-600 text-white font-medium">当选代表</span>}
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{c.votes.toLocaleString()} 票</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                                    <div className={`h-2 rounded-full transition-all duration-500 ${isElected ? 'bg-purple-500' : 'bg-gray-400'}`} style={{width: `${pct}%`}}/>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">我已投：<span className="font-medium text-purple-600 dark:text-purple-400">{myVotes[c.name] || 0}</span></span>
                                    <input
                                        type="number"
                                        min={1}
                                        value={inputs[c.name] || ''}
                                        onChange={e => setInputs(p => ({...p, [c.name]: e.target.value}))}
                                        className="w-20 h-7 px-2 rounded border border-gray-300 text-sm text-gray-900 bg-white dark:bg-black/20 dark:border-white/30 dark:text-white focus:outline-none focus:border-purple-500"
                                    />
                                    <button onClick={() => vote(c.name)} disabled={remaining <= 0}
                                        className="px-3 py-1 rounded text-xs border bg-white text-purple-700 border-purple-300 hover:bg-purple-50 disabled:opacity-50 dark:bg-transparent dark:border-purple-500 dark:text-purple-400">
                                        投票
                                    </button>
                                    <button onClick={() => withdraw(c.name)} disabled={!myVotes[c.name]}
                                        className="px-3 py-1 rounded text-xs border bg-white text-gray-600 border-gray-300 hover:bg-gray-50 disabled:opacity-40 dark:bg-transparent dark:border-gray-500 dark:text-gray-400">
                                        撤回
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {log.length > 0 && (
                    <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">操作记录</h3>
                        {log.map((l, i) => <div key={i} className="text-sm text-gray-600 dark:text-gray-400 py-0.5">✓ {l}</div>)}
                    </div>
                )}

                <div className="p-4 rounded-lg bg-purple-50 border border-purple-200 dark:bg-purple-900/10 dark:border-purple-800 mb-6">
                    <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-300 mb-1">💡 委托投票机制</h3>
                    <p className="text-sm text-purple-700 dark:text-purple-400">DPoS 中持币者不直接参与出块，而是将票委托给信任的候选人。票数最多的前 N 名候选人成为代表，代替所有持币者打包区块。你可以随时撤回投票，重新分配。</p>
                </div>

                <div className="flex justify-between items-center">
                    <Link href="/dpos" className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">← 候选人</Link>
                    <Link href="/dpos/rounds" className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors">下一步：轮次 →</Link>
                </div>
            </div>
        </div>
    )
}
