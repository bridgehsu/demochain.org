"use client"

import React, { forwardRef, useImperativeHandle, useState } from 'react'

export type PoolCfgRef = {
  reset: () => void
}

type Props = {
  onGpuChange?: (config: { machine: 'A' | 'B' | 'C', gpu: '1' | '2' | '3' }) => void
  onDataChange?: (data: string) => void
}

export default forwardRef<PoolCfgRef, Props>(function PoolCfg({ onGpuChange, onDataChange }, ref) {
  const [aGpu, setAGpu] = useState<'1' | '2' | '3'>('1')
  const [bGpu, setBGpu] = useState<'1' | '2' | '3'>('2')
  const [cGpu, setCGpu] = useState<'1' | '2' | '3'>('3')
  const [data, setData] = useState('')

  const reset = () => {
    setAGpu('1')
    setBGpu('2')
    setCGpu('3')
    setData('')
    onDataChange?.('')
  }

  useImperativeHandle(ref, () => ({ reset }), [])

  const handleGpuChange = (machine: 'A' | 'B' | 'C', gpu: '1' | '2' | '3') => {
    if (machine === 'A') setAGpu(gpu)
    if (machine === 'B') setBGpu(gpu)
    if (machine === 'C') setCGpu(gpu)
    onGpuChange?.({ machine, gpu })
  }

  const handleDataChange = (val: string) => {
    setData(val)
    onDataChange?.(val)
  }

  return (
    <div className="pool-cfg h-full sm:rounded-xl border-y sm:border bg-white border-gray-200 dark:border-gray-700/60 dark:bg-[#161616] shadow-sm flex flex-col">
      <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-transparent">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">矿池配置</h3>
      </div>
      
      <div className="p-4 sm:p-6 space-y-6 flex-1">
        {/* GPU配置 */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">GPU配置</h4>
          
          <div className="space-y-3">
            {(['A', 'B', 'C'] as const).map((machine) => (
              <div key={machine} className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">电脑{machine}</label>
                <select
                  value={machine === 'A' ? aGpu : machine === 'B' ? bGpu : cGpu}
                  onChange={(e) => handleGpuChange(machine, e.target.value as '1' | '2' | '3')}
                  className="px-3 h-11 sm:h-9 text-base sm:text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:bg-black/20 dark:border-gray-700 dark:text-gray-200"
                >
                  <option value="1">GPU-1 (慢)</option>
                  <option value="2">GPU-2 (中)</option>
                  <option value="3">GPU-3 (快)</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* 数据输入 */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">交易数据</label>
          <textarea
            rows={4}
            value={data}
            onChange={(e) => handleDataChange(e.target.value)}
            placeholder="请输入交易数据..."
            className="w-full px-3 py-2.5 sm:py-2 text-base sm:text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none dark:bg-black/20 dark:border-gray-700 dark:text-gray-200 min-h-[4.5rem]"
          />
        </div>

        {/* 重置按钮 */}
        <div className="pt-2">
          <button
            onClick={reset}
            className="w-full h-11 sm:h-10 text-base sm:text-sm font-semibold rounded-lg border bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-rose-600 transition-colors dark:bg-black/30 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
          >
            重置配置
          </button>
        </div>
      </div>
    </div>
  )
})
