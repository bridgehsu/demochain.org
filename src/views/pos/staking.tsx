import React, {useState} from 'react'
import Link from 'next/link'

type Validator = { name: string; address: string; stake: number; color: string }

const INITIAL: Validator[] = [
    {name: 'Alice', address: '0xAlice...', stake: 3200, color: 'blue'},
    {name: 'Bob', address: '0xBob...', stake: 1800, color: 'purple'},
    {name: 'Charlie', address: '0xCharlie...', stake: 2500, color: 'green'},
    {name: 'Dave', address: '0xDave...', stake: 500, color: 'orange'},
]

const COLOR: Record<string, string> = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
}
const LIGHT: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800',
    purple: 'bg-purple-50 border-purple-200 dark:bg-purple-900/10 dark:border-purple-800',
    green: 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800',
    orange: 'bg-orange-50 border-orange-200 dark:bg-orange-900/10 dark:border-orange-800',
}

export default function StakingPage(): React.ReactElement {
    const [validators, setValidators] = useState<Validator[]>(INITIAL)
    const [selected, setSelected] = useState<number>(0)
    const [amount, setAmount] = useState<string>('500')
    const [myBalance, setMyBalance] = useState<number>(5000)
    const [log, setLog] = useState<string[]>([])

    const total = validators.reduce((s, v) => s + v.stake, 0)

    const stake = () => {
        const amt = parseInt(amount)
        if (!amt || amt <= 0 || amt > myBalance) return
        const v = validators[selected]
        setValidators(prev => prev.map((x, i) => i === selected ? {...x, stake: x.stake + amt} : x))
        setMyBalance(b => b - amt)
        setLog(l => [`质押 ${amt} ETH 给 ${v.name}，当前质押: ${v.stake + amt} ETH`, ...l.slice(0, 4)])
    }

    const unstake = () => {
        const amt = parseInt(amount)
        const v = validators[selected]
        if (!amt || amt <= 0 || amt > v.stake) return
        setValidators(prev => prev.map((x, i) => i === selected ? {...x, stake: x.stake - amt} : x))
        setMyBalance(b => b + amt)
        setLog(l => [`赎回 ${amt} ETH 从 ${v.name}，剩余质押: ${v.stake - amt} ETH`, ...l.slice(0, 4)])
    }

    const reset = () => {
        setValidators(INITIAL)
        setMyBalance(5000)
        setLog([])
    }

    return (
        <div className="px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* 控制面板 */}
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">PoS 质押演示</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">持币者将代币质押给验证者，质押量越大出块概率越高</p>
                        </div>
                        <button onClick={reset} className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white">重置</button>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600 dark:text-gray-300">我的余额：<span className="font-bold text-blue-600 dark:text-blue-400">{myBalance.toLocaleString()} ETH</span></span>
                        <span className="text-gray-600 dark:text-gray-300">总质押量：<span className="font-bold">{total.toLocaleString()} ETH</span></span>
                    </div>
                </div>

                {/* 验证者列表 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {validators.map((v, i) => {
                        const pct = total > 0 ? (v.stake / total * 100) : 0
                        return (
                            <button
                                key={v.name}
                                onClick={() => setSelected(i)}
                                className={`text-left p-4 rounded-lg border-2 transition-all ${selected === i ? 'border-blue-500 shadow-md' : `border-transparent ${LIGHT[v.color]}`}`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-3 h-3 rounded-full ${COLOR[v.color]}`}/>
                                        <span className="font-semibold text-gray-900 dark:text-white">{v.name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{pct.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                                    <div className={`h-2 rounded-full transition-all duration-500 ${COLOR[v.color]}`} style={{width: `${pct}%`}}/>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    质押量：<span className="font-medium text-gray-900 dark:text-white">{v.stake.toLocaleString()} ETH</span>
                                </div>
                            </button>
                        )
                    })}
                </div>

                {/* 操作区 */}
                <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            操作 <span className="text-blue-600 dark:text-blue-400">{validators[selected]?.name}</span>
                        </span>
                        <input
                            type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            min={1}
                            className="w-32 h-8 px-2 rounded border border-gray-300 text-sm text-gray-900 bg-white dark:bg-black/20 dark:border-white/30 dark:text-white focus:outline-none focus:border-blue-500"
                        />
                        <span className="text-sm text-gray-500">ETH</span>
                        <button onClick={stake} disabled={!amount || parseInt(amount) > myBalance}
                            className="px-4 py-1.5 rounded text-sm border bg-white text-blue-700 border-blue-300 hover:bg-blue-50 disabled:opacity-50 dark:bg-transparent dark:border-blue-500 dark:text-blue-400">
                            ＋ 质押
                        </button>
                        <button onClick={unstake} disabled={!amount || parseInt(amount) > validators[selected]?.stake}
                            className="px-4 py-1.5 rounded text-sm border bg-white text-red-700 border-red-300 hover:bg-red-50 disabled:opacity-50 dark:bg-transparent dark:border-red-500 dark:text-red-400">
                            － 赎回
                        </button>
                    </div>
                </div>

                {/* 操作日志 */}
                {log.length > 0 && (
                    <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">操作记录</h3>
                        {log.map((l, i) => (
                            <div key={i} className="text-sm text-gray-600 dark:text-gray-400 py-0.5">✓ {l}</div>
                        ))}
                    </div>
                )}

                {/* 说明 */}
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-900/10 dark:border-blue-800 mb-6">
                    <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">💡 什么是质押？</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400">PoS 中验证者需锁定（质押）一定量的代币作为"抵押"，质押量越大，被选中出块的概率越高。与 PoW 靠算力竞争不同，PoS 靠经济利益绑定来保证安全性。</p>
                </div>

                {/* 翻页 */}
                <div className="flex justify-between items-center">
                    <div/>
                    <Link href="/pos/validators" className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                        下一步：验证者 →
                    </Link>
                </div>
            </div>
        </div>
    )
}
