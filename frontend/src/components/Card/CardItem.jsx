import { useState, useEffect } from "react"
import "./CardItem.css"

export const CardItem = (props) => {
    const [upvotes, setUpvotes] = useState(props.upvote || 0)
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState("")
    const [showComments, setShowComments] = useState(false)

    useEffect(() => {
        if (showComments) {
            fetchComments()
        }
    }, [showComments])

    const fetchComments = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/card/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ cardId: props.id })
            })

            if (response.ok) {
                const commentsData = await response.json()
                setComments(commentsData)
            } else {
                throw new Error("Failed to fetch comments")
            }
        } catch (error) {
            console.error("Error fetching comments:", error)
        }
    }

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
            console.error("Error upvoting card:", error)
        }
    }

    const handleAddComment = async (e) => {
        e.preventDefault()
        if (!newComment.trim()) return

        try {
            const response = await fetch("http://localhost:3000/api/card/comment/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content: newComment,
                    cardId: props.id
                })
            })

            if (response.ok) {
                const comment = await response.json()
                setComments([comment, ...comments])
                setNewComment("")
            } else {
                throw new Error("Failed to add comment")
            }
        } catch (error) {
            console.error("Error adding comment:", error)
        }
    }

    const handleDeleteComment = async (commentId) => {
        try {
            const response = await fetch("http://localhost:3000/api/card/comment/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: commentId })
            })

            if (response.ok) {
                setComments(comments.filter(comment => comment.id !== commentId))
            } else {
                throw new Error("Failed to delete comment")
            }
        } catch (error) {
            console.error("Error deleting comment:", error)
        }
    }

    const toggleComments = () => {
        setShowComments(!showComments)
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
                <button className="comment-toggle" onClick={toggleComments}>
                    {showComments ? "Hide Comments" : "Comments"}
                </button>
                <button className="delete-card" onClick={handleDelete}>Delete</button>
            </div>

            {showComments && (
                <div className="card-comments-section">
                    <form className="comment-form" onSubmit={handleAddComment}>
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="comment-input"
                        />
                        <button type="submit" className="comment-submit">Post</button>
                    </form>

                    <div className="comments-list">
                        {comments.length === 0 ? (
                            <p className="no-comments">No comments yet. Be the first to comment!</p>
                        ) : (
                            comments.map(comment => (
                                <div key={comment.id} className="comment-item">
                                    <p className="comment-content">{comment.content}</p>
                                    <div className="comment-meta">
                                        <span className="comment-date">
                                            {new Date(comment.createdAt).toLocaleString()}
                                        </span>
                                        <button
                                            className="delete-comment"
                                            onClick={() => handleDeleteComment(comment.id)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
