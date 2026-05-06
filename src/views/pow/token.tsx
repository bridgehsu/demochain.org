"use client"

import React, {useMemo, useRef, useState, useCallback} from 'react'
import Link from "next/link"
import { FiFileText, FiShield, FiArrowRight } from "react-icons/fi"
import * as CryptoJS from 'crypto-js'
import type {MiniBlock, Tx, ComputerBoard, StepStatus} from '@/types/block'
import BlockChainFull from '@/components/coinbase/BlockChainFull'
import TokenCfg, {type TokenCfgRef} from '@/components/token/TokenCfg'
import Computer from '@/components/coinbase/Computer'

export default function TokenPage(): React.ReactElement {
    const [difficulty, setDifficulty] = useState<number>(4)
    const [txs, setTxs] = useState<Tx[]>([])
    const cfgRef = useRef<TokenCfgRef>(null)
    const [loading, setLoading] = useState(false)
    const [miningProgress, setMiningProgress] = useState<{ [key: number]: { nonce: number, progress: number } }>({})
    const [paused, setPaused] = useState<boolean>(false)
    const pausedRef = useRef(false)
    const stopRef = useRef(false)

    const [board, setBoard] = useState<ComputerBoard[]>([
        {
            title: '代币矿工',
            steps: [
                {title: '初始化', status: 'wait'},
                {title: '打包交易', status: 'wait'},
                {title: '挖矿计算', status: 'wait'},
                {title: '广播区块', status: 'wait'}
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
        award: '0',
        miner: 'Genesis',
        txs: []
    }])

    const pattern = useMemo(() => '0'.repeat(Math.max(0, Math.min(7, difficulty))), [difficulty])
    const nextHeight = blocks.length + 1
    const lastBlock = blocks[blocks.length - 1]

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

    const runMine = useCallback(async () => {
        if (txs.length === 0) {
            alert('请先添加交易记录！')
            return
        }

        setLoading(true)
        setPaused(false)
        pausedRef.current = false
        stopRef.current = false
        resetSteps()

        try {
            // 步骤 1: 初始化
            setStep(0, 0, 'process')
            await sleep(500)
            setStep(0, 0, 'finish')

            // 步骤 2: 打包交易
            await sleep(300)
            setStep(0, 1, 'process')
            await sleep(1000)
            setStep(0, 1, 'finish')

            // 步骤 3: 挖矿计算
            await sleep(500)
            setStep(0, 2, 'process')

            const ts = Date.now()
            let nonce = 0
            let foundHash = ''
            const checkInterval = 200 // 每200个nonce更新一次进度

            while (nonce < 500000) {
                // 检查暂停和停止
                if (pausedRef.current) {
                    await sleep(100)
                    continue
                }

                if (stopRef.current) {
                    setStep(0, 2, 'error')
                    return
                }

                // 进度更新
                if (nonce % checkInterval === 0) {
                    setMiningProgress({
                        0: {
                            nonce,
                            progress: Math.floor((nonce / 500000) * 100)
                        }
                    })
                    await sleep(50)
                }

                const input = `${nextHeight}${nonce}${lastBlock.hash}${ts}${JSON.stringify(txs)}`
                const h = CryptoJS.SHA256(input).toString()
                if (h.startsWith(pattern)) {
                    foundHash = h
                    // 完成时设置100%
                    setMiningProgress({
                        0: {nonce, progress: 100}
                    })
                    break
                }
                nonce++
            }

            setStep(0, 2, 'finish')

            // 步骤 4: 广播区块
            await sleep(200)
            setStep(0, 3, 'process')

            const newBlock: MiniBlock = {
                height: nextHeight,
                nonce,
                data: JSON.stringify(txs),
                previous: lastBlock.hash,
                timestamp: ts,
                hash: foundHash,
                award: '0',
                miner: 'token Miner',
                txs: txs.length ? txs : undefined,
            }

            setBlocks(prev => [...prev, newBlock])
            await sleep(800)
            setStep(0, 3, 'finish')
        } catch (e) {
            console.error('挖矿过程中出现错误:', e)
            setStep(0, 2, 'error')
        } finally {
            setLoading(false)
        }
    }, [txs, nextHeight, lastBlock, pattern])

    const reset = () => {
        setBlocks([{
            height: 1,
            nonce: 49691,
            data: '第一笔交易记录数据',
            previous: '0'.repeat(64),
            timestamp: Date.now(),
            hash: '0000b61c8bb61a6faa7c46e4872623b6e5ebcfa4bcb5dc279f56aa96a365e5a',
            award: '0',
            miner: 'Genesis',
            txs: []
        }])
        setTxs([])
        setMiningProgress({})
        cfgRef.current?.reset()
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
                                🪙
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
                        <div className="flex items-center gap-3">
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0">
                                    即将打包区块
                                </div>
                                <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-md text-blue-700 dark:text-blue-400 font-mono text-sm font-bold shadow-inner">
                                    #{nextHeight}
                                </div>
                            </div>
                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                            <button
                                onClick={runMine}
                                disabled={loading || txs.length === 0}
                                className={`flex-[2] sm:flex-none px-6 py-2 rounded-xl text-sm font-bold border transition-all shadow-sm ${
                                    loading 
                                        ? "bg-yellow-50 border-yellow-300 text-yellow-700 dark:bg-yellow-500/20 dark:border-yellow-500/50 dark:text-yellow-500 animate-pulse"
                                        : "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600 hover:-translate-y-0.5 dark:bg-emerald-600 dark:border-emerald-700 dark:hover:bg-emerald-500"
                                } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                            >{loading ? "⛏️ 打包计算中..." : "⛏️ 打包转账"}</button>
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
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                            <TokenCfg
                                ref={cfgRef}
                                onTxsChange={(list) => setTxs(list)}
                            />
                        </div>
                        <div className="lg:col-span-2">
                            <Computer items={board} miningProgress={miningProgress}/>
                        </div>
                    </div>

                    {/* 下排：区块链展示 */}
                    <div className="rounded-xl border bg-white border-gray-200 dark:border-gray-700/60 dark:bg-[#161616] shadow-sm">
                        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700/50">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">网络账本同步 (公链)</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">包含所有有效代币转账记录的完整区块链</p>
                        </div>

                        <div className="p-4 sm:p-6">
                            <div className="border border-yellow-400 rounded-xl p-3 sm:p-4 bg-gray-50/50 dark:bg-black/20">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-bold text-green-600 dark:text-green-400">代币演示链</span>
                                </div>
                                <div className="overflow-x-auto custom-scrollbar pb-2">
                                    <BlockChainFull blocks={blocks}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 科普与下一步 */}
                <div className="mt-6 sm:mt-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FeatureCard 
                            icon={<FiFileText className="w-5 h-5 text-blue-500 dark:text-blue-400"/>}
                            title="交易就是数据"
                            desc="我们把普通的文本内容，替换成了格式化的“张三转给李四”转账记录，这就构成了代币系统的基石。"
                        />
                        <FeatureCard 
                            icon={<FiShield className="w-5 h-5 text-purple-500 dark:text-purple-400"/>}
                            title="不可篡改的账本"
                            desc="所有的代币转账都被包含在区块哈希的计算中，一旦被确认并同步，任何黑客都无法悄悄篡改某人的余额。"
                        />
                    </div>

                    <div className="flex justify-center pt-2 pb-8">
                        <Link 
                            href="/pow/coinbase" 
                            className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25"
                        >
                            下一步：了解代币从何而来 (币基)
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
