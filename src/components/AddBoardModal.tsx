import { useState, useEffect } from "react"
import { useBoard } from "../contexts/BoardContext"
import iconCross from '../assets/icon-cross.svg'

export default function AddBoardModal({ onClose }: { onClose: () => void }) {
    const { boards, addBoard } = useBoard()
    const [name, setName] = useState("")
    const [nameError, setNameError] = useState("")
    const [columnsError, setColumnsError] = useState("")
    const [columns, setColumns] = useState<string[]>([""])

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        // clear previous errors
        // clear previous errors
        setNameError("")
        setColumnsError("")

        if (!name.trim()) {
            setNameError("Board name is required.")
            return
        }
        if (boards.some(b => b.name === name.trim())) {
            setNameError("Board name must be unique.")
            return
        }

        const validColumns = columns.filter(col => col.trim() !== "");
        if (validColumns.length === 0) {
            setColumnsError("Board must have at least one column.");
            return;
        }

        const newBoard = {
            name: name.trim(),
            columns: validColumns.map(col => ({ name: col.trim(), tasks: [] }))
        }
        try {
            addBoard(newBoard)
        } catch (err) {
            setColumnsError('Failed to create board. See console for details.')
            return
        }
        onClose()

    }


    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [onClose])

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50" onClick={onClose}>
            <div role="dialog" aria-modal="true" aria-labelledby="add-board-title" className="bg-white dark:bg-dark-surface rounded-md p-6 min-w-[320px] max-w-[90vw] transition-colors" onClick={e => e.stopPropagation()}>
                <h2 id="add-board-title" className="font-bold text-lg mb-4">Add New Board</h2>
                <form onSubmit={handleSubmit}>
                    <label
                        htmlFor="board-name"
                        className="block font-bold text-xs text-medium-grey mb-2"
                    >
                        Board Name
                    </label>
                    <input
                        className="font-medium text-[13px] leading-[23px] py-2 px-4 border border-[#828FA3] border-opacity-25 rounded-sm p-2 w-full dark:bg-dark-header dark:text-dark-text transition-colors"
                        placeholder="e.g. Web Design"
                        value={name}
                        onChange={e => {
                            setName(e.target.value)
                            if (nameError) setNameError("")
                        }}

                    />

                    {nameError && (
                        <p className="text-red-500 text-xs mt-3 mb-2">{nameError}</p>
                    )}

                    <label
                        htmlFor="board-columns"
                        className="block font-bold text-xs text-medium-grey mt-6 mb-2"
                    >
                        Board Columns
                    </label>
                    {columns.map((col, idx) => (
                        <div key={idx} className="flex items-center gap-3 mb-3">
                            <input
                                className="font-medium text-[13px] leading-[23px] py-2 px-4 border border-[#828FA3] border-opacity-25 rounded-sm p-2 w-full active:border-main-purple dark:bg-dark-header dark:text-dark-text transition-colors"
                                placeholder="e.g. Todo"
                                value={col}
                                onChange={e => {
                                    const newCols = [...columns];
                                    newCols[idx] = e.target.value;
                                    setColumns(newCols);
                                    // clear column error when user types
                                    if (columnsError) setColumnsError("")
                                }}
                            />
                            <button
                                type="button"
                                className=""
                                onClick={() => setColumns(columns.filter((_, i) => i !== idx))}
                                aria-label="Remove column"
                            >
                                <img src={iconCross} alt="" aria-hidden="true" />
                            </button>
                        </div>
                    ))}

                    {columnsError && (
                        <p className="text-red-500 text-xs mb-4">{columnsError}</p>
                    )}


                    <button
                        type="button"
                        className="w-full bg-main-purple/10 dark:bg-white font-bold text-center text-main-purple text-[13px] leading-[23px] rounded-[20px] hover:bg-main-purple/25 py-2 mb-6 transition-colors"
                        onClick={() => setColumns([...columns, ""])}
                    >
                        + Add New Column
                    </button>


                    <div className="flex gap-2 justify-end">
                        <button
                            type="submit"
                            className="w-full bg-main-purple font-bold  text-center text-white text-[13px] leading-[23px] rounded-[20px] hover:bg-main-purple-hover py-2 mb-6"
                        >
                            Create New Board
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}