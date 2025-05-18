const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    enum: ["Garbage", "Street Light", "Water Leak", "Road", "Other"],
    required : true
  },
  status: {
    type: String,
    enum: ["pending", "in_progress", "resolved"],
    default: "pending",
  },
  image:{
      url : String,
      filename : String
  },
  location: {
    type: String,
  },
  reporter: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
  upvotes: [
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    }
   ],
   comments : [
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Comment"
    }
   ],
   assignedTo : {
     type : mongoose.Schema.Types.ObjectId,
     ref : "User"
   },
   created_At : {
        type: Date, 
        default: Date.now 
   },
   resolved_At : {
        type : Date,
        default : null
   },
  lat: Number,
  lng: Number,
});

const Issue = mongoose.model("Issue",issueSchema)

module.exports = Issue

