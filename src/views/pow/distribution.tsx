"use client"

import React, {useCallback, useRef, useState} from 'react'
import Link from "next/link"
import { FiGlobe, FiShare2, FiArrowRight } from "react-icons/fi"
import * as CryptoJS from 'crypto-js'
import PoolCfg, {type PoolCfgRef} from '@/components/distribution/PoolCfg'
import Computer from '@/components/coinbase/Computer'
import BlockChain from '@/components/coinbase/BlockChain'
import type {MiniBlock, ComputerBoard, StepStatus, Tx} from '@/types/block'

const maxNonce = 500000

export default function DistributionPage(): React.ReactElement {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState('')
    const [aGpu, setAGpu] = useState<'1' | '2' | '3'>('1')
    const [bGpu, setBGpu] = useState<'1' | '2' | '3'>('2')
    const [cGpu, setCGpu] = useState<'1' | '2' | '3'>('3')
    const [winner, setWinner] = useState<number | null>(null)
    const [rewardAmount, setRewardAmount] = useState<number>(50)
    const [networkSync, setNetworkSync] = useState<{ [key: number]: 'syncing' | 'synced' | 'none' }>({})
    const [confirmations, setConfirmations] = useState<number>(0)
    const [difficulty, setDifficulty] = useState<number>(4)
    const [paused, setPaused] = useState<boolean>(false)
    const winnerRef = useRef<number | null>(null)
    const pausedRef = useRef(false)
    const stopRef = useRef(false)

    const [board, setBoard] = useState<ComputerBoard[]>([
        {
            title: '电脑A',
            steps: [
                {title: '初始化', status: 'wait'},
                {title: '打包交易', status: 'wait'},
                {title: '挖矿计算', status: 'wait'},
                {title: '广播区块', status: 'wait'},
                {title: '同步区块', status: 'wait'}
            ]
        },
        {
            title: '电脑B',
            steps: [
                {title: '初始化', status: 'wait'},
                {title: '打包交易', status: 'wait'},
                {title: '挖矿计算', status: 'wait'},
                {title: '广播区块', status: 'wait'},
                {title: '同步区块', status: 'wait'}
            ]
        },
        {
            title: '电脑C',
            steps: [
                {title: '初始化', status: 'wait'},
                {title: '打包交易', status: 'wait'},
                {title: '挖矿计算', status: 'wait'},
                {title: '广播区块', status: 'wait'},
                {title: '同步区块', status: 'wait'}
            ]
        }
    ])

    const [miningProgress, setMiningProgress] = useState<{ [key: number]: { nonce: number, progress: number } }>({})

    const [blocks, setBlocks] = useState<MiniBlock[]>([
        {
            height: 1,
            nonce: 49691,
            data: '第一笔交易记录数据',
            previous: '0'.repeat(64),
            timestamp: 1640995200000,
            hash: '0000b61c8bb61a6faa7c46e4872623b6e4caac5a0ae3a3b416849b216d0d62f6',
            award: '50',
            miner: 'Genesis'
        }
    ])

    const cfgRef = useRef<PoolCfgRef>(null)

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

    // 简易交易解析：
    // 支持多行，每行格式之一：
    // 1) fm->to:amt  例如: alice->bob:12
    // 2) 仅文本，作为备注展示在 fm 列，例如: xukui
    const parseTxs = (raw: string): Tx[] | undefined => {
        if (!raw.trim()) return undefined
        const lines = raw.split(/\n|\r/).map(s => s.trim()).filter(Boolean)
        const result: Tx[] = []
        for (const line of lines) {
            const m = line.match(/^([^\-]+)->([^:]+):(.+)$/)
            if (m) {
                result.push({fm: m[1].trim(), to: m[2].trim(), amt: m[3].trim()})
            } else {
                // 无结构文本，作为备注放在 fm 列
                result.push({fm: line, to: '-', amt: '-'})
            }
        }
        return result.length ? result : undefined
    }

    const resetSteps = () => {
        setBoard(prev => prev.map(b => ({
            title: b.title,
            steps: b.steps.map(s => ({title: s.title, status: 'wait' as StepStatus}))
        })))
        setMiningProgress({})
        setNetworkSync({})
        setConfirmations(0)
    }

    const setStep = (idx: number, pos: number, status: StepStatus) => {
        setBoard(prev => {
            const next = [...prev]
            next[idx] = {
                ...next[idx],
                steps: next[idx].steps.map((step, i) =>
                    i === pos ? {...step, status} : step
                )
            }
            return next
        })
    }

    const mineTask = async (index: number, gpu: '1' | '2' | '3', targetHeight: number) => {
        try {
            // 步骤 1: 初始化 (快速)
            setStep(index, 0, 'process')
            await sleep(500)
            setStep(index, 0, 'finish')

            // 步骤 2: 打包交易 (中等)
            await sleep(300)
            setStep(index, 1, 'process')
            const lastBlock = blocks[blocks.length - 1]
            const timestamp = Date.now()
            let block: MiniBlock = {
                height: targetHeight,
                nonce: 0,
                data,
                previous: lastBlock.hash,
                timestamp,
                hash: '',
                award: '50',
                miner: `电脑${String.fromCharCode(65 + index)}`
            }
            await sleep(1000)
            setStep(index, 1, 'finish')

            // 步骤 3: 挖矿计算 (主要时间)
            await sleep(500)
            setStep(index, 2, 'process')

            // 挖矿计算 - 使用完整的哈希公式
            const gpuSpeed = gpu === '1' ? 1000 : gpu === '2' ? 2000 : 4000 // nonce/秒
            const checkInterval = Math.max(1, Math.floor(gpuSpeed / 10)) // 每100ms检查一次

            for (let nonce = 0; nonce < maxNonce; nonce++) {
                // 检查是否已经有获胜者
                if (winnerRef.current !== null) {
                    setStep(index, 2, 'error')
                    return false
                }

                // 更新进度
                if (nonce % checkInterval === 0) {
                    setMiningProgress(prev => ({
                        ...prev,
                        [index]: {
                            nonce,
                            progress: Math.floor((nonce / maxNonce) * 100)
                        }
                    }))

                    // GPU性能延迟
                    await sleep(100)
                }

                const input = `${block.height}${nonce}${block.previous}${block.timestamp}${block.data}`
                const hash = CryptoJS.SHA256(input).toString()
                const currentPattern = '0'.repeat(difficulty)
                if (hash.startsWith(currentPattern)) {
                    block.nonce = nonce
                    block.hash = hash
                    // 将交易数据解析为 txs 展示
                    const txs = parseTxs(data)
                    if (txs) {
                        block.txs = txs
                    }

                    // 更新最终进度
                    setMiningProgress(prev => ({
                        ...prev,
                        [index]: {
                            nonce,
                            progress: 100
                        }
                    }))
                    break
                }
            }

            setStep(index, 2, 'finish')

            // 步骤 4: 广播区块 (竞争机制)
            await sleep(200)
            setStep(index, 3, 'process')

            // 检查是否为第一个完成的
            if (winnerRef.current === null) {
                // 成为获胜者
                winnerRef.current = index
                setWinner(index)

                // 设置奖励金额
                block.award = rewardAmount.toString()
                block.miner = `电脑${String.fromCharCode(65 + index)}`

                setBlocks(prev => [...prev, block])
                await sleep(800)
                setStep(index, 3, 'finish')

                // 步骤 5: 网络同步 - 其他节点接收区块
                await sleep(300)
                setStep(index, 4, 'finish') // 获胜者完成同步

                // 启动其他节点的同步过程
                for (let i = 0; i < 3; i++) {
                    if (i !== index) {
                        setNetworkSync(prev => ({...prev, [i]: 'syncing'}))
                        setTimeout(() => {
                            setStep(i, 4, 'process')
                            setTimeout(() => {
                                setStep(i, 4, 'finish')
                                setNetworkSync(prev => ({...prev, [i]: 'synced'}))
                            }, 1000 + Math.random() * 1000)
                        }, 500 + Math.random() * 500)
                    }
                }

                // 启动确认过程
                setTimeout(() => {
                    let confirmCount = 0
                    const confirmInterval = setInterval(() => {
                        confirmCount++
                        setConfirmations(confirmCount)
                        if (confirmCount >= 6) {
                            clearInterval(confirmInterval)
                        }
                    }, 800)
                }, 2000)

                return true
            } else {
                // 失败，其他电脑已经获胜 - 停止挖矿并等待同步
                await sleep(500)
                setStep(index, 3, 'error') // 挖矿失败
                setStep(index, 4, 'process') // 等待同步
                return false
            }
        } catch (error) {
            console.error(`电脑${String.fromCharCode(65 + index)}挖矿失败:`, error)
            setStep(index, 2, 'error')
            return false
        }
    }

    const mine = useCallback(async () => {
        if (!data.trim()) {
            alert('请先输入交易数据！')
            return
        }

        setLoading(true)
        setPaused(false)
        pausedRef.current = false
        stopRef.current = false
        setWinner(null)
        winnerRef.current = null
        resetSteps()
        const targetHeight = blocks.length + 1

        try {
            // 并行挖矿，但只有一个能获胜
            const results = await Promise.allSettled([
                mineTask(0, aGpu, targetHeight),
                mineTask(1, bGpu, targetHeight),
                mineTask(2, cGpu, targetHeight),
            ])

            const successCount = results.filter(r => r.status === 'fulfilled' && r.value === true).length
            console.log(`挖矿结束，获胜者: 电脑${winnerRef.current !== null ? String.fromCharCode(65 + winnerRef.current) : '无'}, 成功数: ${successCount}`)
        } catch (e) {
            console.error('挖矿过程中出现错误:', e)
        } finally {
            setLoading(false)
        }
    }, [aGpu, bGpu, cGpu, data, blocks, difficulty])

    const reset = () => {
        setBlocks([{
            height: 1,
            nonce: 49691,
            data: '第一笔交易记录数据',
            previous: '0'.repeat(64),
            timestamp: Date.now(),
            hash: '0000b61c8bb61a6faa7c46e4872623b6e5ebcfa4bcb5dc279f56aa96a365e5a',
            award: '50',
            miner: 'Genesis'
        }])
        setWinner(null)
        winnerRef.current = null
        setMiningProgress({})
        setNetworkSync({})
        setConfirmations(0)
        cfgRef.current?.reset()
        resetSteps()
    }

    return (
        <div className="px-0 sm:px-4 py-4 sm:py-8 pb-32 sm:pb-8">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
                {/* 控制面板 */}
                <div className="p-4 sm:p-6 sm:rounded-2xl border-y sm:border bg-white border-gray-200 dark:border-gray-700/60 dark:bg-[#161616] shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700/50 pb-4 sm:pb-6">
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                🌐
                            </span>
                            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                控制台
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
                            <div className="flex items-center gap-2 w-full sm:w-auto bg-gray-50 dark:bg-black/20 p-2 sm:p-0 rounded-lg sm:bg-transparent">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 shrink-0">难度</label>
                                <input
                                    type="range"
                                    min={0}
                                    max={7}
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(Number(e.target.value))}
                                    className="accent-yellow-500 flex-1 sm:w-32 h-10 sm:h-auto"
                                />
                                <span className="w-4 sm:w-6 text-right text-sm font-bold text-gray-700 dark:text-gray-300">{difficulty}</span>
                            </div>
                            <button
                                onClick={reset}
                                disabled={loading}
                                className="flex-1 sm:flex-none px-4 py-2 sm:py-1.5 rounded-lg text-sm font-semibold border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-rose-600 hover:border-rose-200 transition-all disabled:opacity-50 dark:bg-black/20 dark:border-white/10 dark:text-gray-300 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 dark:hover:border-rose-500/30"
                            >重置环境</button>
                        </div>
                    </div>

                    <div className="hidden sm:flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 sm:pt-6">
                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                            <div className="flex items-center gap-3">
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0">
                                    竞争区块
                                </div>
                                <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-md text-blue-700 dark:text-blue-400 font-mono text-sm font-bold shadow-inner">
                                    #{blocks.length + 1}
                                </div>
                            </div>
                            {winner !== null && (
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800">
                                        🏆 电脑{String.fromCharCode(65 + winner)} 胜出
                                    </span>
                                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
                                        +{rewardAmount}
                                    </span>
                                    {confirmations > 0 && (
                                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                                            {confirmations}/6 确认
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                            <button
                                onClick={mine}
                                disabled={loading || !data.trim()}
                                className={`flex-[2] sm:flex-none px-6 py-2 rounded-xl text-sm font-bold border transition-all shadow-sm ${
                                    loading 
                                        ? "bg-yellow-50 border-yellow-300 text-yellow-700 dark:bg-yellow-500/20 dark:border-yellow-500/50 dark:text-yellow-500 animate-pulse"
                                        : "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600 hover:-translate-y-0.5 dark:bg-emerald-600 dark:border-emerald-700 dark:hover:bg-emerald-500"
                                } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                            >{loading ? "⛏️ 算力比拼中..." : "⛏️ 开始竞赛"}</button>
                            <div className="flex gap-2 flex-1 sm:flex-none">
                                <button
                                    onClick={() => {
                                        pausedRef.current = true;
                                        setPaused(true);
                                    }}
                                    disabled={!loading || paused}
                                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-medium border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-all dark:bg-black/20 dark:border-white/10 dark:text-gray-300"
                                >暂停</button>
                                <button
                                    onClick={() => {
                                        pausedRef.current = false;
                                        setPaused(false);
                                    }}
                                    disabled={!paused}
                                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-medium border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-all dark:bg-black/20 dark:border-white/10 dark:text-gray-300"
                                >继续</button>
                                <button
                                    onClick={() => {
                                        stopRef.current = true;
                                        setPaused(false);
                                    }}
                                    disabled={!loading}
                                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-medium border bg-white text-gray-700 border-gray-200 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40 transition-all dark:bg-black/20 dark:border-white/10 dark:text-gray-300"
                                >停止</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 移动端底部悬浮控制栏 */}
                <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 p-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-[calc(1rem+env(safe-area-inset-bottom))]">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                竞争区块 <span className="text-blue-600 dark:text-blue-400 font-bold ml-1">#{blocks.length + 1}</span>
                            </div>
                            {winner !== null && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800">
                                    🏆 电脑{String.fromCharCode(65 + winner)} 胜出
                                </span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {loading && (
                                <div className="flex gap-2 w-1/3">
                                    <button
                                        onClick={() => {
                                            if (paused) {
                                                pausedRef.current = false;
                                                setPaused(false);
                                            } else {
                                                pausedRef.current = true;
                                                setPaused(true);
                                            }
                                        }}
                                        className="flex-1 h-11 rounded-xl text-sm font-medium border bg-white text-gray-700 border-gray-200 dark:bg-black/20 dark:border-white/10 dark:text-gray-300 flex items-center justify-center"
                                    >{paused ? '继续' : '暂停'}</button>
                                    <button
                                        onClick={() => {
                                            stopRef.current = true;
                                            setPaused(false);
                                        }}
                                        className="flex-1 h-11 rounded-xl text-sm font-medium border bg-white text-gray-700 border-gray-200 hover:text-rose-600 dark:bg-black/20 dark:border-white/10 dark:text-gray-300 flex items-center justify-center"
                                    >停止</button>
                                </div>
                            )}
                            <button
                                onClick={mine}
                                disabled={loading || !data.trim()}
                                className={`h-11 rounded-xl text-sm font-bold border transition-all flex items-center justify-center ${loading ? 'w-2/3' : 'w-full'} ${
                                    loading 
                                        ? "bg-yellow-50 border-yellow-300 text-yellow-700 dark:bg-yellow-500/20 dark:border-yellow-500/50 dark:text-yellow-500 animate-pulse"
                                        : "bg-emerald-500 text-white border-emerald-600 dark:bg-emerald-600 dark:border-emerald-700 shadow-sm"
                                } disabled:opacity-50`}
                            >{loading ? "⛏️ 算力比拼中..." : "⛏️ 开始竞赛"}</button>
                        </div>
                    </div>
                </div>

                {/* 主要内容区域 */}
                <div className="px-4 sm:px-0 grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                    <div className="xl:col-span-1">
                        <PoolCfg
                            ref={cfgRef}
                            onGpuChange={({machine, gpu}) => {
                                if (machine === 'A') setAGpu(gpu)
                                if (machine === 'B') setBGpu(gpu)
                                if (machine === 'C') setCGpu(gpu)
                            }}
                            onDataChange={(val) => setData(val)}
                        />
                    </div>
                    <div className="xl:col-span-2">
                        <Computer items={board} miningProgress={miningProgress}/>
                    </div>
                </div>

                {/* 公链展示 */}
                <div className="sm:rounded-xl border-y sm:border bg-white border-gray-200 dark:border-gray-700/60 dark:bg-[#161616] shadow-sm">
                    <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-transparent">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">网络账本同步 (公链)</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">胜出者会将自己的账本广播给所有人，其他电脑验证无误后同步更新</p>
                    </div>

                    <div className="p-4 sm:p-6 space-y-4">
                        {['电脑A', '电脑B', '电脑C'].map((label, i) => (
                            <div key={i} className={`border rounded-xl p-3 sm:p-4 transition-all duration-300 relative overflow-hidden ${
                                winner === i 
                                    ? 'border-green-400 bg-green-50/50 dark:border-green-500/30 dark:bg-green-900/10 shadow-[0_0_15px_rgba(74,222,128,0.1)]' 
                                    : 'border-gray-200 dark:border-gray-700/50 bg-gray-50/50 dark:bg-black/20'
                            }`}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-bold ${winner === i ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                            {label} 的本地账本
                                        </span>
                                        {winner === i && (
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800">
                                                广播者
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="overflow-x-auto custom-scrollbar pb-2 relative">
                                    <BlockChain blocks={blocks}/>
                                </div>
                                {/* 移动端横向滚动渐变遮罩暗示 */}
                                <div className="sm:hidden absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-gray-50/90 dark:from-black/80 to-transparent pointer-events-none rounded-r-xl" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 科普与下一步 */}
                <div className="px-4 sm:px-0 mt-6 sm:mt-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FeatureCard 
                            icon={<FiGlobe className="w-5 h-5 text-blue-500 dark:text-blue-400"/>}
                            title="分布式算力竞争"
                            desc="所有节点同时监听新交易并竞争打包。不同机器算力有强弱，但由于哈希碰撞的随机性，即使算力弱的节点也有机会碰巧挖出区块。"
                        />
                        <FeatureCard 
                            icon={<FiShare2 className="w-5 h-5 text-purple-500 dark:text-purple-400"/>}
                            title="最长链共识"
                            desc="一旦某个节点挖出区块并广播，其他节点会验证并同步到本地。通过这种机制，整个网络最终会维持一致的共享账本（公链）。"
                        />
                    </div>

                    <div className="flex justify-center pt-2 pb-8">
                        <Link 
                            href="/pow/token" 
                            className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25"
                        >
                            下一步：使用代币进行转账
                            <FiArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

function FeatureCard({icon, title, desc}: {icon: React.ReactNode, title: string, desc: string}) {
    return (
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700/60 bg-white/50 dark:bg-[#161616]/50 hover:bg-white dark:hover:bg-[#1a1a1a] transition-colors">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-gray-100 dark:bg-black/50 rounded-lg">
                    {icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{title}</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {desc}
            </p>
        </div>
    )
}
