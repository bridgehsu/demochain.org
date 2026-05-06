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
        <div className="block-page px-3 py-4 sm:px-4 sm:py-8">
            <div className="contain max-w-4xl mx-auto">
                <div className={`r-card rounded-xl border transition-all duration-500 shadow-sm relative overflow-hidden ${
                    isValid 
                        ? 'bg-white border-emerald-300 dark:bg-[#161616] dark:border-emerald-500/30' 
                        : 'bg-white border-rose-300 dark:bg-[#161616] dark:border-rose-500/30'
                }`}>
                    {/* 状态背景光晕 */}
                    <div className={`absolute top-0 left-0 w-full h-1 transition-all duration-500 ${isValid ? 'bg-emerald-400 dark:bg-emerald-500/50' : 'bg-rose-400 dark:bg-rose-500/50'}`} />
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700/50 relative z-10">
                        <div className="flex items-center gap-3">
                            <h2 className="block-title text-xl font-semibold leading-none text-gray-900 dark:text-yellow-500">区块</h2>
                            <span className={`inline-flex items-center h-6 gap-1 px-2 rounded text-xs font-medium border ${isValid ? 'text-emerald-700 bg-emerald-50 border-emerald-300 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-600' : 'text-rose-700 bg-rose-50 border-rose-300 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-600'}`}>
                                {isValid ? '有效' : '无效'}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
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
                            <div className="flex flex-wrap gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-gray-100 dark:border-gray-700/50">
                                <button
                                    onClick={() => setData('Hello, DemoChain!')}
                                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white dark:hover:bg-black/30"
                                >示例</button>
                                <button
                                    onClick={() => {
                                        setData('');
                                        setNonce(1);
                                    }}
                                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white dark:hover:bg-black/30"
                                >清空</button>
                                <button
                                    onClick={() => runMine(0)}
                                    disabled={loading}
                                    className={`flex-[2] sm:flex-none px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${
                                        loading 
                                            ? 'bg-yellow-50 border-yellow-300 text-yellow-700 dark:bg-yellow-500/20 dark:border-yellow-500/50 dark:text-yellow-500 animate-pulse'
                                            : 'bg-white text-green-700 border-green-300 hover:bg-green-50 dark:bg-transparent dark:border-green-500 dark:text-green-500 dark:hover:bg-green-500/10'
                                    }`}
                                >{loading ? '⛏️ 疯狂挖矿中...' : '⛏️ 开始挖矿'}</button>
                            </div>
                            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                                <button
                                    onClick={() => {
                                        pausedRef.current = true;
                                        setPaused(true);
                                    }}
                                    disabled={!loading || paused}
                                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 disabled:opacity-50 dark:bg-black/20 dark:border-white/20 dark:text-white"
                                >暂停</button>
                                <button
                                    onClick={() => runMine(currentNonce + 1)}
                                    disabled={!paused}
                                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 disabled:opacity-50 dark:bg-black/20 dark:border-white/20 dark:text-white"
                                >继续</button>
                                <button
                                    onClick={() => {
                                        stopRef.current = true;
                                        setPaused(false);
                                    }}
                                    disabled={!loading}
                                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 disabled:opacity-50 dark:bg-black/20 dark:border-white/20 dark:text-white"
                                >停止</button>
                                <button
                                    onClick={async () => {
                                        try {
                                            await navigator.clipboard.writeText(hash);
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 1200);
                                        } catch {}
                                    }}
                                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white"
                                >{copied ? '✓ 已复制' : '复制'}</button>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
                            <label className="sm:w-16 text-sm font-semibold text-gray-700 dark:text-gray-200 shrink-0">高度</label>
                            <div className="flex-1 flex items-center min-w-0">
                                <span className="inline-flex items-center h-10 px-3 bg-gray-50 border border-r-0 border-gray-300 text-gray-700 text-sm rounded-l-lg dark:bg-black/30 dark:border-white/20 dark:text-white shrink-0">#</span>
                                <input
                                    type="number"
                                    value={height}
                                    min={1}
                                    onChange={(e) => setHeight(Number(e.target.value) || 1)}
                                    className="w-full h-10 px-3 rounded-r-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 dark:bg-black/30 dark:border-white/20 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
                            <label className="sm:w-16 text-sm font-semibold text-gray-700 dark:text-gray-200 shrink-0">随机数</label>
                            <div className="flex-1 min-w-0">
                                <input
                                    type="number"
                                    value={nonce}
                                    min={1}
                                    max={maxNonce}
                                    onChange={(e) => setNonce(Number(e.target.value) || 1)}
                                    className="w-full h-10 px-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 dark:bg-black/30 dark:border-white/20 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-4">
                            <label className="sm:w-16 text-sm font-semibold pt-0 sm:pt-2 text-gray-700 dark:text-gray-200 shrink-0">数据</label>
                            <div className="flex-1 min-w-0">
                                <textarea
                                    rows={6}
                                    value={data}
                                    onChange={(e) => setData(e.target.value)}
                                    placeholder="输入区块数据..."
                                    className="w-full px-3 py-2.5 rounded-lg resize-none bg-gray-50 border border-gray-300 text-[15px] text-gray-900 focus:outline-none focus:border-blue-500 dark:bg-black/30 dark:border-white/20 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-4">
                            <label className="sm:w-16 text-sm font-semibold pt-0 sm:pt-2 text-gray-700 dark:text-gray-200 shrink-0">哈希</label>
                            <div className="flex-1 min-w-0 flex gap-3 sm:gap-4 relative">
                                {/* 成功庆祝动画 */}
                                {showSuccess && (
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 animate-in zoom-in spin-in-12 duration-500 pointer-events-none">
                                        <div className="text-4xl">🎉</div>
                                    </div>
                                )}
                                
                                {/* 可视化像素头像 */}
                                <div className="hidden sm:flex shrink-0 w-16 h-16 rounded-lg shadow-inner overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/50 items-center justify-center relative group" title="哈希可视化头像">
                                    <HashAvatar hash={hash} />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div 
                                        className={`w-full px-3 py-2.5 rounded-lg font-mono text-[13px] break-all border transition-all duration-300 min-h-[60px] ${
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
                                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap items-center justify-between gap-y-2">
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                            <span>尝试: <b className="text-gray-700 dark:text-gray-300">{attempts.toLocaleString()}</b></span>
                                            <span>耗时: <b className="text-gray-700 dark:text-gray-300">{durationMs.toFixed(1)} ms</b></span>
                                            <span>目标: <b className="text-gray-700 dark:text-gray-300 font-mono">{pattern || '无'}</b></span>
                                            <span>当前 Nonce: <b className="text-gray-700 dark:text-gray-300">{currentNonce.toLocaleString()}</b></span>
                                        </div>
                                        {/* 移动端显示的头像 */}
                                        <div className="sm:hidden w-6 h-6 rounded overflow-hidden border border-gray-200 dark:border-gray-700">
                                            <HashAvatar hash={hash} />
                                        </div>
                                    </div>
                                    <div className="mt-2 h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                        <div
                                            className={`h-full transition-[width] duration-200 ${showSuccess ? 'bg-yellow-400' : 'bg-emerald-500 dark:bg-emerald-400'}`}
                                            style={{width: `${Math.min(100, Math.floor((currentNonce / maxNonce) * 100))}%`}}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 科普与下一步 */}
                <div className="mt-6 sm:mt-8 space-y-6">
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
