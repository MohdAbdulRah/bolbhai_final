const express = require("express")
const router = express.Router({mergeParams : true})

const User = require("../Models/userModel.js")
const Issue = require("../Models/issueModel.js")

const passport = require("passport")
const ExpressError = require("../utils/ExpressError.js")
const {isLoggedIn} = require("../middleware.js")

router.get("/pending",isLoggedIn,async (req,res) => {
    let results = await Issue.find({status : "pending"}).sort({ created_At: 1 }).populate("reporter").populate("comments")
    // console.log(results)
    res.render("admins/index.ejs",{
        results,
        activePage : "pending"
    })
})
router.get("/in_progress",isLoggedIn,async (req,res) => {
    let results = await Issue.find({status : "in_progress"}).sort({ created_At: 1 }).populate("reporter").populate("comments").populate("assignedTo")
    // console.log(results)
    res.render("admins/index.ejs",{
        results,
        activePage : "in_progress"
    })
})
router.get("/resolved",isLoggedIn,async (req,res) => {
    let results = await Issue.find({status : "resolved"}).sort({ created_At: 1 }).populate("reporter").populate("comments").populate("assignedTo")
    // console.log(results)
    res.render("admins/index.ejs",{
        results,
        activePage : "resolved"
    })
})
router.get("/profile",isLoggedIn, async (req,res)=>{
    let result = req.user
    let issues = await Issue.find({assignedTo : result.id}).populate("reporter").sort({ createdAt: -1 })
    res.render("admins/profile.ejs",{result,issues,
      activePage : "profile"
    })
  })

router.post("/takeup/:id", async (req,res) => {
    let {id} = req.params
     let result = await Issue.findById(id)
     result.assignedTo = req.user.id
     result.status = "in_progress"
     await result.save()
     res.redirect("/admin/in_progress")
})

router.post("/over/:id", async (req,res) => {
    let {id} = req.params
    let result = await Issue.findById(id)
    result.status = "resolved"
    result.resolved_At = new Date()
    await result.save()
    console.log("Redirecting to view after resolving:", id); // ✅ log
    res.redirect(`/user/view/${id}`)
})
module.exports = router