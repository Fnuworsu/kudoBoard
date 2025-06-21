import React, { useState, useEffect, useContext } from 'react'
import './HomePage.css'
import { Modal } from '../Board/Modal'
import { ThemeContext } from '../../context/ThemeContext'

export const HomePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')
    const { isDarkMode, toggleTheme } = useContext(ThemeContext)

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
                    <button
                        className='theme-toggle'
                        onClick={toggleTheme}
                        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {isDarkMode ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                            </svg>
                        )}
                    </button>
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
