"use client"

import React, {useCallback, useEffect, useRef, useState, useMemo} from 'react'
import BlockCard from '@/components/blockchain/BlockCard'
import XData, {XDataRef} from '@/components/blockchain/XData'
import type {Block} from '@/types/blockchain'
import * as CryptoJS from 'crypto-js'
import Link from 'next/link'
import { FiCpu, FiLink, FiArrowRight } from 'react-icons/fi'

const maxNonce = 500000
const genesisHash = '0000000000000000000000000000000000000000000000000000000000000000'

export default function BlockchainPage(): React.ReactElement {
    const dataRef = useRef<XDataRef | null>(null)
    const [difficulty, setDifficulty] = useState<number>(4)
    const [loading, setLoading] = useState<boolean>(false)
    const [paused, setPaused] = useState<boolean>(false)
    const [attempts, setAttempts] = useState<number>(0)
    const [currentNonce, setCurrentNonce] = useState<number>(0)
    const [durationMs, setDurationMs] = useState<number>(0)
    const pausedRef = useRef(false)
    const stopRef = useRef(false)
    const [pendingData, setPendingData] = useState<string>('')
    const [blocks, setBlocks] = useState<Block[]>([
        {
            height: 1,
            nonce: 72608,
            data: 'Genesis block',
            previous: genesisHash,
            timestamp: 1640995200000, // 固定时间戳避免水合错误
            hash: '0000f727854b50bb95c054b39c1fe5c92e5ebcfa4bcb5dc279f56aa96a365e5a'
        }
    ])

    // 客户端初始化时更新创世区块时间戳
    useEffect(() => {
        setBlocks(prev => [
            {
                ...prev[0],
                timestamp: Date.now()
            }
        ])
    }, [])

    const pattern = useMemo(() => '0'.repeat(Math.max(0, Math.min(7, difficulty))), [difficulty])
    const currentBlock = blocks[blocks.length - 1]
    const nextHeight = currentBlock.height + 1

    const computeHash = useCallback((b: Block) => {
        const str = `${b.height}${b.nonce}${b.previous}${b.timestamp}${b.data}`
        return CryptoJS.SHA256(str).toString()
    }, [])

    const updateData = (val: string) => {
        setPendingData(val)
    }

    const addNewBlock = useCallback(() => {
        const newBlock: Block = {
            height: nextHeight,
            nonce: 1,
            data: pendingData,
            previous: currentBlock.hash,
            timestamp: Date.now(),
            hash: ''
        }
        const hash = computeHash(newBlock)
        const blockWithHash = {...newBlock, hash}
        setBlocks(prev => [...prev, blockWithHash])
        setPendingData('')
        dataRef.current?.reset()
    }, [nextHeight, pendingData, currentBlock.hash, computeHash])

    const resetChain = useCallback(() => {
        setBlocks([{
            height: 1,
            nonce: 72608,
            data: 'Genesis block',
            previous: genesisHash,
            timestamp: Date.now(),
            hash: '0000f727854b50bb95c054b39c1fe5c92e5ebcfa4bcb5dc279f56aa96a365e5a'
        }])
        setPendingData('')
        dataRef.current?.reset()
    }, [])

    const runMine = useCallback(async (startAt: number = 0) => {
        if (!pendingData.trim()) {
            alert('请先输入区块数据！')
            return
        }

        setLoading(true)
        setPaused(false)
        pausedRef.current = false
        stopRef.current = false
        const fresh = startAt === 0
        if (fresh) setAttempts(0)
        const t0 = performance.now()
        await new Promise((r) => setTimeout(r, 50))

        const localHeight = nextHeight
        const localData = pendingData
        const localPrevious = currentBlock.hash
        const localTimestamp = Date.now()
        let foundNonce = 0
        let foundHash = ''

        for (let i = startAt; i <= maxNonce; i++) {
            if (pausedRef.current || stopRef.current) {
                setCurrentNonce(i)
                const t1 = performance.now()
                setDurationMs(Math.max(0, t1 - t0))
                setLoading(false)
                return
            }
            const input = `${localHeight}${i}${localPrevious}${localTimestamp}${localData}`
            const h = CryptoJS.SHA256(input).toString()
            if (h.substring(0, difficulty) === pattern) {
                foundNonce = i
                foundHash = h
                setAttempts(prev => prev + (i - startAt + 1))
                setCurrentNonce(i)
                break
            }
            if (i % 500 === 0) {
                setCurrentNonce(i)
            }
            if (i % 4000 === 0) {
                // eslint-disable-next-line no-await-in-loop
                await new Promise((r) => setTimeout(r, 0))
            }
        }

        if (foundHash) {
            // 挖矿成功，添加新区块到链中
            const newBlock: Block = {
                height: localHeight,
                nonce: foundNonce,
                data: localData,
                previous: localPrevious,
                timestamp: localTimestamp,
                hash: foundHash
            }
            setBlocks(prev => [...prev, newBlock])
            setPendingData('')
            dataRef.current?.reset()
        }

        const t1 = performance.now()
        setDurationMs(Math.max(0, t1 - t0))
        setLoading(false)
    }, [nextHeight, pendingData, currentBlock.hash, difficulty, pattern])

    return (
        <div className="px-0 sm:px-4 py-4 sm:py-8 pb-32 sm:pb-8">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
                {/* 桌面端控制面板 - 移动端隐藏或重组 */}
                <div className="p-4 sm:p-6 sm:rounded-2xl border-y sm:border bg-white border-gray-200 dark:border-gray-700/60 dark:bg-[#161616] shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700/50 pb-4 sm:pb-6">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-yellow-500">区块链</h1>
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                                链长: {blocks.length} 块
                            </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
                            <div className="flex items-center gap-2 w-full sm:w-auto bg-gray-50 dark:bg-black/20 p-2 sm:p-0 rounded-lg sm:bg-transparent">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-400 shrink-0">难度</label>
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
                                onClick={resetChain}
                                disabled={loading}
                                className="flex-1 sm:flex-none px-4 py-2 sm:py-1.5 rounded-lg text-sm font-semibold border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-rose-600 hover:border-rose-200 transition-all disabled:opacity-50 dark:bg-black/20 dark:border-white/10 dark:text-gray-300 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 dark:hover:border-rose-500/30"
                            >重置整个链</button>
                        </div>
                    </div>

                    <div className="hidden sm:flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 sm:pt-6">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0">
                                即将打包区块
                            </div>
                            <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-md text-blue-700 dark:text-blue-400 font-mono text-sm font-bold shadow-inner">
                                #{nextHeight}
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => runMine(0)}
                                disabled={loading || !pendingData.trim()}
                                className={`flex-[2] sm:flex-none px-6 py-2 rounded-xl text-sm font-bold border transition-all shadow-sm ${
                                    loading 
                                        ? 'bg-yellow-50 border-yellow-300 text-yellow-700 dark:bg-yellow-500/20 dark:border-yellow-500/50 dark:text-yellow-500 animate-pulse'
                                        : 'bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600 hover:-translate-y-0.5 dark:bg-emerald-600 dark:border-emerald-700 dark:hover:bg-emerald-500'
                                } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                            >{loading ? '⛏️ 疯狂挖矿中...' : '⛏️ 挖矿打包'}</button>
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
                                    onClick={() => runMine(currentNonce + 1)}
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
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            即将打包区块 <span className="text-blue-600 dark:text-blue-400 font-bold ml-1">#{nextHeight}</span>
                        </div>
                        {loading && (
                            <div className="text-xs text-yellow-600 dark:text-yellow-500 font-mono">
                                尝试: {attempts.toLocaleString()}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {loading && (
                            <div className="flex gap-2 w-1/3">
                                <button
                                    onClick={() => {
                                        if (paused) {
                                            runMine(currentNonce + 1)
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
                            onClick={() => runMine(0)}
                            disabled={loading || !pendingData.trim()}
                            className={`h-11 rounded-xl text-sm font-bold border transition-all flex items-center justify-center ${loading ? 'w-2/3' : 'w-full'} ${
                                loading 
                                    ? 'bg-yellow-50 border-yellow-300 text-yellow-700 dark:bg-yellow-500/20 dark:border-yellow-500/50 dark:text-yellow-500 animate-pulse'
                                    : 'bg-emerald-500 text-white border-emerald-600 dark:bg-emerald-600 dark:border-emerald-700 shadow-sm'
                            } disabled:opacity-50`}
                        >{loading ? '⛏️ 挖矿中...' : '⛏️ 挖矿打包'}</button>
                    </div>
                    {/* 移动端挖矿进度条 */}
                    {(loading || attempts > 0) && (
                        <div className="h-1 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden mt-3 absolute top-0 left-0 rounded-none">
                            <div
                                className="h-full bg-emerald-500 dark:bg-emerald-400 transition-[width] duration-200"
                                style={{width: `${Math.min(100, Math.floor((currentNonce / maxNonce) * 100))}%`}}
                            />
                        </div>
                    )}
                </div>

                {/* 桌面端挖矿统计 */}
                <div className="hidden sm:block">
                    {(loading || attempts > 0) && (
                        <div className="p-4 rounded-xl border bg-white border-gray-200 dark:border-gray-700/60 dark:bg-[#161616] shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">挖矿统计 <span className="text-blue-600 dark:text-blue-400">#{nextHeight}</span></span>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                                    <span>尝试: <b className="text-gray-700 dark:text-gray-300">{attempts.toLocaleString()}</b></span>
                                    <span>耗时: <b className="text-gray-700 dark:text-gray-300">{durationMs.toFixed(1)} ms</b></span>
                                    <span>当前 Nonce: <b className="text-gray-700 dark:text-gray-300">{currentNonce.toLocaleString()}</b></span>
                                </div>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500 dark:bg-emerald-400 transition-[width] duration-200"
                                    style={{width: `${Math.min(100, Math.floor((currentNonce / maxNonce) * 100))}%`}}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* 数据输入区 */}
                <div className="px-4 sm:px-0">
                    <XData ref={dataRef as any} onChange={updateData}/>
                </div>

                {/* 区块链展示 */}
                <div className="sm:rounded-xl border-y sm:border bg-white border-gray-200 dark:border-gray-700/60 dark:bg-[#161616] shadow-sm overflow-hidden">
                    <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-transparent">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">网络账本同步 (公链)</h3>
                            <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-bold bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                {blocks.length} 块
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">包含所有已确认区块的完整链式结构，修改历史数据将导致后续区块验证失败。</p>
                    </div>

                    <div className="p-4 sm:p-6 relative">
                        <div className="border border-yellow-400/50 sm:border-yellow-400 rounded-xl p-2 sm:p-4 bg-gray-50/50 dark:bg-black/20 overflow-hidden relative">
                            <div className="flex items-center justify-between mb-3 px-2 sm:px-0">
                                <span className="text-sm font-bold text-green-600 dark:text-green-400">区块链演示链</span>
                            </div>
                            
                            <div className="overflow-x-auto pb-4 custom-scrollbar relative">
                                <div className="flex items-center gap-4 sm:gap-6 min-w-max px-2 py-2">
                                    {blocks.map((block, index) => (
                                        <div key={block.height} className="flex items-center">
                                            <div className="flex-shrink-0 w-[88vw] sm:w-[400px]">
                                                <BlockCard
                                                    block={block}
                                                    difficulty={difficulty}
                                                    readonly={true}
                                                />
                                            </div>
                                            {index < blocks.length - 1 && (
                                                <div className="flex-shrink-0 mx-1 sm:mx-3 flex items-center relative opacity-60">
                                                    <div className="flex items-center animate-pulse">
                                                        <div className="w-8 sm:w-12 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400 dark:from-blue-600 dark:to-cyan-500 rounded-l-full"></div>
                                                        <div className="w-0 h-0 border-l-[8px] sm:border-l-[10px] border-l-cyan-400 dark:border-l-cyan-500 border-t-[5px] sm:border-t-[6px] border-t-transparent border-b-[5px] sm:border-b-[6px] border-b-transparent"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* 移动端横向滚动渐变遮罩暗示 */}
                            <div className="sm:hidden absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-gray-50/90 dark:from-black/80 to-transparent pointer-events-none rounded-r-xl" />
                        </div>
                        
                        <div className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 text-center flex items-center justify-center gap-3 mt-4 bg-gray-50 dark:bg-[#1a1a1a] py-3 rounded-xl border border-gray-100 dark:border-gray-800">
                            <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-600"></span>
                            <span className="flex items-center gap-1.5">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 animate-bounce-x" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                左右滑动查看完整时间线
                            </span>
                            <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-600"></span>
                        </div>
                    </div>
                </div>

                {/* 科普与下一步 */}
                <div className="px-4 sm:px-0 mt-6 sm:mt-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FeatureCard 
                            icon={<FiLink className="w-5 h-5 text-blue-500 dark:text-blue-400"/>}
                            title="牵一发而动全身"
                            desc="修改任何历史区块的数据，都会导致它的哈希值发生雪崩式改变。这使得下一个区块记录的“前驱哈希”无法匹配，导致链条断裂。"
                        />
                        <FeatureCard 
                            icon={<FiCpu className="w-5 h-5 text-purple-500 dark:text-purple-400"/>}
                            title="重新计算的代价"
                            desc="如果你想篡改历史，你必须重新进行工作量证明（挖矿）来修复断裂的区块，并且还要跑赢整个网络，这在算力庞大的公链中几乎是不可能的。"
                        />
                    </div>

                    <div className="flex justify-center pt-2 pb-8">
                        <Link 
                            href="/pow/distribution" 
                            className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25"
                        >
                            下一步：体验分布式算力竞争
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
