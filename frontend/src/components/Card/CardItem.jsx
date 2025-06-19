import { useState } from "react"
import "./CardItem.css"

export const CardItem = (props) => {
    const [upvotes, setUpvotes] = useState(props.upvote || 0)

    const handleDelete = async () => {
        if (props.onDelete) {
            props.onDelete(props.id)
        }
    }

    const handleUpvote = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/board/card/upvote", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: props.id })
            })

            if (response.ok) {
                const updatedCard = await response.json()
                setUpvotes(updatedCard.upvote)
            } else {
                throw new Error("Failed to upvote card")
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    return (
        <div className="card-item">
            <div className="card-content">
                <h3 className="card-title">{props.title}</h3>
                <div className="card-gif-container">
                    <img src={props.gifUrl} alt="Card GIF" className="card-gif" />
                </div>
                <p className="card-description">{props.description}</p>
            </div>
            <div className="card-actions">
                <button className="upvote-button" onClick={handleUpvote}>
                    <span className="upvote-icon">👍</span>
                    <span className="upvote-count">{upvotes}</span>
                </button>
                <button className="delete-card" onClick={handleDelete}>Delete</button>
            </div>
        </div>
    )
}
