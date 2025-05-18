const data = require("./data.js")
const mongoose = require("mongoose")
const Issue = require("../Models/issueModel.js")
let dburl = process.env.MONGOURI

mongoose.connect(dburl)
.then(()=>{
    console.log("MongoDB Connected")
})
.catch((err) => {
    console.log("Some Error in COnnection")
})

async function insertData(){
    const result = await Issue.insertMany(data)
    console.log("Successfuully intialized the database")
}

insertData()
