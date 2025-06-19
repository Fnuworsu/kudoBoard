import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { CardGrid } from "../Card/CardGrid"
import "./BoardPage.css"

export const BoardPage = () => {
    const { boardId } = useParams()
    const navigate = useNavigate()
    const [board, setBoard] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchBoardDetails = async () => {
            try {
                setLoading(true)
                const response = await fetch(`http://localhost:3000/api/board/all`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })

                if (response.ok) {
                    const boards = await response.json()
                    const numericBoardId = boardId && !isNaN(boardId) ? Number(boardId) : boardId
                    const currentBoard = boards.find(b => b.id === numericBoardId)

                    if (currentBoard) {
                        setBoard(currentBoard)
                    } else {
                        setError("Board not found")
                    }
                } else {
                    setError("Failed to fetch board details")
                }
            } catch (error) {
                setError("An error occurred while fetching board details")
            } finally {
                setLoading(false)
            }
        }

        if (boardId) {
            fetchBoardDetails()
        }
    }, [boardId])

    const handleBackClick = () => {
        navigate("/")
    }

    if (loading) {
        return <div className="board-page-loading">Loading board details...</div>
    }

    if (error || !board) {
        return (
            <div className="board-page-error">
                <h2>{error || "Board not found"}</h2>
                <button onClick={handleBackClick} className="back-button">
                    Back to Boards
                </button>
            </div>
        )
    }

    return (
        <div className="board-page">
            <div className="board-page-header">
                <div className="board-page-info">
                    <h1>{board.title}</h1>
                    {board.category && <span className="board-category">{board.category}</span>}
                    {board.author && <p className="board-author">Created by: {board.author}</p>}
                </div>
            </div>

            <CardGrid boardId={boardId} />
        </div>
    )
}
