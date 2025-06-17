const { validateSearchQuery } = require("../validation/validation.js")
const express = require("express")
const { Router, json } = express
const { PrismaClient } = require("@prisma/client")

express().use(json())
const prisma = new PrismaClient()
const router = new Router()

// search for a board(s)
router.post("/api/board/search", validateSearchQuery, async (req, res) => {
    const { body : { query } } = req
    const searchedBoards = await prisma.board.findMany({
        where : {
            title : {
                contains : query,
                mode : "insensitive"
            }
        },
        include : {
            card : true
        }
    })
    res.json(searchedBoards)
})

// clear search functionality(same as end point /api/board/all)
module.exports = router
