import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import { FiTarget, FiShield, FiZap, FiArrowRight, FiAward } from 'react-icons/fi'

function toHex(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
}

async function sha256(message: string): Promise<string> {
    const enc = new TextEncoder()
    const data = enc.encode(message)
    const digest = await crypto.subtle.digest('SHA-256', data)
    return toHex(digest)
}

export default function Hash(): React.ReactElement {
    const [data, setData] = useState<string>('')
    const [hash, setHash] = useState<string>('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
    const [uppercase, setUppercase] = useState<boolean>(false)
    const [copied, setCopied] = useState<boolean>(false)
    const [durationMs, setDurationMs] = useState<number>(0)
    const [isFlashing, setIsFlashing] = useState<boolean>(false)

    // 计算前导零的数量（挖矿趣味小游戏）
    const leadingZeros = hash.match(/^0+/)?.[0].length || 0;

    useEffect(() => {
        let active = true
        const id = setTimeout(async () => {
            try {
                const t0 = performance.now()
                const h = await sha256(data)
                const t1 = performance.now()
                if (active) {
                    if (h !== hash && data !== '') {
                        setIsFlashing(true)
                        setTimeout(() => { if (active) setIsFlashing(false) }, 300)
                    }
                    setHash(h)
                    setDurationMs(Math.max(0, t1 - t0))
                }
            } catch {
                // ignore
            }
        }, 200)
        return () => {
            active = false
            clearTimeout(id)
        }
    }, [data, hash])

    return (
        <div className="px-3 py-4 sm:px-4 sm:py-8">
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center tracking-tight">
                    区块链<span className="text-yellow-600 dark:text-yellow-400">在线演示平台</span>
                </h1>

                <div className="rounded-xl border bg-white border-gray-200 dark:border-gray-700 dark:bg-[#161616] shadow-sm overflow-hidden">
                    {/* 头部操作栏 */}
                    <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <h2 className="text-lg font-bold text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 animate-pulse"/>
                            SHA-256
                        </h2>
                        <div className="flex flex-wrap gap-2 sm:ml-auto">
                            <ActionBtn onClick={() => setData('Hello, DemoChain!')}>示例</ActionBtn>
                            <ActionBtn onClick={() => setData('')}>清空</ActionBtn>
                            <ActionBtn
                                onClick={async () => {
                                    try {
                                        await navigator.clipboard.writeText(uppercase ? hash.toUpperCase() : hash)
                                        setCopied(true)
                                        setTimeout(() => setCopied(false), 1500)
                                    } catch { /* ignore */ }
                                }}
                                disabled={!hash}
                                active={copied}
                            >
                                {copied ? '✓ 已复制' : '复制'}
                            </ActionBtn>
                            <ActionBtn onClick={() => setUppercase(v => !v)}>
                                {uppercase ? '大写' : '小写'}
                            </ActionBtn>
                        </div>
                    </div>

                    {/* 表单区 */}
                    <div className="px-4 py-4 sm:px-6 sm:py-6 space-y-5 sm:space-y-6">
                        {/* 数据输入 */}
                        <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                            <label className="sm:w-16 text-sm font-semibold text-gray-700 dark:text-gray-200 pt-0 sm:pt-2 shrink-0">
                                数据
                            </label>
                            <div className="flex-1 min-w-0">
                                <textarea
                                    rows={6}
                                    value={data}
                                    onChange={(e) => setData(e.target.value)}
                                    placeholder="在此输入要计算 SHA-256 的文本……"
                                    autoFocus
                                    className="w-full px-3 py-2.5 rounded-lg resize-none bg-gray-50 border border-gray-300 text-gray-900 text-[15px] leading-relaxed placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all dark:bg-black/30 dark:border-white/20 dark:text-white dark:placeholder:text-gray-500"
                                />
                                <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                    <span>字符: <b className="text-gray-700 dark:text-gray-300">{data.length}</b></span>
                                    <span>字节: <b className="text-gray-700 dark:text-gray-300">{new TextEncoder().encode(data).length}</b></span>
                                </div>
                            </div>
                        </div>

                        {/* 哈希输出 */}
                        <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                            <div className="sm:w-16 pt-0 sm:pt-2 shrink-0">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    哈希
                                </label>
                            </div>
                            <div className="flex-1 min-w-0 flex gap-3 sm:gap-4">
                                {/* 可视化像素头像 */}
                                <div 
                                    className="hidden sm:flex shrink-0 w-16 h-16 rounded-lg shadow-inner overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/50 items-center justify-center relative group"
                                    title="哈希可视化：每一个哈希都对应一个独一无二的图案"
                                >
                                    <HashAvatar hash={hash} />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="relative">
                                        <textarea
                                            rows={2}
                                            value={uppercase ? hash.toUpperCase() : hash}
                                            readOnly
                                            className={`w-full px-3 py-2.5 rounded-lg font-mono text-[13px] leading-5 tracking-wide break-all border cursor-text select-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 ${
                                                isFlashing 
                                                    ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-400 dark:border-green-500/50 shadow-[0_0_15px_rgba(74,222,128,0.2)]'
                                                    : 'bg-gray-100 dark:bg-black/40 border-gray-300 dark:border-white/15 text-gray-800 dark:text-green-400'
                                            }`}
                                        />
                                        {copied && (
                                            <span className="absolute right-2 top-2 text-[10px] font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800 animate-in fade-in">
                                                已复制
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-1.5 flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                            <span>长度: <b className="text-gray-700 dark:text-gray-300">{(uppercase ? hash.toUpperCase() : hash).length}</b></span>
                                            <span>耗时: <b className="text-gray-700 dark:text-gray-300">{durationMs.toFixed(1)} ms</b></span>
                                        </div>
                                        {/* 移动端显示的头像 */}
                                        <div className="sm:hidden w-6 h-6 rounded overflow-hidden border border-gray-200 dark:border-gray-700">
                                            <HashAvatar hash={hash} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 趣味挖矿小挑战 */}
                <div className={`rounded-xl border p-4 transition-all duration-500 flex items-center justify-between gap-4 ${
                    leadingZeros > 0 
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700/50 shadow-[0_0_20px_rgba(234,179,8,0.2)]' 
                        : 'bg-white dark:bg-[#161616] border-gray-200 dark:border-gray-700/60'
                }`}>
                    <div>
                        <h3 className="font-bold text-sm sm:text-base flex items-center gap-2 text-gray-900 dark:text-gray-100">
                            <FiAward className={leadingZeros > 0 ? "text-yellow-500" : "text-gray-400"} />
                            微型挑战：这就是挖矿！
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                            试着随意敲击键盘，看看你需要多久才能凑巧碰出一个<b className="text-gray-700 dark:text-gray-200">以 0 开头</b>的哈希值？这就是比特币矿机每天在做的事。
                        </p>
                    </div>
                    
                    {leadingZeros > 0 ? (
                        <div className="shrink-0 text-center animate-in zoom-in spin-in-12">
                            <div className="text-2xl sm:text-3xl">🎉</div>
                            <div className="text-[10px] font-bold text-yellow-600 dark:text-yellow-500 mt-1 uppercase tracking-wider">
                                {leadingZeros === 1 ? '挖矿成功' : '极品矿石!'}
                            </div>
                        </div>
                    ) : (
                        <div className="shrink-0 text-2xl sm:text-3xl opacity-20 grayscale">⛏️</div>
                    )}
                </div>

                {/* 科普说明区 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <FeatureCard 
                        icon={<FiTarget className="w-5 h-5 text-blue-500 dark:text-blue-400"/>}
                        title="确定性 (Deterministic)"
                        desc="无论计算多少次，相同的输入数据永远会得到完全相同的哈希输出。"
                    />
                    <FeatureCard 
                        icon={<FiShield className="w-5 h-5 text-purple-500 dark:text-purple-400"/>}
                        title="单向性 (One-way)"
                        desc="很容易从数据计算出哈希，但绝对无法从哈希值反向推导出原始数据。"
                    />
                    <FeatureCard 
                        icon={<FiZap className="w-5 h-5 text-orange-500 dark:text-orange-400"/>}
                        title="雪崩效应 (Avalanche Effect)"
                        desc="即使只改变输入数据的一个标点符号，计算出的哈希值也会面目全非。"
                    />
                </div>

                {/* 下一步引导 */}
                <div className="flex justify-center pt-4 pb-8">
                    <Link 
                        href="/pow/block" 
                        className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25"
                    >
                        下一步：了解区块结构
                        <FiArrowRight className="w-5 h-5" />
                    </Link>
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

function ActionBtn({children, onClick, disabled, active}: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    active?: boolean;
}): React.ReactElement {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all active:scale-95 ${
                active
                    ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 dark:bg-white/5 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/10 dark:hover:border-white/20'
            } disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100`}
        >
            {children}
        </button>
    )
}

// 可视化像素头像生成器 (Identicon)
function HashAvatar({ hash }: { hash: string }) {
    if (!hash || hash.length < 64) return null;
    
    // 利用哈希前几位生成一个确定的主题色
    const hue = parseInt(hash.slice(0, 4), 16) % 360;
    const color = `hsl(${hue}, 70%, 55%)`;

    // 生成 5x5 的对称矩阵（15个独立点，镜像补全）
    const grid = [];
    for (let i = 0; i < 5; i++) {
        const row = [];
        for (let j = 0; j < 3; j++) {
            // 利用哈希的不同部位决定该点是否着色
            const charIndex = 10 + i * 3 + j;
            const isActive = parseInt(hash[charIndex], 16) % 2 === 0;
            row.push(isActive);
        }
        // 镜像右半部分
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
