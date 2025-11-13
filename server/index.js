import express from "express"
import cors from "cors"
import { connectWithDb } from "./db/db.js"
import { config } from "dotenv"
config()

const app = express()


app.use(cors({
    origin: ['http://localhost:5173']
}))

app.get('/', (req,res) => {
    res.status(200).json({
        message : "API !!"
    })
})

await connectWithDb();

app.listen(3000,()=>{
    console.log("Listening on port 3000");
})