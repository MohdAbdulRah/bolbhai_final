const express = require("express")
const router = express.Router({mergeParams : true})

const User = require("../Models/userModel.js")
const Issue = require("../Models/issueModel.js")
const passport = require("passport")
const ExpressError = require("../utils/ExpressError.js")
const { isLoggedIn } = require("../middleware.js")




router.get("/signup",async (req,res)=>{
  res.render("users/signup.ejs", {
    activePage : ""
  })
})

router.get("/login", async (req,res) => {
    res.render("users/login.ejs",{
      activePage : ""
    })
})
router.post("/signup", async (req, res, next) => {
  try {
    let { username, email, password, role, adhar, location } = req.body;

    // Default role to 'citizen' if not provided
    role = role || "citizen";

    const newUser = new User({
      username,
      email,
      role,
      adhar,
      location,
    });

    const result = await User.register(newUser, password);
    req.login(result, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Bol Bhai");
      if (result.role === "citizen") {
        res.redirect("/issue/all"); // Redirect citizens to the user dashboard
      } else {
        res.redirect("/admin/pending"); // Redirect admins to the admin dashboard
      }
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/user/signup");
  }
})



router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/user/login",
    failureFlash: true,
  }),
  (req, res) => {
    if (req.user.role === "admin") {
      res.redirect("/admin/pending"); // Redirect admins to the admin dashboard
    } else {
      res.redirect("/issue/all"); // Redirect citizens to the user dashboard
    }
  }
);


router.get("/logout",(req,res,next) => {
    req.logout((err) => {
      if(err){
        return next(err)
      }

      req.flash("success","You are logged in")
      res.redirect("/issue/all")
    })
})

router.get("/profile",isLoggedIn, async (req,res)=>{
  let result = req.user
  let issues = await Issue.find({reporter : result.id}).sort({ createdAt: -1 })
  res.render("users/profile.ejs",{result,issues,
    activePage : "profile"
  })
})

router.get("/view/:id", isLoggedIn,async (req,res) => {
  let {id} = req.params
  let issue = await Issue.findById(id).populate("reporter").populate("comments").populate("upvotes").populate("assignedTo")

  res.render("issues/view.ejs",{issue,
      activePage : "profile",
  })

})

module.exports = router
