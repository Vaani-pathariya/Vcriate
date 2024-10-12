const express = require("express")
const bodyParser=require("body-parser")
const cors = require("cors")
require("dotenv").config();
const http = require("http")
const app = express();
const server = http.createServer(app);
const userRouter=require("./routes/user")
const {connectMongoDb} = require("./connection")
const port = 8000;
app.use(cors());
connectMongoDb(process.env.MONGO_URI)
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit:"10mb"}));
// routers 
app.use("/user",userRouter);
app.get("/",async(req,res)=>{
    res.json({message:"Working"});
});
server.listen(port,()=>{
    console.log(`hello world app listening on port ${port}!`);
});