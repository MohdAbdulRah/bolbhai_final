const express = require("express")
const router = express.Router({mergeParams : true})
let wrapAsync = require("../utils/wrapAsync.js")
const Issue = require("../Models/issueModel.js")
const Comment = require("../Models/commentModel.js")
const issueSchema = require("../schema.js")
const ExpressError = require("../utils/ExpressError.js")
const {isLoggedIn,isOwner} = require("../middleware.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage})

router.post("/create",isLoggedIn,upload.single("image"),wrapAsync(async (req,res)=>{
    let {title,description,category,imageUrl,location, latlng} = req.body
    let lat, lng;
    if (latlng) {
        [lat, lng] = latlng.split(',').map(Number);
    }
    let url = req.file.path
    let filename = req.file.filename
    const { error } = issueSchema.validate(req.body);
    if (error) {
        const msg = error.details?.map(el => el.message).join(", ") || "Invalid data";
        throw new ExpressError(400, msg);
    }
      
    const newIssue = new Issue({
        title,description,category,imageUrl,location
    })
    newIssue.status = "pending"
    newIssue.reporter = req.user.id
    newIssue.image = {url,filename}

    const result = await newIssue.save()
    req.flash("success","A New Issue created")
    res.redirect("/issue/all")

    // res.send(req.file)
}))

router.get("/all",isLoggedIn, async (req,res)=> {
    const results = await Issue.find({}).populate("reporter").populate("upvotes").populate("comments").populate("assignedTo").sort({created_At : -1})
    res.render("issues/index.ejs",{
        results,
        activePage : "home"
    })
})

router.get("/new",isLoggedIn,async (req,res) => {
    console.log(req.user)
    


    res.render("issues/new.ejs",{
        activePage : "create"
    })
})

router.get("/edit/:id", isLoggedIn,async (req,res) => {
    let {id}  = req.params
    const result = await Issue.findById(id).populate("reporter")
    if(!result){
        req.flash("error","Your Issue cannot be found")
        res.redirect("/issue/all", {
            activePage : "home"
        })
    }

    let originalImageUrl = result.image.url
   originalImageUrl =  originalImageUrl.replace("/upload","/upload/w_250")
    res.render("issues/edit.ejs",{result,originalImageUrl,
          activePage : ""    
    }) 
})

router.patch("/update/:id",isLoggedIn,isOwner,upload.single("image"),async (req,res)=> {
    let {id} = req.params
   console.log(req.body)
    let result = await Issue.findByIdAndUpdate(id,{...req.body})
   
    if(typeof req.file !== "undefined"){
        let url = req.file.path
        let filename = req.file.filename
        result.image = {url,filename}
        await result.save()
    }
    req.flash("success","Issue updated")
    res.redirect("/issue/all")
})

router.delete("/:id", isLoggedIn, isOwner, async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the issue first to get its comments array
      const issue = await Issue.findById(id);
  
      if (!issue) {
        req.flash("error", "Issue not found");
        return res.redirect("/issue/all");
      }
  
      // Delete all comments linked to this issue
      await Comment.deleteMany({ _id: { $in: issue.comments } });
  
      // Then delete the issue itself
      await Issue.findByIdAndDelete(id);
  
      req.flash("success", "Issue and its comments deleted");
      res.redirect("/issue/all");
    } catch (err) {
      console.error(err);
      req.flash("error", "Failed to delete issue");
      res.redirect("/issue/all");
    }
  });
  
router.post("/:id/upvote", isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const issue = await Issue.findById(id);
  
    const userId = req.user._id;
  
    const alreadyUpvoted = issue.upvotes.includes(userId);
  
    if (alreadyUpvoted) {
      // Remove upvote
      issue.upvotes.pull(userId);
    } else {
      // Add upvote
      issue.upvotes.push(userId);
    }
  
    await issue.save();
  
    res.json({
      upvotes: issue.upvotes.length,
      upvoted: !alreadyUpvoted
    });
  }));
  
module.exports = router