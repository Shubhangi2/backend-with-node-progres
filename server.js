const express = require("express")
const pool = require("./db")
const port = 8000
const app = express()

app.use(express.json())

app.get("/", (req, res)=>{
    res.send("hello buddy! welcome to backend server")
})

app.get("/notes",async (req, res)=>{
    try {
        const data = await pool.query('SELECT * FROM notes')
        res.status(200).send(data.rows)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})



app.post("/setup",async (req, res)=>{
    try{
        await pool.query('CREATE TABLE notes(id SERIAL PRIMARY KEY, title VARCHAR(200), content VARCHAR(1000))')
        res.status(200).send({ message: "Successfully created table" })
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})

app.post('/insert', async (req, res) => {
    const { title, content } = req.body
    try {
        await pool.query('INSERT INTO notes (title, content) VALUES ($1, $2)', [title, content])
        res.status(200).send({ message: "Successfully added note" })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

app.listen(port, ()=>{
    console.log(   `server running on port : ${port}`)
})