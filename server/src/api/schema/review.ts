import Joi from 'joi';

export const schema = Joi.object().keys({
  id: Joi.string(),
  author_id: Joi.string().required(),
  course_id: Joi.string().required(),
  semester_id: Joi.string().required(),
  difficulty: Joi.number().min(1).max(5).integer().required(),
  rating: Joi.number().min(1).max(5).integer().required(),
  workload: Joi.number().min(1).max(100).integer().required(),
  body: Joi.string().required(),
});
