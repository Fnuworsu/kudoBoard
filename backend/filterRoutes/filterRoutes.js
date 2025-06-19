const express = require("express")
const { Router, json } = express
const { PrismaClient } = require("@prisma/client")

express().use(json())
const prisma = new PrismaClient()
const router = new Router()

// group by category
router.get("/api/board/group", async(req, res) => {
    const category = req.query.category
    const boards = await prisma.board.findMany({
        where: {
            category: category
        },
        include : {
            card : true
        }
    })
    res.json(boards)
})

// group recent
router.get("/api/board/recent", async(req, res) => {
    const boards = await prisma.board.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        take: 6,
        include : {
            card : true
        }
    })
    res.json(boards)
})

module.exports = router
