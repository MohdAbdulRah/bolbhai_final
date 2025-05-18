const Joi = require("joi")

const issueJoiSchema = Joi.object({
    title: Joi.string().required(),
  
    description: Joi.string().allow('').optional(),
  
    category: Joi.string()
      .valid("Garbage", "Street Light", "Water Leak", "Road", "Other")
      .required(),
  
    status: Joi.string()
      .valid("pending", "in_progress", "resolved")
      .default("pending"),
  
    imageUrl: Joi.string().uri().allow('').optional(),
  
    location: Joi.string().allow('').optional(),
  
    latlng: Joi.string().optional(), // <-- Add this line
  
    reporter: Joi.string().hex().length(24).optional(),   // MongoDB ObjectId is 24 hex chars
  
    upvotes: Joi.array()
      .items(Joi.string().hex().length(24))
      .optional(),
  
    comments: Joi.array()
      .items(Joi.string().hex().length(24))
      .optional(),
  
    assignedTo: Joi.string().hex().length(24).optional(),
  
    created_At: Joi.date().optional(),
  
    resolved_At: Joi.date().allow(null).optional()
  });
  
  module.exports = issueJoiSchema;