const Issue = require("./Models/issueModel.js")
const Comment = require("./Models/commentModel.js")
module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.flash("error","You must be logged in ")
        return res.redirect("/user/login")
    } 

    next()
}

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }

    next()
}

module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params
    let issue = await Issue.findById(id).populate("reporter")
    if(issue.reporter.id.toString() !== req.user.id.toString()){
        req.flash("error","You are not the owner of this issue report")
        return res.redirect("/issue/all")
    }
    next()
}

module.exports.isCommentOwner = async (req,res,next) =>  {
    let {issueId,commentId} = req.params

    let issueGot = await Issue.findById(issueId)
    let commentGot = await Comment.findById(commentId)

    if(req.user.username !== commentGot.username){
        req.flash("error","You are not the owner of Comment")
        return res.redirect("/issue/all")
    }

    next()
}

module.exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === "admin") {
      return next();
    }
    req.flash("error", "You do not have permission to access this page.");
    res.redirect("/user/login");
  }