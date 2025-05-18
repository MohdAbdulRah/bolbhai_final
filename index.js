const express = require("express")
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const session = require("express-session")
const dotenv = require("dotenv")
dotenv.config()
const path = require("path")
const userRouter = require("./Routes/userRouter.js")
const issueRouter = require("./Routes/issueRouter.js")
const commentRouter = require("./Routes/commentRouter.js")
const adminRouter = require("./Routes/adminRouter.js")
const flash = require('connect-flash')
const passport = require("passport")
const methodOverride = require('method-override')
const LocalStratergy = require("passport-local")
const User = require("./Models/userModel.js")
let ExpressError = require("./utils/ExpressError.js")

 
let dburl = process.env.MONGOURI

mongoose.connect(dburl)
.then(()=>{
    console.log("MongoDB Connected")
})
.catch((err) => {
    console.log("Some Error in COnnection")
})

let port = 3000


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sessionOptions = {
    secret: process.env.SECRET_KEY || 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true
    }
}

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,"public")))

app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStratergy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.successMsg = req.flash("success")
    res.locals.errorMsg = req.flash("error")
    res.locals.currUser = req.user
    next()
})
app.use("/user",userRouter)
app.use("/issue",issueRouter)
app.use("/comment",commentRouter)
app.use("/admin",adminRouter)


app.get("/",(req,res)=>{
    res.redirect("/issue/all")
})

app.listen(port,()=>{
    console.log(`App is listening on ${port}`)
})

// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page not found"))
// })

app.use((err, req, res, next) => {
    const status = err.status || 500;
  
    let message = "Something went wrong";
  
    // Handle Joi-style error
    if (err.details && Array.isArray(err.details)) {
      message = err.details.map(d => d.message).join(", ");
    } else if (typeof err.message === "string") {
      message = err.message;
    }
  
    console.error(err);
    res.status(status).render("error.ejs", { message, activePage: "" });
  });

