"use client"

import React, {useMemo, useRef, useState, useCallback} from 'react'
import Link from "next/link"
import { FiAward, FiPieChart, FiArrowRight } from "react-icons/fi"
import * as CryptoJS from 'crypto-js'
import BlockChainFull from '@/components/coinbase/BlockChainFull'
import CoinbaseCfg, {type CoinbaseCfgRef} from '@/components/coinbase/CoinbaseCfg'
import CoinbaseReward, {type CoinbaseRewardRef} from '@/components/coinbase/CoinbaseReward'
import Computer from '@/components/coinbase/Computer'
import type {MiniBlock, Tx, ComputerBoard, StepStatus} from '@/types/block'

export default function CoinbasePage(): React.ReactElement {
    const [loading, setLoading] = useState(false)
    const [difficulty, setDifficulty] = useState<number>(4)
    const [reward, setReward] = useState<number>(50)
    const [txs, setTxs] = useState<Tx[]>([])
    const [aGpu, setAGpu] = useState<'1' | '2' | '3'>('1')
    const [bGpu, setBGpu] = useState<'1' | '2' | '3'>('2')
    const [cGpu, setCGpu] = useState<'1' | '2' | '3'>('3')
    const [addrA, setAddrA] = useState<string>('addrA...')
    const [addrB, setAddrB] = useState<string>('addrB...')
    const [addrC, setAddrC] = useState<string>('addrC...')
    const [coinType, setCoinType] = useState<string>('Demo')
    const [winner, setWinner] = useState<number | null>(null)
    const [paused, setPaused] = useState<boolean>(false)
    const [miningProgress, setMiningProgress] = useState<{ [key: number]: { nonce: number, progress: number } }>({})
    const cfgRef = useRef<CoinbaseCfgRef>(null)
    const rewardRef = useRef<CoinbaseRewardRef>(null)
    const pausedRef = useRef(false)
    const stopRef = useRef(false)
    const winnerRef = useRef<number | null>(null)

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

    const [blocks, setBlocks] = useState<MiniBlock[]>([{
        height: 1,
        nonce: 49691,
        data: '第一笔交易记录数据',
        previous: '0'.repeat(64),
        timestamp: Date.now(),
        hash: '0000b61c8bb61a6faa7c46e4872623b6e5ebcfa4bcb5dc279f56aa96a365e5a',
        award: '50',
        miner: 'Genesis',
        txs: []
    }])

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

    const resetSteps = () => {
        setBoard(prev => prev.map(b => ({
            title: b.title,
            steps: b.steps.map(s => ({title: s.title, status: 'wait' as StepStatus}))
        })))
        setMiningProgress({})
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

    const pattern = useMemo(() => '0'.repeat(Math.max(0, Math.min(7, difficulty))), [difficulty])

    const nextHeight = blocks.length + 1
    const lastBlock = blocks[blocks.length - 1]

    const mineTask = async (index: number, gpu: '1' | '2' | '3') => {
        try {
            // 步骤 1: 初始化
            setStep(index, 0, 'process')
            await sleep(500)
            setStep(index, 0, 'finish')

            // 步骤 2: 打包交易（生成币基交易 + 普通交易）
            await sleep(300)
            setStep(index, 1, 'process')

            // 生成币基交易（第一笔交易）
            const minerAddr = index === 0 ? addrA : index === 1 ? addrB : addrC
            const coinbaseTx: Tx = {
                fm: 'Coinbase',
                to: minerAddr,
                amt: `${reward} ${coinType}`
            }

            // 合并币基交易和普通交易
            const allTxs = [coinbaseTx, ...txs]

            await sleep(1000)
            setStep(index, 1, 'finish')

            // 步骤 3: 挖矿计算
            await sleep(500)
            setStep(index, 2, 'process')

            const ts = Date.now()
            let nonce = 0
            let foundHash = ''

            // GPU 性能设置（与分布式一致）
            const gpuSpeed = gpu === '1' ? 1000 : gpu === '2' ? 2000 : 4000 // nonce/秒
            const checkInterval = Math.max(1, Math.floor(gpuSpeed / 10)) // 每100ms检查一次

            // 模拟挖矿过程
            while (nonce < 500000) {
                if (winnerRef.current !== null) {
                    setStep(index, 2, 'error')
                    return false
                }

                // 检查暂停和停止
                if (pausedRef.current) {
                    await sleep(100)
                    continue
                }

                if (stopRef.current) {
                    setStep(index, 2, 'error')
                    return false
                }

                // 进度更新
                if (nonce % checkInterval === 0) {
                    setMiningProgress(prev => ({
                        ...prev,
                        [index]: {
                            nonce,
                            progress: Math.floor((nonce / 500000) * 100)
                        }
                    }))
                    await sleep(100)
                }

                const input = `${nextHeight}${nonce}${lastBlock.hash}${ts}${JSON.stringify(allTxs)}`
                const h = CryptoJS.SHA256(input).toString()
                if (h.startsWith(pattern)) {
                    foundHash = h
                    // 完成时设置100%
                    setMiningProgress(prev => ({
                        ...prev,
                        [index]: {nonce, progress: 100}
                    }))
                    break
                }
                nonce++
            }

            setStep(index, 2, 'finish')

            // 步骤 4: 广播区块（竞争机制）
            await sleep(200)
            setStep(index, 3, 'process')

            if (winnerRef.current === null) {
                winnerRef.current = index
                setWinner(index)

                const newBlock: MiniBlock = {
                    height: nextHeight,
                    nonce,
                    data: JSON.stringify(allTxs),
                    previous: lastBlock.hash,
                    timestamp: ts,
                    hash: foundHash,
                    award: `${reward} ${coinType}`,
                    miner: minerAddr,
                    txs: allTxs,
                }

                setBlocks(prev => [...prev, newBlock])
                await sleep(800)
                setStep(index, 3, 'finish')

                // 步骤 5: 同步区块（获胜者视为已同步完成）
                await sleep(300)
                setStep(index, 4, 'finish')
                return true
            } else {
                await sleep(500)
                setStep(index, 3, 'error')
                // 失败者进入同步流程
                setStep(index, 4, 'process')
                await sleep(800 + Math.random() * 800)
                setStep(index, 4, 'finish')
                return false
            }
        } catch (error) {
            console.error(`电脑${String.fromCharCode(65 + index)}挖矿失败:`, error)
            setStep(index, 2, 'error')
            return false
        }
    }

    const runMine = useCallback(async () => {
        // 验证钱包地址
        if (!addrA.trim() || !addrB.trim() || !addrC.trim()) {
            alert('请先配置所有电脑的钱包地址！')
            return
        }

        setLoading(true)
        setPaused(false)
        pausedRef.current = false
        stopRef.current = false
        setWinner(null)
        winnerRef.current = null
        resetSteps()

        try {
            const results = await Promise.allSettled([
                mineTask(0, aGpu),
                mineTask(1, bGpu),
                mineTask(2, cGpu)
            ])

            const successCount = results.filter(r => r.status === 'fulfilled' && r.value === true).length
            console.log(`币基挖矿完成，获胜者: 电脑${winnerRef.current !== null ? String.fromCharCode(65 + winnerRef.current) : '无'}, 奖励: ${reward} ${coinType}`)
        } catch (e) {
            console.error('挖矿过程中出现错误:', e)
        } finally {
            setLoading(false)
        }
    }, [aGpu, bGpu, cGpu, txs, nextHeight, lastBlock, pattern, reward, coinType, addrA, addrB, addrC])

    const reset = () => {
        setBlocks([{
            height: 1,
            nonce: 49691,
            data: '第一笔交易记录数据',
            previous: '0'.repeat(64),
            timestamp: Date.now(),
            hash: '0000b61c8bb61a6faa7c46e4872623b6e5ebcfa4bcb5dc279f56aa96a365e5a',
            award: '50',
            miner: 'Genesis',
            txs: []
        }])
        setTxs([])
        setReward(50)
        setWinner(null)
        winnerRef.current = null
        setMiningProgress({})
        setAddrA('addrA...')
        setAddrB('addrB...')
        setAddrC('addrC...')
        cfgRef.current?.reset()
        rewardRef.current?.reset()
        resetSteps()
    }

    return (
        <div className="px-3 py-4 sm:px-4 sm:py-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* 控制面板 */}
                <div className="p-4 sm:p-6 rounded-2xl border bg-white border-gray-200 dark:border-gray-700/60 dark:bg-[#161616] shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700/50 pb-4 sm:pb-6">
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                💰
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
                                    className="accent-yellow-500 flex-1 sm:w-32"
                                />
                                <span className="w-4 sm:w-6 text-right text-sm font-bold text-gray-700 dark:text-gray-300">{difficulty}</span>
                            </div>
                            <button
                                onClick={reset}
                                disabled={loading}
                                className="flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-semibold border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-rose-600 hover:border-rose-200 transition-all disabled:opacity-50 dark:bg-black/20 dark:border-white/10 dark:text-gray-300 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 dark:hover:border-rose-500/30"
                            >重置数据</button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 sm:pt-6">
                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                            <div className="flex items-center gap-3">
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0">
                                    即将打包区块
                                </div>
                                <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-md text-blue-700 dark:text-blue-400 font-mono text-sm font-bold shadow-inner">
                                    #{nextHeight}
                                </div>
                            </div>
                            {winner !== null && (
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800">
                                        🏆 电脑{String.fromCharCode(65 + winner)} 胜出
                                    </span>
                                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
                                        币基奖励: +{reward} {coinType}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                            <button
                                onClick={runMine}
                                disabled={loading}
                                className={`flex-[2] sm:flex-none px-6 py-2 rounded-xl text-sm font-bold border transition-all shadow-sm ${
                                    loading 
                                        ? "bg-yellow-50 border-yellow-300 text-yellow-700 dark:bg-yellow-500/20 dark:border-yellow-500/50 dark:text-yellow-500 animate-pulse"
                                        : "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600 hover:-translate-y-0.5 dark:bg-emerald-600 dark:border-emerald-700 dark:hover:bg-emerald-500"
                                } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                            >{loading ? "⛏️ 争夺记账权..." : "⛏️ 争夺记账权"}</button>
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

                {/* 主要内容区域 */}
                <div className="space-y-6 mb-6">
                    {/* 上排：配置区域 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="lg:col-span-1">
                            <CoinbaseReward
                                ref={rewardRef}
                                onRewardChange={(val) => setReward(val)}
                                onMinerChange={() => {}} // 不再使用全局矿工地址
                                onCoinChange={(coin) => setCoinType(coin)}
                            />
                        </div>
                        <div className="lg:col-span-1">
                            <CoinbaseCfg
                                ref={cfgRef}
                                onGpuChange={({machine, gpu}) => {
                                    if (machine === 'A') setAGpu(gpu)
                                    if (machine === 'B') setBGpu(gpu)
                                    if (machine === 'C') setCGpu(gpu)
                                }}
                                onAddressChange={({machine, address}) => {
                                    if (machine === 'A') setAddrA(address)
                                    if (machine === 'B') setAddrB(address)
                                    if (machine === 'C') setAddrC(address)
                                }}
                                onTxsChange={(list) => setTxs(list)}
                            />
                        </div>
                    </div>

                    {/* 下排：挖矿进度展示 */}
                    <div>
                        <Computer items={board} miningProgress={miningProgress}/>
                    </div>
                </div>

                {/* 区块链展示 */}
                <div className="rounded-xl border bg-white border-gray-200 dark:border-gray-700/60 dark:bg-[#161616] shadow-sm">
                    <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700/50">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">网络账本同步 (公链)</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">胜出者不仅获得了记账权，还将获得系统凭空生成的币基(Coinbase)奖励</p>
                    </div>

                    <div className="p-4 sm:p-6">
                        <div className="border border-yellow-400 rounded-xl p-3 sm:p-4 bg-gray-50/50 dark:bg-black/20">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-bold text-green-600 dark:text-green-400">币基演示链</span>
                            </div>
                            <div className="overflow-x-auto custom-scrollbar pb-2">
                                <BlockChainFull blocks={blocks}/>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 科普与下一步 */}
                <div className="mt-6 sm:mt-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FeatureCard 
                            icon={<FiAward className="w-5 h-5 text-blue-500 dark:text-blue-400"/>}
                            title="代币的源头 (Coinbase)"
                            desc="区块打包的第一笔交易永远是特殊的“币基交易”。网络通过它凭空产生新代币，用来奖励辛勤挖矿的胜出者。"
                        />
                        <FeatureCard 
                            icon={<FiPieChart className="w-5 h-5 text-purple-500 dark:text-purple-400"/>}
                            title="巧妙的代币发行机制"
                            desc="通过将代币发行与挖矿绑定，既激励了矿工维护网络安全，又实现了代币在去中心化网络中公平的分发。"
                        />
                    </div>

                    <div className="flex justify-center pt-2 pb-8">
                        <Link 
                            href="/pow/hash" 
                            className="flex items-center gap-2 px-6 py-3.5 bg-gray-800 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 text-white rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/25"
                        >
                            重温最初的哈希之旅
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
