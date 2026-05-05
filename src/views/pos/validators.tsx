import React, {useState, useCallback} from 'react'
import Link from 'next/link'

type Validator = {name: string; stake: number; color: string; selected: number}

const INIT: Validator[] = [
    {name: 'Alice', stake: 3200, color: 'blue', selected: 0},
    {name: 'Bob', stake: 1800, color: 'purple', selected: 0},
    {name: 'Charlie', stake: 2500, color: 'green', selected: 0},
    {name: 'Dave', stake: 500, color: 'orange', selected: 0},
]

const BAR: Record<string, string> = {
    blue: 'bg-blue-500', purple: 'bg-purple-500', green: 'bg-green-500', orange: 'bg-orange-500',
}
const BADGE: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
}

function weightedRandom(validators: Validator[]): number {
    const total = validators.reduce((s, v) => s + v.stake, 0)
    let r = Math.random() * total
    for (let i = 0; i < validators.length; i++) {
        r -= validators[i].stake
        if (r <= 0) return i
    }
    return validators.length - 1
}

export default function ValidatorsPage(): React.ReactElement {
    const [validators, setValidators] = useState<Validator[]>(INIT)
    const [current, setCurrent] = useState<number | null>(null)
    const [running, setRunning] = useState(false)
    const [rounds, setRounds] = useState(0)
    const [log, setLog] = useState<{name: string; color: string}[]>([])

    const total = validators.reduce((s, v) => s + v.stake, 0)

    const selectOne = useCallback(() => {
        const i = weightedRandom(validators)
        setCurrent(i)
        setValidators(prev => prev.map((v, idx) => idx === i ? {...v, selected: v.selected + 1} : v))
        setRounds(r => r + 1)
        setLog(l => [{name: validators[i].name, color: validators[i].color}, ...l.slice(0, 9)])
    }, [validators])

    const runMany = useCallback(async () => {
        setRunning(true)
        const counts = [0, 0, 0, 0]
        for (let r = 0; r < 100; r++) {
            const i = weightedRandom(validators)
            counts[i]++
        }
        setValidators(prev => prev.map((v, i) => ({...v, selected: v.selected + counts[i]})))
        setRounds(r => r + 100)
        setLog([])
        setRunning(false)
    }, [validators])

    const reset = () => {
        setValidators(INIT)
        setCurrent(null)
        setRounds(0)
        setLog([])
    }

    return (
        <div className="px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">PoS 验证者选择</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">质押量决定出块概率，按权重随机选出下一个出块者</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={reset} className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white">重置</button>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">已选择 <span className="font-bold text-gray-900 dark:text-white">{rounds}</span> 次</div>
                </div>

                {/* 验证者卡片 */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {validators.map((v, i) => {
                        const pct = total > 0 ? v.stake / total * 100 : 0
                        const actPct = rounds > 0 ? v.selected / rounds * 100 : 0
                        const isActive = current === i
                        return (
                            <div key={v.name} className={`p-4 rounded-lg border-2 transition-all duration-300 ${isActive ? 'border-blue-500 shadow-lg scale-[1.02]' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800`}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-3 h-3 rounded-full ${BAR[v.color]}`}/>
                                        <span className="font-semibold text-gray-900 dark:text-white">{v.name}</span>
                                        {isActive && <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">出块中</span>}
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${BADGE[v.color]}`}>{pct.toFixed(1)}% 概率</span>
                                </div>
                                <div className="space-y-2">
                                    <div>
                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            <span>质押权重</span><span>{v.stake.toLocaleString()} ETH</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                                            <div className={`h-1.5 rounded-full ${BAR[v.color]}`} style={{width: `${pct}%`}}/>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            <span>实际选中</span><span>{v.selected} 次 ({actPct.toFixed(1)}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                                            <div className="h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 transition-all duration-300" style={{width: `${Math.min(actPct, 100)}%`}}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* 操作 */}
                <div className="flex gap-3 mb-6">
                    <button onClick={selectOne}
                        className="px-4 py-2 rounded text-sm border bg-white text-blue-700 border-blue-300 hover:bg-blue-50 dark:bg-transparent dark:border-blue-500 dark:text-blue-400">
                        ▶ 选择一次
                    </button>
                    <button onClick={runMany} disabled={running}
                        className="px-4 py-2 rounded text-sm border bg-white text-purple-700 border-purple-300 hover:bg-purple-50 disabled:opacity-50 dark:bg-transparent dark:border-purple-500 dark:text-purple-400">
                        ⚡ 模拟100次
                    </button>
                </div>

                {/* 选择记录 */}
                {log.length > 0 && (
                    <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">最近选择记录</h3>
                        <div className="flex flex-wrap gap-2">
                            {log.map((l, i) => (
                                <span key={i} className={`text-xs px-2 py-0.5 rounded-full font-medium ${BADGE[l.color]}`}>{l.name}</span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-900/10 dark:border-blue-800 mb-6">
                    <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">💡 选择机制</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400">验证者被选中出块的概率与其质押量成正比。模拟100次后，实际选中比例会接近理论概率，这就是"权益加权随机选择"。</p>
                </div>

                <div className="flex justify-between items-center">
                    <Link href="/pos" className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">← 质押</Link>
                    <Link href="/pos/slashing" className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">下一步：惩罚 →</Link>
                </div>
            </div>
        </div>
    )
}
