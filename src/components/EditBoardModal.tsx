import { useState } from "react";
import { useBoard } from "../contexts/BoardContext";
import type { Board } from "../types";
import iconCross from '../assets/icon-cross.svg';

export default function EditBoardModal({ board, onClose }: { board: Board, onClose: () => void }) {
    const { setSelectedBoard, updateBoard } = useBoard();
    const [name, setName] = useState(board.name);
    const [error, setError] = useState("");
    const origCols = board.columns ?? [];
    const [columns, setColumns] = useState(origCols.map(col => col.name));

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim()) {
            setError("Board name is required.");
            return;
        }

        const validColumns = columns.filter(col => col.trim() !== "");
        if (validColumns.length === 0) {
            setError("Board must have at least one column.");
            return;
        }

        const updatedBoard = {
            ...board,
            name: name.trim(),
            columns: validColumns.map((col, i) => ({
                ...origCols[i],
                name: col.trim(),
                tasks: origCols[i]?.tasks || []
            })),
            originalName: board.name
        };
        updateBoard(updatedBoard);
        setSelectedBoard(updatedBoard);
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-dark-surface rounded-md p-6 min-w-[320px] max-w-[90vw] transition-colors" onClick={e => e.stopPropagation()}>
                <h2 className="font-bold text-lg mb-4">Edit Board</h2>
                <form onSubmit={handleSubmit}>
                    <label className="block font-bold text-xs text-medium-grey mb-2">Board Name</label>
                    <input
                        className="font-medium text-[13px] leading-[23px] py-2 px-4 border border-[#828FA3] border-opacity-25 rounded-sm p-2 w-full dark:bg-dark-header dark:text-dark-text transition-colors"
                        placeholder="e.g. Web Design"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />

                    {(error === "Board name is required." || error === "Board name must be unique.") && (
                        <p className="text-red-500 text-xs mb-2">{error}</p>
                    )}

                    <label className="block font-bold text-xs text-medium-grey mt-6 mb-2">Board Columns</label>
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
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setColumns(columns.filter((_, i) => i !== idx))}
                                aria-label="Remove column"
                            >
                                <img src={iconCross} alt="icon cross" />
                            </button>
                        </div>
                    ))}

                    {error === "Board must have at least one column." && (
                        <p className="text-red-500 text-xs mb-2">{error}</p>
                    )}

                    <button
                        type="button"
                        className="w-full bg-main-purple/10 font-bold text-center text-main-purple text-[13px] leading-[23px] rounded-[20px] py-2 mb-6 transition-colors hover:bg-main-purple/25 active:bg-main-purple/55 dark:bg-white  dark:hover:bg-gray-400 dark:active:bg-gray-400/80"
                        onClick={() => setColumns([...columns, ""])}
                    >
                        + Add New Column
                    </button>

                    <div className="flex gap-2 justify-end">
                        <button
                            type="submit"
                            className="w-full bg-main-purple font-bold  text-center text-white text-[13px] leading-[23px] rounded-[20px] hover:bg-main-purple-hover active:bg-main-purple-hover/75 py-2 mb-6"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}