import * as Joi from 'joi';

export const createHospitalValidator = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  state: Joi.string().optional(),
  lga: Joi.number().optional(),
  street: Joi.string().optional(),
  address: Joi.string().optional(),
});
