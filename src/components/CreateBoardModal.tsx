import { useState } from "react"
import { useBoard } from "../contexts/BoardContext"

export default function CreateBoardModal({ onClose }: { onClose: () => void }) {
    const { boards, setSelectedBoard } = useBoard()
    const [name, setName] = useState("")
    const [error, setError] = useState("")

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!name.trim()) {
            setError("Board name is required.")
            return
        }
        if (boards.some(b => b.name === name.trim())) {
            setError("Board name must be unique.")
            return
        }

        const newBoard = { name: name.trim(), columns: [] }
        boards.push(newBoard)
        setSelectedBoard(newBoard)
        onClose()

    }


    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg p-6 min-w-[320px] max-w-[90vw]" onClick={e => e.stopPropagation()}>
                <h2 className="font-bold text-lg mb-4">Create New Board</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        className="border p-2 w-full mb-2"
                        placeholder="Board name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
                    <div className="flex gap-2 justify-end">
                        <button type="button" onClick={onClose} className="px-4 py-2">Cancel</button>
                        <button type="submit" className="bg-main-purple text-white px-4 py-2 rounded">Create</button>
                    </div>
                </form>
            </div>
        </div>
    )
}


// import { useState } from "react";
// import { useBoard } from "../contexts/BoardContext";

// export default function CreateBoardModal({ onClose }: { onClose: () => void }) {
//     const { boards, setSelectedBoard } = useBoard();
//     const [name, setName] = useState("");
//     const [error, setError] = useState("");

//     function handleSubmit(e: React.FormEvent) {
//         e.preventDefault();
//         if (!name.trim()) {
//             setError("Board name is required.");
//             return;
//         }
//         if (boards.some(b => b.name === name.trim())) {
//             setError("Board name must be unique.");
//             return;
//         }
//         // Add new board (you may need to update your context/provider to support this)
//         const newBoard = { name: name.trim(), columns: [] };
//         boards.push(newBoard); // (or use a context method to update state)
//         setSelectedBoard(newBoard);
//         onClose();
//     }

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50" onClick={onClose}>
//             <div className="bg-white rounded-lg p-6 min-w-[320px] max-w-[90vw]" onClick={e => e.stopPropagation()}>
//                 <h2 className="font-bold text-lg mb-4">Create New Board</h2>
//                 <form onSubmit={handleSubmit}>
//                     <input
//                         className="border p-2 w-full mb-2"
//                         placeholder="Board name"
//                         value={name}
//                         onChange={e => setName(e.target.value)}
//                     />
//                     {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
//                     <div className="flex gap-2 justify-end">
//                         <button type="button" onClick={onClose} className="px-4 py-2">Cancel</button>
//                         <button type="submit" className="bg-main-purple text-white px-4 py-2 rounded">Create</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }