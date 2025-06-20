const express = require("express")
const { Router, json } = express
const { PrismaClient } = require("@prisma/client")

express().use(json())
const prisma = new PrismaClient()
const router = new Router()

router.post("/api/card/comment/create", async(req, res) =>
    {
    const { body: { content, cardId } } = req

    const comment = await prisma.comment.create({
        data: {
            content: content,
            card: {
                connect: {
                    id: cardId
                }
            }
        }
    })
    res.json(comment)

})

router.post("/api/card/comments", async(req, res) => {
    const { body: { cardId } } = req

    try {
        const comments = await prisma.comment.findMany({
            where: {
                cardId: cardId
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        res.json(comments)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})


router.delete("/api/card/comment/delete", async(req, res) => {
    const { body: { id } } = req

    try {
        const deletedComment = await prisma.comment.delete({
            where: {
                id: id
            }
        })
        res.json(deletedComment)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

module.exports = router
