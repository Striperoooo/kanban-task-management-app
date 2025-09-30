import { useBoard } from '../contexts/BoardContext';

export default function BoardView() {
    const { boards, selectedBoard } = useBoard()

    return <main>{selectedBoard.columns[0].name}</main>
}