import "./BoardCard.css"

export const BoardCard = (props) => {
    const handleDelete = () => {
        if (props.onDelete) {
            props.onDelete(props.id)
        }
    };

    return (<>
        <div className="board">
            <img src={props.image} className="board-image"/>
            <div className="board-content">
                <h3 className="board-name">{props.title}</h3>
                <h3 className="board-category">{props.category}</h3>
            </div>
            <div className="board-actions">
                <ul>
                    <li><button className="view-board">View Board</button></li>
                    <li><button className="delete-board" onClick={handleDelete}>Delete Board</button></li>
                </ul>
            </div>
        </div>
    </>)
}
