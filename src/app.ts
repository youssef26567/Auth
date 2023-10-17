import express from "express"
import bodyParser from 'body-parser'
import morgan from "morgan"
import routes from "./routes/user"
import cookieSession from 'cookie-session';
import passport from 'passport'
const app=express()
 app.use(bodyParser())
 app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // one day in miliseconds
    name: 'session',
    keys: ['key1', 'key2']
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(morgan("dev"))
const port=3000
app.get("/",(req,res)=>{
    res.json({
        message:"hello world!"
    })
    console.log("get responde")
})
app.use('/',routes)
app.listen(port,()=>{
    console.log('server is running')
})
