import { useEffect } from 'react'
import type { ConfirmModalProps } from "../types"


export default function ConfirmModal({
    title,
    message,
    onConfirm,
    onCancel,
    danger = false
}: ConfirmModalProps) {

    // Escape to cancel
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') onCancel()
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [onCancel])

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50" onClick={onCancel}>
            <div role="dialog" aria-modal="true" aria-labelledby="confirm-title" className="bg-white dark:bg-dark-surface rounded-md p-6 min-w-[320px] max-w-[480px] transition-colors" onClick={e => e.stopPropagation()}>
                <h2 className={
                    `font-bold text-lg mb-5 ${danger
                        ? "text-[#EA5555]"
                        : ""}`}
                >
                    <span id="confirm-title">{title}</span>
                </h2>
                <p className="font-medium text-medium-grey text-[13px] leading-[23px] mb-6">{message}</p>
                <div className="flex flex-col gap-4 justify-end md:flex-row md:justify-center">
                    <button
                        className={`md:grow font-bold text-[13px] leading-[23px] rounded-[20px] px-4 py-2 transition-colors duration-150 ease-in-out
                            ${danger
                                ? "bg-[#EA5555] text-white hover:bg-red-hover active:bg-red-hover/80"
                                : "bg-main-purple text-white hover:bg-main-purple/90"
                            }`}
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                    <button
                        className="md:grow  font-bold text-main-purple text-[13px] leading-[23px] bg-main-purple/10 rounded-[20px] px-4 py-2 transition-colors duration-150 ease-in-out hover:bg-main-purple/25
                        dark:bg-white
                        dark:hover:bg-gray-400 dark:active:bg-gray-400/80"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}