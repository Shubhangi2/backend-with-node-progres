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



app.get("/setup",async (req, res)=>{
    try{
        await pool.query('CREATE TABLE notes(id SERIAL PRIMARY KEY, title VARCHAR(200), content VARCHAR(1000), createdAt VARCHAR(30), updatedAt VARCHAR(30))')
        res.status(200).send({ message: "Successfully created table" })
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})

app.post("/delete",async (req, res)=>{
    var {id} = req.body
    if(!id){
        return res.status(400).send({message: "missing required field id"})
    }
    try{
        await pool.query(`DELETE FROM notes WHERE id = ${id}`)
        res.status(200).send({ message: "note deleted successfully" })
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})

app.post("/update",async (req, res)=>{
    var {id, title, content} = req.body

    if(!id || !title || !content){
        return res.status(400).send({message: "missing required fields"})
    }

    try{
        var updatedAt = new Date()
        var query = "UPDATE notes SET title=$1, content=$2, updatedAt=$4 WHERE id=$3"
        var values = [title, content, id, updatedAt]
        
        await pool.query(query, values)
        // await pool.query(`UPDATE notes SET title=${title}, content=${content} WHERE id = ${id}`)
        res.status(200).send({ message: "note updated successfully" })
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})

app.post('/insert', async (req, res) => {
    const { title, content } = req.body
    if(!title || !content){
        return res.status(400).send({message: "missing required fields"})
    }
    try {
        var createddAt = new Date()
        await pool.query('INSERT INTO notes (title, content, createdAt, updatedAt) VALUES ($1, $2, $3, $4)', [title, content,createddAt,createddAt])
        res.status(200).send({ message: "Successfully added note" })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

app.listen(port, ()=>{
    console.log(   `server running on port : ${port}`)
})