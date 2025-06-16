const { validateCreateBoard, validateBoarOrCardId } = require("../validation/validation.js")
const express = require("express")
const { Router, json } = express
const { PrismaClient } = require("@prisma/client")

express().use(json())
const prisma = new PrismaClient()
const router = new Router()

// create a new board
router.post("/api/board/create", validateCreateBoard, async(req, res) => {
    const { body: { title, category, author} } = req

    const board = await prisma.board.create({
        data : {
            title : title,
            category : category,
            author : author ? author : "",
            image: "https://picsum.photos/300/400",
            // card: []
        }
    })
    res.json(board)
})

// delete a board
router.delete("/api/board/delete", validateBoarOrCardId, async(req, res) => {
    const { body : { id } } = req
    const deletedBoard = await prisma.board.delete({
        where : {
            id : id
        }
    })
    res.json(deletedBoard)
})

// view a board(all cards in the board)
router.get("/api/board/view", validateBoarOrCardId, async(req, res) => {
    const { body : { id } } = req
    const board = await prisma.board.findFirst({
        where : {
            id : id
        }
    })
    res.json(board.card)
})

module.exports = router
