import { useBoard } from '../contexts/BoardContext';
import Column from './Column';

export default function BoardView() {
    const { selectedBoard } = useBoard()

    return (
        <>
            <div className='board-container h-full flex overflow-x-auto gap-6  px-4 py-6'>
                {selectedBoard.columns.map((column) => (
                    <Column key={column.name} column={column} />
                ))}
            </div>

        </>

    )
}
