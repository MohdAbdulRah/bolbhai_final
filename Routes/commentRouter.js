const express = require("express")
const router = express.Router({mergeParams : true})

const User = require("../Models/userModel.js")
const Issue = require("../Models/issueModel.js")
const Comment = require("../Models/commentModel.js")
const {isLoggedIn,isCommentOwner} = require("../middleware.js")

router.post('/:id', isLoggedIn, async (req, res) => {
   try {
     const issueId = req.params.id;
     const { content } = req.body;
     const user = req.user;
 
     // Create and save comment using the Comment model
     const newComment = new Comment({
       content,
       username: user.username
     });
     const savedComment = await newComment.save();
 
     // Push comment reference into the Issue
     const issue = await Issue.findByIdAndUpdate(issueId, {
       $push: { comments: savedComment._id }
     }, { new: true }).populate('comments');
 
     res.json({
       success: true,
       commentId: savedComment._id,
       content: savedComment.content,
       username: savedComment.username,
       commentCount: issue.comments.length
     });
 
   } catch (err) {
     console.error(err);
     res.status(500).json({ success: false, error: 'Failed to add comment' });
   }
 });
 

router.delete("/:issueId/:commentId", isCommentOwner, async (req, res) => {
   let { issueId, commentId } = req.params;
 
   await Comment.findByIdAndDelete(commentId);
   await Issue.findByIdAndUpdate(issueId, {
     $pull: { comments: commentId }
   });
 
   res.json({ message: "Comment deleted", commentId });
 });

module.exports = router