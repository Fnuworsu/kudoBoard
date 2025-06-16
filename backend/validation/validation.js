// validate create board
const validateCreateBoard = (req, res, next) => {
    const { body : { title, category, author } } = req
    if (title && category) {
        next()
    }
    else {
        res.status(400).json({
            msg : "title and category are required"
        })
    }
}

const validateBoarOrCardId = (req, res, next) => {
    const { body : { id} } = req
    if (id) next()
    else return res.status(400).json({msg: "id is required"})
}

const validateCreateCard = (req, res, next) => {
    const { body : { title, description, author, boardId } } = req
    if (!title || !description || !author || !boardId) {
        res.status(400).json({
            msg : "title, description, author, boardId are required"
        })
    } else {
        next()
    }
}

module.exports = {
    validateCreateBoard,
    validateBoarOrCardId,
    validateCreateCard
}
