const Joi = require('joi');

/**
 * Validation schemas for review endpoints
 */

const createReviewSchema = Joi.object({
  ideaId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Idea ID must be a number',
      'number.positive': 'Idea ID must be positive',
      'any.required': 'Idea ID is required'
    }),

  innovationScore: Joi.number()
    .integer()
    .min(1)
    .max(10)
    .required()
    .messages({
      'number.base': 'Innovation score must be a number',
      'number.min': 'Innovation score must be between 1 and 10',
      'number.max': 'Innovation score must be between 1 and 10',
      'any.required': 'Innovation score is required'
    }),

  feasibilityScore: Joi.number()
    .integer()
    .min(1)
    .max(10)
    .required()
    .messages({
      'number.base': 'Feasibility score must be a number',
      'number.min': 'Feasibility score must be between 1 and 10',
      'number.max': 'Feasibility score must be between 1 and 10',
      'any.required': 'Feasibility score is required'
    }),

  impactScore: Joi.number()
    .integer()
    .min(1)
    .max(10)
    .required()
    .messages({
      'number.base': 'Impact score must be a number',
      'number.min': 'Impact score must be between 1 and 10',
      'number.max': 'Impact score must be between 1 and 10',
      'any.required': 'Impact score is required'
    }),

  feedback: Joi.string()
    .trim()
    .min(10)
    .max(2000)
    .required()
    .messages({
      'string.empty': 'Feedback is required',
      'string.min': 'Feedback must be at least 10 characters',
      'string.max': 'Feedback must not exceed 2000 characters'
    }),

  decision: Joi.string()
    .valid('Approved', 'Rejected', 'Needs Revision')
    .optional()
    .messages({
      'any.only': 'Decision must be one of: Approved, Rejected, Needs Revision'
    })
});

module.exports = {
  createReviewSchema
};
