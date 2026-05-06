"use client"

import React, { forwardRef, useImperativeHandle, useState } from 'react'

export type XDataRef = { reset: () => void }

export default forwardRef(function XData(
  { onChange }: { onChange?: (val: string) => void },
  ref: React.Ref<XDataRef | undefined>
) {
  const [data, setData] = useState('')

  const change = (val: string) => {
    setData(val)
    onChange?.(val)
  }

  const reset = () => {
    setData('')
    onChange?.('')
  }

  useImperativeHandle(ref, () => ({ reset }), [])

  return (
    <div className="rounded-2xl border bg-white border-gray-200 dark:border-gray-700/60 dark:bg-[#161616] shadow-sm">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700/50">
        <h2 className="card-title text-lg font-bold text-gray-900 dark:text-gray-100">输入待打包数据</h2>
        <button
          onClick={reset}
          className="px-4 py-1.5 rounded-lg text-sm font-semibold border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-rose-600 hover:border-rose-200 transition-all dark:bg-black/20 dark:border-white/10 dark:text-gray-300 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 dark:hover:border-rose-500/30"
        >
          清空内容
        </button>
      </div>
      
      <div className="p-4 sm:p-6">
        <textarea
          rows={6}
          value={data}
          onChange={(e) => change(e.target.value)}
          placeholder="请输入任意文本数据作为模拟的区块链打包内容..."
          className="w-full px-4 py-3 text-sm sm:text-base rounded-xl resize-none bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all dark:bg-black/20 dark:border-gray-700/50 dark:text-gray-200 dark:focus:ring-blue-500/30 dark:focus:border-blue-500 dark:focus:bg-black/40"
        />
      </div>
    </div>
  )
})
