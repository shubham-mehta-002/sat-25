import express from "express"
import cors from "cors"
import { connectWithDb } from "./db/db.js"
import { config } from "dotenv"
import authRouter from "./routes/auth.route.js";
import postRouter from "./routes/createPost.route.js"
import userRouter from "./routes/user.js";
import witPostRouter from "./routes/witpost.js";

config()

const app = express()


app.use(cors({
    origin: ['http://localhost:5173']
}))

app.use('/auth' , authRouter);
app.use('/post' , postRouter);
app.use('/user' , userRouter);
app.use('/witPost' , witPostRouter);

app.get('/', (req,res) => {
    res.status(200).json({
        message : "API !!"
    })
})

await connectWithDb();

app.listen(3000,()=>{
    console.log("Listening on port 3000");
})