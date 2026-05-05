import React, {useState} from 'react'
import Link from 'next/link'

type Validator = {name: string; stake: number; color: string; status: 'normal' | 'slashed' | 'jailed'; offenses: string[]}

const INIT: Validator[] = [
    {name: 'Alice', stake: 3200, color: 'blue', status: 'normal', offenses: []},
    {name: 'Bob', stake: 1800, color: 'purple', status: 'normal', offenses: []},
    {name: 'Charlie', stake: 2500, color: 'green', status: 'normal', offenses: []},
    {name: 'Dave', stake: 500, color: 'orange', status: 'normal', offenses: []},
]

type Offense = {label: string; slash: number; jail: boolean; desc: string}
const OFFENSES: Offense[] = [
    {label: '双重签名', slash: 30, jail: true, desc: '同一高度签署两个不同区块（严重恶意行为）'},
    {label: '长时间离线', slash: 1, jail: false, desc: '超过规定时间未出块（轻微违规）'},
    {label: '无效投票', slash: 5, jail: false, desc: '投票给无效区块（中度违规）'},
]

const STATUS_COLOR: Record<string, string> = {
    normal: 'text-green-600 dark:text-green-400',
    slashed: 'text-red-600 dark:text-red-400',
    jailed: 'text-gray-500 dark:text-gray-400',
}
const STATUS_LABEL: Record<string, string> = {normal: '正常', slashed: '已惩罚', jailed: '已监禁'}

export default function SlashingPage(): React.ReactElement {
    const [validators, setValidators] = useState<Validator[]>(INIT)
    const [selected, setSelected] = useState(0)
    const [offense, setOffense] = useState(0)
    const [log, setLog] = useState<string[]>([])

    const slash = () => {
        const v = validators[selected]
        const o = OFFENSES[offense]
        if (v.status === 'jailed') return
        const slashAmt = Math.floor(v.stake * o.slash / 100)
        setValidators(prev => prev.map((x, i) => i === selected ? {
            ...x,
            stake: x.stake - slashAmt,
            status: o.jail ? 'jailed' : 'slashed',
            offenses: [...x.offenses, o.label],
        } : x))
        setLog(l => [
            `${v.name} 因【${o.label}】被罚没 ${slashAmt} ETH (${o.slash}%)${o.jail ? '，已被监禁' : ''}`,
            ...l.slice(0, 5)
        ])
    }

    const restore = (i: number) => {
        setValidators(prev => prev.map((x, idx) => idx === i ? {...x, status: 'normal', offenses: []} : x))
        setLog(l => [`${validators[i].name} 已恢复正常状态`, ...l.slice(0, 5)])
    }

    const reset = () => {
        setValidators(INIT)
        setLog([])
    }

    const total = validators.reduce((s, v) => s + v.stake, 0)

    return (
        <div className="px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">PoS 惩罚机制（Slashing）</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">验证者作恶将被扣除质押金，严重者永久监禁</p>
                        </div>
                        <button onClick={reset} className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white">重置</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {validators.map((v, i) => {
                        const pct = total > 0 ? v.stake / total * 100 : 0
                        return (
                            <div key={v.name} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selected === i ? 'border-blue-500 shadow-md' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800`}
                                onClick={() => setSelected(i)}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-gray-900 dark:text-white">{v.name}</span>
                                        {v.status === 'jailed' && <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">🔒 监禁</span>}
                                        {v.status === 'slashed' && <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400">⚠ 已罚</span>}
                                    </div>
                                    <span className={`text-xs font-medium ${STATUS_COLOR[v.status]}`}>{STATUS_LABEL[v.status]}</span>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    质押量：<span className="font-medium text-gray-900 dark:text-white">{v.stake.toLocaleString()} ETH</span>
                                    <span className="ml-2 text-xs">({pct.toFixed(1)}%)</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mb-2">
                                    <div className={`h-1.5 rounded-full transition-all duration-500 ${v.status === 'jailed' ? 'bg-gray-400' : v.status === 'slashed' ? 'bg-red-500' : 'bg-blue-500'}`} style={{width: `${pct}%`}}/>
                                </div>
                                {v.offenses.length > 0 && (
                                    <div className="text-xs text-red-500 dark:text-red-400">违规：{v.offenses.join('、')}</div>
                                )}
                                {v.status === 'jailed' && (
                                    <button onClick={e => {e.stopPropagation(); restore(i)}}
                                        className="mt-2 text-xs px-2 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400">
                                        解除监禁
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* 操作面板 */}
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        对 <span className="text-blue-600 dark:text-blue-400">{validators[selected]?.name}</span> 执行惩罚
                    </h3>
                    <div className="space-y-2 mb-4">
                        {OFFENSES.map((o, i) => (
                            <label key={i} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${offense === i ? 'border-red-400 bg-red-50 dark:bg-red-900/10 dark:border-red-700' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                                <input type="radio" name="offense" checked={offense === i} onChange={() => setOffense(i)} className="mt-0.5"/>
                                <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        {o.label} <span className="text-red-600 dark:text-red-400">(-{o.slash}%)</span>
                                        {o.jail && <span className="ml-2 text-xs text-gray-500">+ 监禁</span>}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{o.desc}</div>
                                </div>
                            </label>
                        ))}
                    </div>
                    <button onClick={slash} disabled={validators[selected]?.status === 'jailed'}
                        className="px-4 py-2 rounded text-sm border bg-white text-red-700 border-red-300 hover:bg-red-50 disabled:opacity-50 dark:bg-transparent dark:border-red-500 dark:text-red-400">
                        ⚡ 执行惩罚
                    </button>
                </div>

                {log.length > 0 && (
                    <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                        {log.map((l, i) => <div key={i} className="text-sm text-red-600 dark:text-red-400 py-0.5">⚠ {l}</div>)}
                    </div>
                )}

                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-900/10 dark:border-blue-800 mb-6">
                    <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">💡 为什么需要惩罚？</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400">Slashing 是 PoS 安全性的核心。验证者作恶会损失自己的质押金，使得攻击网络的成本远高于收益，从而确保诚实行为是最优策略。</p>
                </div>

                <div className="flex justify-between items-center">
                    <Link href="/pos/validators" className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">← 验证者</Link>
                    <Link href="/pos/rewards" className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">下一步：奖励 →</Link>
                </div>
            </div>
        </div>
    )
}
