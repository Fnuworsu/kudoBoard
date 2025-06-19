import React, { useState } from 'react'
import './Modal.css'

export const Modal = ({ onClose, onSave }) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [author, setAuthor] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()

        const newBoardData = {
            title,
            description,
            category,
            author,
        };

        onSave(newBoardData)
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Create New Kudos Board</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title:</label>
                        <input type="text" id="title" value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description (Optional):</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter board description"
                            rows="3"
                            fontFamily="inherit"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Category:</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">Select a Category</option>
                            <option value="Celebration">Celebration</option>
                            <option value="Thank You">Thank You</option>
                            <option value="Inspiration">Inspiration</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="author">Author (Optional):</label>
                        <input
                            type="text"
                            id="author"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="save-button">Create Board</button>
                        <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
