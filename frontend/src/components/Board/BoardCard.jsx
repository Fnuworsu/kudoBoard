import "./BoardCard.css"

export const BoardCard = (props) => {
    return (<>
        <div className="board">
            <image src={props.image} className="board-image"/>
            <span className="board-name">{props.title}</span>
            <span className="board-category">{props.title}</span>
            <div className="board-actions">
                <ul>
                    <li><button className="view-board">View Board</button></li>
                    <li><button className="delete-board">Delete Board</button></li>
                </ul>
            </div>
        </div>
    </>)
}
