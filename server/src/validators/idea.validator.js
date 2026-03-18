const Joi = require('joi');

/**
 * Validation schemas for idea endpoints
 */

const createIdeaSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 5 characters',
      'string.max': 'Title must not exceed 200 characters'
    }),

  description: Joi.string()
    .trim()
    .min(20)
    .max(5000)
    .required()
    .messages({
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least 20 characters',
      'string.max': 'Description must not exceed 5000 characters'
    }),

  domain: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Domain is required',
      'string.min': 'Domain must be at least 2 characters',
      'string.max': 'Domain must not exceed 50 characters'
    })
});

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid('Submitted', 'Under Review', 'Approved', 'Rejected', 'On Hold')
    .required()
    .messages({
      'string.empty': 'Status is required',
      'any.only': 'Status must be one of: Submitted, Under Review, Approved, Rejected, On Hold'
    })
});

const assignReviewerSchema = Joi.object({
  reviewerId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Reviewer ID must be a number',
      'number.positive': 'Reviewer ID must be positive',
      'any.required': 'Reviewer ID is required'
    })
});

module.exports = {
  createIdeaSchema,
  updateStatusSchema,
  assignReviewerSchema
};
