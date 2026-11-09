import React, {useEffect, useId, useRef, useState} from 'react';

export type SelectOption = {
    value: string;
    label: string;
};

type SelectProps = {
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
    className?: string;
    disabled?: boolean;
    'aria-label'?: string;
};

export default function Select({
    value,
    options,
    onChange,
    className = '',
    disabled = false,
    'aria-label': ariaLabel,
}: SelectProps): React.ReactElement {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const listId = useId();
    const selected = options.find(option => option.value === value) ?? options[0];

    useEffect(() => {
        if (!open) return;

        const onPointerDown = (event: MouseEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false);
        };

        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open]);

    return (
        <div ref={rootRef} className={`relative inline-block ${className}`}>
            <button
                type="button"
                disabled={disabled}
                aria-label={ariaLabel}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listId}
                onClick={() => setOpen(prev => !prev)}
                className="inline-flex w-full min-w-[8.5rem] items-center justify-between gap-2 h-8 px-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50 dark:border-gray-600 dark:bg-[#1f1f23] dark:text-white dark:hover:bg-[#26262b]"
            >
                <span className="truncate">{selected?.label ?? value}</span>
                <svg className={`h-3.5 w-3.5 shrink-0 opacity-60 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd"/>
                </svg>
            </button>

            {open && (
                <div
                    id={listId}
                    role="listbox"
                    aria-label={ariaLabel}
                    className="absolute left-0 z-[120] mt-1 max-h-64 min-w-full overflow-auto rounded-xl border border-gray-200 bg-white p-1 shadow-xl dark:border-gray-600 dark:bg-[#1f1f23]"
                >
                    {options.map(option => {
                        const isActive = option.value === value;
                        return (
                            <button
                                key={option.value}
                                type="button"
                                role="option"
                                aria-selected={isActive}
                                className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                                    isActive
                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
                                        : 'text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-white/10'
                                }`}
                                onClick={() => {
                                    onChange(option.value);
                                    setOpen(false);
                                }}
                            >
                                <span className="truncate">{option.label}</span>
                                {isActive && (
                                    <span className="shrink-0 text-xs" aria-hidden>✓</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
