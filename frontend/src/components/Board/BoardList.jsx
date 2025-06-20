import { useEffect, useState } from "react"
import { BoardCard } from "./BoardCard.jsx"
import "./BoardList.css"

export const BoardList = () => {
    const [allBoards, setAllBoards] = useState([])
    const [displayedBoards, setDisplayedBoards] = useState([])
    const [currentCategory, setCurrentCategory] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')

    const fetchAllBoards = async () => {
        const response = await fetch(`https://kudoboard-5ioh.onrender.com/api/board/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.json()
        return data
    }

    const fetchRecentBoards = async () => {
        const response = await fetch(`https://kudoboard-5ioh.onrender.com/api/board/recent`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.json()
        return data
    }

    const fetchBoardsByCategory = async (category) => {
        const response = await fetch(`https://kudoboard-5ioh.onrender.com/api/board/group?category=${encodeURIComponent(category)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.json()
        return data
    }

    // search filter for the boards
    const applyFilters = (boards, query) => {
        let filteredBoards = [...boards]


        if (query && query.trim() !== '') {
            const lowercaseQuery = query.toLowerCase().trim()
            filteredBoards = filteredBoards.filter(board =>
                board.title.toLowerCase().includes(lowercaseQuery)
            );
        }

        return filteredBoards
    };

    const loadBoardsByCategory = async (category) => {
        try {
            let boardsData;

            if (category === 'All') {
                boardsData = await fetchAllBoards()
            } else if (category === 'Recent') {
                boardsData = await fetchRecentBoards()
            } else {
                boardsData = await fetchBoardsByCategory(category)
            }

            setAllBoards(boardsData)

            // so search can work on the newly loaded boards
            const filteredBoards = applyFilters(boardsData, searchQuery)
            setDisplayedBoards(filteredBoards)
        } catch (error) {
            throw new Error(error)
        }
    }

    const deleteBoard = async (boardId) => {
        try {
            const response = await fetch(`https://kudoboard-5ioh.onrender.com/api/board/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: boardId })
            });

            if (response.ok) {

                const updatedAllBoards = allBoards.filter(board => board.id !== boardId)
                setAllBoards(updatedAllBoards);
                setDisplayedBoards(displayedBoards.filter(board => board.id !== boardId))
            } else {
                throw new Error(error)
            }
        } catch (error) {
            throw new Error(error)
        }
    };


    useEffect(() => {
        loadBoardsByCategory(currentCategory)

        const handleBoardCreated = () => {
            loadBoardsByCategory(currentCategory)
        };

        const handleCategoryChanged = (event) => {
            const newCategory = event.detail.category
            setCurrentCategory(newCategory)
            setSearchQuery('')
            loadBoardsByCategory(newCategory)
        };

        const handleSearchQueryChanged = (event) => {
            const newQuery = event.detail.searchQuery
            setSearchQuery(newQuery)


            const filteredBoards = applyFilters(allBoards, newQuery)
            setDisplayedBoards(filteredBoards)
        };

        window.addEventListener('boardCreated', handleBoardCreated)
        window.addEventListener('categoryChanged', handleCategoryChanged)
        window.addEventListener('searchQueryChanged', handleSearchQueryChanged)

        return () => {
            window.removeEventListener('boardCreated', handleBoardCreated)
            window.removeEventListener('categoryChanged', handleCategoryChanged)
            window.removeEventListener('searchQueryChanged', handleSearchQueryChanged)
        };
    }, [currentCategory, allBoards, searchQuery])

    return (
        <>
            <div className="content">
                <div className="board-list">
                    {displayedBoards.length > 0 ? (
                        displayedBoards.map(board => (
                            <BoardCard
                                key={board.id}
                                id={board.id}
                                image={board.image}
                                title={board.title}
                                category={board.category}
                                onDelete={deleteBoard}
                            />
                        ))
                    ) : (
                        <div className="no-boards-message">
                            {searchQuery ?
                                `No boards found matching "${searchQuery}"` :
                                "No boards found for this category."
                            }
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
