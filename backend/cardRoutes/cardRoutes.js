const { validateCreateCard, validateBoarOrCardId } = require("../validation/validation.js")
const express = require("express")
const { Router, json } = express
const { PrismaClient } = require("@prisma/client")

express().use(json())
const prisma = new PrismaClient()
const router = new Router()

// const gifApiKey = process.env.GIF_API_KEY
// const url = `https://api.giphy.com/v1/gifs/random?api_key=${gifApiKey}`

// const gif = async () => {
//     const response = await fetch(url)
//     const data = await response.json()
//     return data.data.images.original.url
// }

// create a card
router.post("/api/board/card/create", validateCreateCard, async(req, res) => {
    const { body : { title, description, gifUrl, boardId } } = req
    const card = await prisma.card.create({
        data: {
            title : title,
            description : description,
            gifUrl : gifUrl,
            board : {
                connect : {
                    id : boardId
                }
            }
        }
    })
    res.json(card)
})

// upvote a card
router.patch("/api/board/card/upvote", validateBoarOrCardId, async(req, res) => {
    const { body : { id } } = req
    const card = await prisma.card.findFirst({
        where : {
            id : id
        }
    })

    const upvotes = card.upvote + 1
    const updatedCard = await prisma.card.update({
        where : {
            id : id
        },
        data : {
            upvote : upvotes
        }
    })
    res.json(updatedCard)
})

// delete a card
router.delete("/api/board/card/delete", validateBoarOrCardId, async(req, res) => {
    const { body : { id } } = req
    const deletedCard = await prisma.card.delete({
        where : {
            id : id
        }
    })
    res.json(deletedCard)
})

module.exports = router
