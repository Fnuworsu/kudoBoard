import { useEffect, useState } from "react"
import { CardItem } from "./CardItem"
import { CardModal } from "./CardModal"
import "./CardGrid.css"

export const CardGrid = ({ boardId }) => {
    const [cards, setCards] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)

    const fetchCards = async () => {
        try {
            setLoading(true)
            const response = await fetch("http://localhost:3000/api/board/view", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: boardId && !isNaN(boardId) ? Number(boardId) : boardId })
            })

            if (response.ok) {
                const data = await response.json()
                setCards(data)
            } else {
                throw new Error("Failed to fetch cards")
            }
        } catch (error) {
            throw new Error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteCard = async (cardId) => {
        try {
            const response = await fetch("http://localhost:3000/api/board/card/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: cardId })
            })

            if (response.ok) {
                setCards(cards.filter(card => card.id !== cardId))
            } else {
                throw new Error("Failed to delete card")
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    const handleCardCreated = () => {
        fetchCards()
        setShowModal(false)
    }

    useEffect(() => {
        if (boardId) {
            fetchCards()
        }
    }, [boardId])

    return (
        <div className="card-grid-container">
            <div className="card-grid-header">
                <h2>Board Cards</h2>
                <button
                    className="create-card-button"
                    onClick={() => setShowModal(true)}
                >
                    Create Card
                </button>
            </div>

            {loading ? (
                <div className="loading">Loading cards...</div>
            ) : (
                <div className="card-grid">
                    {cards.length > 0 ? (
                        cards.map(card => (
                            <CardItem
                                key={card.id}
                                id={card.id}
                                title={card.title}
                                description={card.description}
                                gifUrl={card.gifUrl}
                                upvote={card.upvote}
                                onDelete={handleDeleteCard}
                            />
                        ))
                    ) : (
                        <div className="no-cards-message">
                            No cards found for this board. Create a new card to get started!
                        </div>
                    )}
                </div>
            )}

            {showModal && (
                <CardModal
                    boardId={boardId}
                    onClose={() => setShowModal(false)}
                    onSave={handleCardCreated}
                />
            )}
        </div>
    )
}
