"use client"

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import * as CryptoJS from 'crypto-js'
import Link from 'next/link'
import { FiCpu, FiLink, FiArrowRight } from 'react-icons/fi'

const maxNonce = 500000

export default function Block(): React.ReactElement {
    const [height, setHeight] = useState<number>(1)
    const [nonce, setNonce] = useState<number>(72608)
    const [data, setData] = useState<string>('')
    const [hash, setHash] = useState<string>('0000f727854b50bb95c054b39c1fe5c92e5ebcfa4bcb5dc279f56aa96a365e5a')
    const [loading, setLoading] = useState<boolean>(false)
    const [difficulty, setDifficulty] = useState<number>(4)
    const pattern = useMemo(() => '0'.repeat(Math.max(0, Math.min(7, difficulty))), [difficulty])
    const [attempts, setAttempts] = useState<number>(0)
    const [durationMs, setDurationMs] = useState<number>(0)
    const isValid = useMemo(() => hash.startsWith(pattern), [hash, pattern])
    const [paused, setPaused] = useState<boolean>(false)
    const [currentNonce, setCurrentNonce] = useState<number>(0)
    const [copied, setCopied] = useState<boolean>(false)
    const [isFlashing, setIsFlashing] = useState<boolean>(false)
    const [showSuccess, setShowSuccess] = useState<boolean>(false)
    const pausedRef = useRef(false)
    const stopRef = useRef(false)

    const computeHash = useCallback((h: number, n: number, d: string) => {
        const str = `${h}${n}${d}`
        return CryptoJS.SHA256(str).toString()
    }, [])

    useEffect(() => {
        const newHash = computeHash(height, nonce, data)
        if (newHash !== hash) {
            setIsFlashing(true)
            setTimeout(() => setIsFlashing(false), 300)
        }
        setHash(newHash)
    }, [height, nonce, data, computeHash])

    const runMine = useCallback(async (startAt: number = 0) => {
        setLoading(true)
        setPaused(false)
        pausedRef.current = false
        stopRef.current = false
        const fresh = startAt === 0
        if (fresh) setAttempts(0)
        const t0 = performance.now()
        await new Promise((r) => setTimeout(r, 50))
        const localHeight = height
        const localData = data
        let foundHash = ''

        for (let i = startAt; i <= maxNonce; i++) {
            if (pausedRef.current || stopRef.current) {
                setCurrentNonce(i)
                const t1 = performance.now()
                setDurationMs(Math.max(0, t1 - t0))
                setLoading(false)
                return
            }
            const input = `${localHeight}${i}${localData}`
            const h = CryptoJS.SHA256(input).toString()
            if (h.substring(0, difficulty) === pattern) {
                setNonce(i)
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
            setHash(foundHash)
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 2000)
        }
        const t1 = performance.now()
        setDurationMs(Math.max(0, t1 - t0))
        setLoading(false)
    }, [height, data, difficulty, pattern])

    return (
        <div className="px-0 sm:px-4 py-4 sm:py-8 pb-32 sm:pb-8">
            <div className="max-w-4xl mx-auto">
                <div className={`sm:rounded-xl border-y sm:border transition-all duration-500 shadow-sm relative overflow-hidden ${
                    isValid 
                        ? 'bg-white border-emerald-300 dark:bg-[#1a1a1a] dark:border-emerald-500/30' 
                        : 'bg-white border-rose-300 dark:bg-[#1a1a1a] dark:border-rose-500/30'
                }`}>
                    {/* 状态背景光晕 */}
                    <div className={`absolute top-0 left-0 w-full h-1 transition-all duration-500 sm:rounded-t-xl ${isValid ? 'bg-emerald-400 dark:bg-emerald-500/50' : 'bg-rose-400 dark:bg-rose-500/50'}`} />
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700/50 relative z-10 mt-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg sm:text-xl font-bold leading-none text-gray-900 dark:text-yellow-500">区块</h2>
                            <span className={`inline-flex items-center h-6 gap-1 px-2 rounded text-xs font-bold border ${isValid ? 'text-emerald-700 bg-emerald-50 border-emerald-300 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-600' : 'text-rose-700 bg-rose-50 border-rose-300 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-600'}`}>
                                {isValid ? '有效' : '无效'}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
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
                            <div className="hidden sm:flex flex-wrap gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-gray-100 dark:border-gray-700/50">
                                <button
                                    onClick={() => setData('Hello, DemoChain!')}
                                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-gray-300 dark:hover:bg-white/5"
                                >示例</button>
                                <button
                                    onClick={() => {
                                        setData('');
                                        setNonce(1);
                                    }}
                                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-gray-300 dark:hover:bg-white/5"
                                >清空</button>
                                <button
                                    onClick={() => runMine(0)}
                                    disabled={loading}
                                    className={`flex-[2] sm:flex-none px-4 py-1.5 rounded-lg text-sm font-bold border transition-all ${
                                        loading 
                                            ? 'bg-yellow-50 border-yellow-300 text-yellow-700 dark:bg-yellow-500/20 dark:border-yellow-500/50 dark:text-yellow-500 animate-pulse'
                                            : 'bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600 dark:bg-emerald-600 dark:border-emerald-700 dark:hover:bg-emerald-500'
                                    }`}
                                >{loading ? '⛏️ 疯狂挖矿中...' : '⛏️ 开始挖矿'}</button>
                            </div>
                            <div className="hidden sm:flex flex-wrap gap-2 w-full sm:w-auto">
                                <button
                                    onClick={() => {
                                        pausedRef.current = true;
                                        setPaused(true);
                                    }}
                                    disabled={!loading || paused}
                                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-sm font-medium border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-all dark:bg-black/20 dark:border-white/10 dark:text-gray-300"
                                >暂停</button>
                                <button
                                    onClick={() => runMine(currentNonce + 1)}
                                    disabled={!paused}
                                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-sm font-medium border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-all dark:bg-black/20 dark:border-white/10 dark:text-gray-300"
                                >继续</button>
                                <button
                                    onClick={() => {
                                        stopRef.current = true;
                                        setPaused(false);
                                    }}
                                    disabled={!loading}
                                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-sm font-medium border bg-white text-gray-700 border-gray-200 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40 transition-all dark:bg-black/20 dark:border-white/10 dark:text-gray-300"
                                >停止</button>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400">高度</label>
                            <div className="flex items-center">
                                <span className="inline-flex items-center h-11 sm:h-9 px-3 bg-gray-50 border border-r-0 border-gray-300 text-gray-600 text-base sm:text-sm rounded-l-lg dark:bg-black/30 dark:border-gray-700 dark:text-gray-400">#</span>
                                <input
                                    type="number"
                                    value={height}
                                    min={1}
                                    onChange={(e) => setHeight(Number(e.target.value) || 1)}
                                    className="flex-1 h-11 sm:h-9 px-3 text-base sm:text-sm rounded-r-lg bg-white border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:bg-black/20 dark:border-gray-700 dark:text-gray-200 dark:focus:ring-blue-500/30"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400">随机数 (Nonce)</label>
                            <input
                                type="number"
                                value={nonce}
                                min={1}
                                max={maxNonce}
                                onChange={(e) => setNonce(Number(e.target.value) || 1)}
                                className="w-full h-11 sm:h-9 px-3 text-base sm:text-sm rounded-lg bg-white border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:bg-black/20 dark:border-gray-700 dark:text-gray-200 dark:focus:ring-blue-500/30"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400">数据 (Data)</label>
                                <div className="sm:hidden flex gap-2">
                                    <button onClick={() => setData('Hello, DemoChain!')} className="text-xs text-blue-600 dark:text-blue-400 p-1">示例</button>
                                    <button onClick={() => { setData(''); setNonce(1); }} className="text-xs text-gray-500 dark:text-gray-400 p-1">清空</button>
                                </div>
                            </div>
                            <textarea
                                rows={4}
                                value={data}
                                onChange={(e) => setData(e.target.value)}
                                placeholder="输入区块数据..."
                                className="w-full px-3 py-2.5 sm:py-2 text-base sm:text-sm bg-white border border-gray-300 text-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:bg-black/20 dark:border-gray-700 dark:text-gray-200 dark:focus:ring-blue-500/30 min-h-[4.5rem]"
                            />
                        </div>

                        <div className="space-y-1.5 pt-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400">本区块哈希 (Hash)</label>
                                <button
                                    onClick={async () => {
                                        try {
                                            await navigator.clipboard.writeText(hash);
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 1200);
                                        } catch {}
                                    }}
                                    className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 p-1"
                                >
                                    {copied ? '✓ 已复制' : '复制哈希'}
                                </button>
                            </div>
                            <div className="flex gap-3 sm:gap-4 relative">
                                {/* 成功庆祝动画 */}
                                {showSuccess && (
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 animate-in zoom-in spin-in-12 duration-500 pointer-events-none">
                                        <div className="text-4xl">🎉</div>
                                    </div>
                                )}
                                
                                {/* 可视化像素头像 */}
                                <div className="flex shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg shadow-inner overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/50 items-center justify-center relative group" title="哈希可视化头像">
                                    <HashAvatar hash={hash} />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div 
                                        className={`w-full px-2 py-2 sm:px-3 sm:py-2.5 rounded-lg font-mono text-[10px] sm:text-[13px] break-all border transition-all duration-300 min-h-[48px] sm:min-h-[60px] ${
                                            isFlashing 
                                                ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-400 dark:border-green-500/50 shadow-[0_0_15px_rgba(74,222,128,0.2)]'
                                                : isValid
                                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-600/50'
                                                    : 'bg-gray-100 dark:bg-black/40 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-white/15'
                                        }`}
                                    >
                                        {/* 前导零目标位高亮：增强挖矿游戏的视觉目标感 */}
                                        {difficulty > 0 && (
                                            <span className={`font-bold px-0.5 rounded-sm ${
                                                hash.substring(0, difficulty) === pattern
                                                    ? 'bg-emerald-200 dark:bg-emerald-500/40 text-emerald-900 dark:text-emerald-100'
                                                    : 'bg-rose-200 dark:bg-rose-500/40 text-rose-900 dark:text-rose-100'
                                            }`}>
                                                {hash.substring(0, difficulty)}
                                            </span>
                                        )}
                                        <span className="opacity-80">
                                            {hash.substring(difficulty)}
                                        </span>
                                    </div>
                                    <div className="mt-2 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 flex flex-wrap items-center justify-between gap-y-2">
                                        <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1">
                                            <span>尝试: <b className="text-gray-700 dark:text-gray-300">{attempts.toLocaleString()}</b></span>
                                            <span>耗时: <b className="text-gray-700 dark:text-gray-300">{durationMs.toFixed(1)} ms</b></span>
                                            <span className="hidden sm:inline">目标: <b className="text-gray-700 dark:text-gray-300 font-mono">{pattern || '无'}</b></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 移动端底部悬浮控制栏 */}
                <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 p-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-[calc(1rem+env(safe-area-inset-bottom))]">
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            当前 Nonce <span className="text-gray-900 dark:text-gray-100 font-mono ml-1">{currentNonce.toLocaleString()}</span>
                        </div>
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
                            disabled={loading}
                            className={`h-11 rounded-xl text-sm font-bold border transition-all flex items-center justify-center ${loading ? 'w-2/3' : 'w-full'} ${
                                loading 
                                    ? 'bg-yellow-50 border-yellow-300 text-yellow-700 dark:bg-yellow-500/20 dark:border-yellow-500/50 dark:text-yellow-500 animate-pulse'
                                    : 'bg-emerald-500 text-white border-emerald-600 dark:bg-emerald-600 dark:border-emerald-700 shadow-sm'
                            } disabled:opacity-50`}
                        >{loading ? '⛏️ 挖矿中...' : '⛏️ 开始挖矿'}</button>
                    </div>
                    {/* 移动端挖矿进度条 */}
                    {(loading || attempts > 0) && (
                        <div className="h-1 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden mt-3 absolute top-0 left-0 rounded-none">
                            <div
                                className="h-full transition-[width] duration-200 bg-emerald-500 dark:bg-emerald-400"
                                style={{width: `${Math.min(100, Math.floor((currentNonce / maxNonce) * 100))}%`}}
                            />
                        </div>
                    )}
                </div>

                {/* 科普与下一步 */}
                <div className="px-4 sm:px-0 mt-6 sm:mt-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FeatureCard 
                            icon={<FiCpu className="w-5 h-5 text-purple-500 dark:text-purple-400"/>}
                            title="Nonce：矿工的遥控器"
                            desc="矿工不能伪造交易数据，他们唯一能改变的就是这个叫 Nonce 的随机数。就像不停换台一样，直到哈希值满足难度要求为止。"
                        />
                        <FeatureCard 
                            icon={<FiLink className="w-5 h-5 text-blue-500 dark:text-blue-400"/>}
                            title="有效区块的诞生"
                            desc="当计算出的哈希值前导零数量达到目标难度时，页面变绿，这个区块就被视为“有效”，获得了被打包进区块链的资格。"
                        />
                    </div>

                    <div className="flex justify-center pt-2 pb-8">
                        <Link 
                            href="/pow/blockchain" 
                            className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25"
                        >
                            下一步：去区块链组装区块
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

function HashAvatar({ hash }: { hash: string }) {
    if (!hash || hash.length < 64) return null;
    const hue = parseInt(hash.slice(0, 4), 16) % 360;
    const color = `hsl(${hue}, 70%, 55%)`;

    const grid = [];
    for (let i = 0; i < 5; i++) {
        const row = [];
        for (let j = 0; j < 3; j++) {
            const charIndex = 10 + i * 3 + j;
            const isActive = parseInt(hash[charIndex], 16) % 2 === 0;
            row.push(isActive);
        }
        grid.push([...row, row[1], row[0]]);
    }

    return (
        <div className="w-full h-full flex flex-col p-1 sm:p-1.5">
            {grid.map((row, i) => (
                <div key={i} className="flex-1 flex">
                    {row.map((isActive, j) => (
                        <div 
                            key={j} 
                            className="flex-1 transition-colors duration-200" 
                            style={{ backgroundColor: isActive ? color : 'transparent' }} 
                        />
                    ))}
                </div>
            ))}
        </div>
    )
}
