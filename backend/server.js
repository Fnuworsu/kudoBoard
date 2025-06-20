const express = require('express')
const { json, urlencoded } = express
const cors = require('cors')
const dotenv = require('dotenv')
const boardRoutes = require("./boardRoutes/boardRoutes.js")
const cardRoutes = require("./cardRoutes/cardRoutes.js")
const filterRoutes = require("./filterRoutes/filterRoutes.js")
const commentRoutes = require("./commentRoutes/commentRoutes.js")


dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(json())
app.use(urlencoded({extended: true}))
app.use(cors())

app.get("/api/", (req, res) => {
    res.json({
        message: "Welcome to Kudos board API 😁"
    })
})

app.use(boardRoutes)
app.use(cardRoutes)
app.use(filterRoutes)
app.use(commentRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
