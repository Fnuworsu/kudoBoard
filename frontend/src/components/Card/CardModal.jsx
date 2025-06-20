import { useState, useEffect } from "react"
import "./CardModal.css"

export const CardModal = ({ boardId, onClose, onSave }) => {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [author, setAuthor] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [gifs, setGifs] = useState([])
    const [selectedGif, setSelectedGif] = useState(null)
    const [isSearching, setIsSearching] = useState(false)

    const GIPHY_API_KEY = import.meta.env.VITE_GIF_API_KEY

    const searchGifs = async () => {
        if (!searchTerm.trim()) return

        setIsSearching(true)
        try {
            const response = await fetch(
                `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(
                    searchTerm
                )}&limit=6&rating=g`
            )

            if (response.ok) {
                const data = await response.json()
                setGifs(data.data)
            } else {
                throw new Error("Failed to fetch GIFs")
            }
        } catch (error) {
            throw new Error(error)
        } finally {
            setIsSearching(false)
        }
    }

    const handleGifSelect = (gif) => {
        setSelectedGif(gif)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const newCardData = {
            title,
            description,
            gifUrl: selectedGif.images.fixed_height.url,
            boardId: boardId && !isNaN(boardId) ? Number(boardId) : boardId
        }

        try {
            const response = await fetch("http://localhost:3000/api/board/card/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newCardData)
            })

            if (response.ok) {
                onSave()
            } else {
                throw new Error("Failed to create card")
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    useEffect(() => {
        const fetchTrendingGifs = async () => {
            setIsSearching(true)
            try {
                const response = await fetch(
                    `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=6&rating=g`
                )

                if (response.ok) {
                    const data = await response.json()
                    setGifs(data.data)
                }
            } catch (error) {
                throw new Error(error)
            } finally {
                setIsSearching(false)
            }
        }

        fetchTrendingGifs()
    }, [])

    return (
        <div className="modal-overlay">
            <div className="card-modal-content">
                <h2>Create New Card</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Message:</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="Enter your message"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description :</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add more details"
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="author">Author (Optional):</label>
                        <input
                            type="text"
                            id="author"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="Your name"
                        />
                    </div>

                    <div className="gif-selection-section">
                        <h3>Select a GIF</h3>
                        <div className="gif-search">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search for GIFs"
                            />
                            <button
                                type="button"
                                onClick={searchGifs}
                                disabled={isSearching}
                                className="search-button"
                            >
                                {isSearching ? "Searching..." : "Search"}
                            </button>
                        </div>

                        <div className="gif-grid">
                            {isSearching ? (
                                <div className="loading-gifs">Loading GIFs...</div>
                            ) : (
                                gifs.map((gif) => (
                                    <div
                                        key={gif.id}
                                        className={`gif-item ${selectedGif?.id === gif.id ? "selected" : ""}`}
                                        onClick={() => handleGifSelect(gif)}
                                    >
                                        <img
                                            src={gif.images.fixed_height.url}
                                            alt={gif.title}
                                            loading="lazy"
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="submit" className="save-button" disabled={!selectedGif}>
                            Create Card
                        </button>
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
