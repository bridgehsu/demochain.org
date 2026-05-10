"use client"

import React, { useMemo, useState, useEffect } from 'react'
import type { Block } from '@/types/blockchain'

// 可视化像素头像生成器 (Identicon)
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
        <div className="w-full h-full flex flex-col p-1">
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

export default function BlockCard({ 
  block, 
  difficulty = 4, 
  readonly = false
}: { 
  block: Block
  difficulty?: number
  readonly?: boolean
}): React.ReactElement {
  const pattern = useMemo(() => '0'.repeat(Math.max(0, Math.min(7, difficulty))), [difficulty])
  const isValid = useMemo(() => block.hash.startsWith(pattern), [block.hash, pattern])
  const [formattedTime, setFormattedTime] = useState<string>('')
  
  useEffect(() => {
    // 客户端格式化时间戳避免水合错误
    setFormattedTime(new Date(block.timestamp).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }))
  }, [block.timestamp])
  
  return (
    <div className="chain-block-card relative group transition-transform duration-300 hover:-translate-y-1">
      <div className={`rounded-xl border transition-all duration-500 shadow-sm overflow-hidden relative ${
        isValid 
            ? 'bg-white border-emerald-300 dark:bg-[#1a1a1a] dark:border-emerald-500/30' 
            : 'bg-white border-rose-300 dark:bg-[#1a1a1a] dark:border-rose-500/30'
      }`}>
        {/* 状态背景光晕 */}
        <div className={`absolute top-0 left-0 w-full h-1 transition-all duration-500 rounded-t-xl ${isValid ? 'bg-emerald-400 dark:bg-emerald-500/50' : 'bg-rose-400 dark:bg-rose-500/50'}`} />
        
        <div className="px-4 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700/50 mt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                区块 <span className="text-yellow-600 dark:text-yellow-500">#{block.height}</span>
              </h2>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${
                  isValid 
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-300 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-600' 
                      : 'text-rose-700 bg-rose-50 border-rose-300 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-600'
              }`}>{isValid ? '有效' : '无效'}</span>
            </div>
            <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-mono">
              {formattedTime}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400">高度</label>
            <div className="flex items-center">
              <span className="inline-flex items-center h-11 sm:h-9 px-3 bg-gray-50 border border-r-0 border-gray-300 text-gray-600 text-base sm:text-sm rounded-l-lg dark:bg-black/30 dark:border-gray-700 dark:text-gray-400">#</span>
              <input
                type="number"
                value={block.height}
                disabled={readonly}
                className="flex-1 h-11 sm:h-9 px-3 text-base sm:text-sm rounded-r-lg bg-white border border-gray-300 text-gray-700 focus:outline-none dark:bg-black/20 dark:border-gray-700 dark:text-gray-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400">随机数 (Nonce)</label>
            <input
              type="number"
              value={block.nonce}
              disabled={readonly}
              className="w-full h-11 sm:h-9 px-3 text-base sm:text-sm rounded-lg bg-white border border-gray-300 text-gray-700 focus:outline-none dark:bg-black/20 dark:border-gray-700 dark:text-gray-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400">时间戳</label>
            <input
              type="text"
              value={formattedTime}
              disabled
              className="w-full h-11 sm:h-9 px-3 text-xs sm:text-sm bg-gray-50 border border-gray-300 text-gray-500 rounded-lg cursor-not-allowed dark:bg-black/40 dark:border-gray-700 dark:text-gray-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400">数据 (Data)</label>
            <textarea
              rows={3}
              value={block.data}
              disabled={readonly}
              className="w-full px-3 py-2 sm:py-2.5 text-base sm:text-sm bg-white border border-gray-300 text-gray-700 rounded-lg resize-none focus:outline-none dark:bg-black/20 dark:border-gray-700 dark:text-gray-200 min-h-[4.5rem]"
            />
            <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-3">
              <span>字符: <b className="text-gray-700 dark:text-gray-400">{block.data.length}</b></span>
              <span>字节: <b className="text-gray-700 dark:text-gray-400">{new TextEncoder().encode(block.data).length}</b></span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400">前驱哈希 (Prev Hash)</label>
            <input
              type="text"
              value={block.previous}
              disabled={readonly}
              className="w-full h-11 sm:h-9 px-3 text-xs bg-gray-50 border border-gray-300 text-gray-600 rounded-lg font-mono cursor-not-allowed dark:bg-black/40 dark:border-gray-700 dark:text-gray-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400">本区块哈希 (Hash)</label>
            <div className="flex gap-3">
              {/* 可视化像素头像 */}
              <div 
                  className="flex shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg shadow-inner overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/50 items-center justify-center relative"
                  title="哈希可视化头像"
              >
                  <HashAvatar hash={block.hash} />
              </div>
              
              <div className="flex-1 min-w-0">
                  <div className={`w-full px-2 py-2 sm:px-3 sm:py-2.5 rounded-lg font-mono text-[10px] sm:text-xs break-all border transition-all duration-300 ${
                      isValid
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-600/50'
                          : 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-600/50'
                  }`}>
                      {/* 前导零目标位高亮 */}
                      {difficulty > 0 && (
                          <span className={`font-bold px-0.5 rounded-sm ${
                              block.hash.substring(0, difficulty) === pattern
                                  ? 'bg-emerald-200 dark:bg-emerald-500/40 text-emerald-900 dark:text-emerald-100'
                                  : 'bg-rose-200 dark:bg-rose-500/40 text-rose-900 dark:text-rose-100'
                          }`}>
                              {block.hash.substring(0, difficulty)}
                          </span>
                      )}
                      <span className="opacity-80">
                          {block.hash.substring(difficulty)}
                      </span>
                  </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-3 pt-1">
              <span>目标难度: <b className="text-gray-700 dark:text-gray-400 font-mono">{pattern || '无'}</b></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
