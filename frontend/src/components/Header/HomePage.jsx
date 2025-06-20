import React, { useState, useEffect } from 'react'
import './HomePage.css'
import { Modal } from '../Board/Modal'

export const HomePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')

    const handleCreateBoardClick = () => {
        setIsModalOpen(true)
    };

    const handleCloseModal = () => {
        setIsModalOpen(false)
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setSearchQuery('')

        window.dispatchEvent(new CustomEvent('categoryChanged', {
            detail: { category }
        }));
    };

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value)
    };

    const handleSearchSubmit = () => {
        window.dispatchEvent(new CustomEvent('searchQueryChanged', {
            detail: { searchQuery }
        }))
    }

    const handleClearSearch = () => {
        setSearchQuery('');
        window.dispatchEvent(new CustomEvent('searchQueryChanged', {
            detail: { searchQuery: '' }
        }))
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit()
        }
    }

    const handleSaveBoard = async (newBoardData) => {
        try {
            const response = await fetch(`https://kudoboard-5ioh.onrender.com/api/board/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newBoardData)
            });

            if (response.ok) {
                handleCloseModal();
                window.dispatchEvent(new CustomEvent('boardCreated'));
            } else {
                throw new Error(response.status)
            }
        } catch (error) {
            throw new Error(error)
        }
    };


    useEffect(() => {
        window.dispatchEvent(new CustomEvent('categoryChanged', {
            detail: { category: 'All' }
        }))
    }, [])

    return (
        <div className='HomePage'>
            <div className='container'>
                <div className='header'>
                    <h1 className='logo'> Kudos Board </h1>
                </div>
                <main>
                    <div className='actions'>
                        <div className='search'>
                            <input
                                type="text"
                                placeholder="Search by title"
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                                onKeyDown={handleKeyPress}
                            />
                            <button
                                className='search-button'
                                onClick={handleSearchSubmit}
                            >
                                Search
                            </button>
                            <button
                                className='clear-search-button'
                                onClick={handleClearSearch}
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    <div className='category-btns-container'>
                        <button
                            className={`category-button ${selectedCategory === 'All' ? 'active' : ''}`}
                            onClick={() => handleCategoryClick('All')}
                        >
                            All
                        </button>
                        <button
                            className={`category-button ${selectedCategory === 'Recent' ? 'active' : ''}`}
                            onClick={() => handleCategoryClick('Recent')}
                        >
                            Recent
                        </button>
                        <button
                            className={`category-button ${selectedCategory === 'Celebration' ? 'active' : ''}`}
                            onClick={() => handleCategoryClick('Celebration')}
                        >
                            Celebration
                        </button>
                        <button
                            className={`category-button ${selectedCategory === 'Thank You' ? 'active' : ''}`}
                            onClick={() => handleCategoryClick('Thank You')}
                        >
                            Thank You
                        </button>
                        <button
                            className={`category-button ${selectedCategory === 'Inspiration' ? 'active' : ''}`}
                            onClick={() => handleCategoryClick('Inspiration')}
                        >
                            Inspiration
                        </button>
                    </div>
                    <div className='create-board-section'>
                        <button className='create-board-button' onClick={handleCreateBoardClick}>
                            Create Board
                        </button>
                    </div>
                </main>

                {isModalOpen && (
                    <Modal
                    onClose={handleCloseModal}
                    onSave={handleSaveBoard}
                    />
                )}
            </div>
        </div>
    );
};
