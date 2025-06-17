import { useEffect, useState } from "react"
import { BoardCard } from "./BoardCard.jsx"
import "./BoardList.css"

export const BoardList = () => {
    const [boards, setBoards] = useState([])
    const fetchBoards = async () => {
        const response = await fetch("http://localhost:3000/api/board/all", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.json()
        return data
    }

    useEffect(() => {
        const loadBoards = async () => {
            const boardsData = await fetchBoards()
            setBoards(boardsData)
        }
        loadBoards()
    }, [])

    return (
        <>
            <div className="board-list">
                {boards.map(board => (
                    <BoardCard key={board.id} image = {board.image} title={board.title} category={board.category}>

                    </BoardCard>
                ))}
            </div>
        </>
    )
}
