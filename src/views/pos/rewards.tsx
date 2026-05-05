import React, {useState, useEffect, useRef} from 'react'
import Link from 'next/link'

type Validator = {name: string; stake: number; color: string; earned: number; blocks: number}

const INIT: Validator[] = [
    {name: 'Alice', stake: 3200, color: 'blue', earned: 0, blocks: 0},
    {name: 'Bob', stake: 1800, color: 'purple', earned: 0, blocks: 0},
    {name: 'Charlie', stake: 2500, color: 'green', earned: 0, blocks: 0},
    {name: 'Dave', stake: 500, color: 'orange', earned: 0, blocks: 0},
]

const BAR: Record<string, string> = {
    blue: 'bg-blue-500', purple: 'bg-purple-500', green: 'bg-green-500', orange: 'bg-orange-500',
}
const TEXT: Record<string, string> = {
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    green: 'text-green-600 dark:text-green-400',
    orange: 'text-orange-600 dark:text-orange-400',
}

function weightedPick(validators: Validator[]): number {
    const total = validators.reduce((s, v) => s + v.stake, 0)
    let r = Math.random() * total
    for (let i = 0; i < validators.length; i++) {
        r -= validators[i].stake
        if (r <= 0) return i
    }
    return 0
}

export default function RewardsPage(): React.ReactElement {
    const [validators, setValidators] = useState<Validator[]>(INIT)
    const [blockReward, setBlockReward] = useState(2)
    const [apy, setApy] = useState(5)
    const [running, setRunning] = useState(false)
    const [totalBlocks, setTotalBlocks] = useState(0)
    const [currentProducer, setCurrentProducer] = useState<number | null>(null)
    const runRef = useRef(false)

    const total = validators.reduce((s, v) => s + v.stake, 0)

    const runSimulation = async () => {
        if (running) {
            runRef.current = false
            setRunning(false)
            return
        }
        setRunning(true)
        runRef.current = true
        const snapshot = [...validators]
        let blocks = totalBlocks
        while (runRef.current) {
            const i = weightedPick(snapshot)
            const reward = blockReward
            snapshot[i].earned += reward
            snapshot[i].blocks += 1
            blocks++
            setCurrentProducer(i)
            setValidators([...snapshot])
            setTotalBlocks(blocks)
            await new Promise(r => setTimeout(r, 400))
        }
        setCurrentProducer(null)
    }

    const reset = () => {
        runRef.current = false
        setRunning(false)
        setValidators(INIT)
        setTotalBlocks(0)
        setCurrentProducer(null)
    }

    useEffect(() => () => { runRef.current = false }, [])

    const maxEarned = Math.max(...validators.map(v => v.earned), 1)

    return (
        <div className="px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">PoS 奖励机制</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">验证者出块获得奖励，质押越多收益越高</p>
                        </div>
                        <button onClick={reset} className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white">重置</button>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-700 dark:text-gray-300">每块奖励</label>
                            <input type="number" value={blockReward} onChange={e => setBlockReward(Number(e.target.value))}
                                min={1} max={10}
                                className="w-16 h-8 px-2 rounded border border-gray-300 text-sm text-gray-900 bg-white dark:bg-black/20 dark:border-white/30 dark:text-white focus:outline-none"/>
                            <span className="text-sm text-gray-500">ETH</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-700 dark:text-gray-300">年化收益率</label>
                            <input type="number" value={apy} onChange={e => setApy(Number(e.target.value))}
                                min={1} max={20}
                                className="w-16 h-8 px-2 rounded border border-gray-300 text-sm text-gray-900 bg-white dark:bg-black/20 dark:border-white/30 dark:text-white focus:outline-none"/>
                            <span className="text-sm text-gray-500">%</span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">已出 <span className="font-bold text-gray-900 dark:text-white">{totalBlocks}</span> 块</div>
                    </div>
                </div>

                {/* APY 预览 */}
                <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {validators.map(v => {
                        const yearlyReward = Math.floor(v.stake * apy / 100)
                        return (
                            <div key={v.name} className="p-3 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`w-2 h-2 rounded-full ${BAR[v.color]}`}/>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{v.name}</span>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">质押 {v.stake.toLocaleString()}</div>
                                <div className={`text-sm font-bold mt-1 ${TEXT[v.color]}`}>年收益 ≈ {yearlyReward.toLocaleString()} ETH</div>
                            </div>
                        )
                    })}
                </div>

                {/* 实时奖励 */}
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">实时出块奖励</h3>
                    <div className="space-y-3">
                        {validators.map((v, i) => (
                            <div key={v.name} className={`flex items-center gap-3 p-2 rounded-lg transition-all ${currentProducer === i ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}>
                                <div className="flex items-center gap-2 w-20">
                                    <span className={`w-2 h-2 rounded-full ${BAR[v.color]}`}/>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{v.name}</span>
                                    {currentProducer === i && <span className="text-xs">⛏</span>}
                                </div>
                                <div className="flex-1">
                                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                        <div className={`h-2 rounded-full transition-all duration-300 ${BAR[v.color]}`}
                                            style={{width: `${maxEarned > 0 ? v.earned / maxEarned * 100 : 0}%`}}/>
                                    </div>
                                </div>
                                <div className="w-28 text-right text-sm">
                                    <span className={`font-bold ${TEXT[v.color]}`}>{v.earned.toFixed(0)} ETH</span>
                                    <span className="text-xs text-gray-400 ml-1">({v.blocks}块)</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 mb-6">
                    <button onClick={runSimulation}
                        className={`px-4 py-2 rounded text-sm border transition-colors ${running ? 'bg-white text-red-700 border-red-300 hover:bg-red-50 dark:bg-transparent dark:border-red-500 dark:text-red-400' : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50 dark:bg-transparent dark:border-blue-500 dark:text-blue-400'}`}>
                        {running ? '⏹ 停止模拟' : '▶ 开始模拟出块'}
                    </button>
                </div>

                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-900/10 dark:border-blue-800 mb-6">
                    <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">💡 PoS 奖励 vs PoW 奖励</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400">PoS 出块者无需消耗大量电力，奖励直接来自新增发行的代币（通胀）或交易手续费。质押越多、时间越长，累计收益越高。</p>
                </div>

                <div className="flex justify-between items-center">
                    <Link href="/pos/slashing" className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">← 惩罚</Link>
                    <Link href="/pos/chain" className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">下一步：链 →</Link>
                </div>
            </div>
        </div>
    )
}
