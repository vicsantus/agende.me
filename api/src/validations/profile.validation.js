const Joi = require('joi');
const { /* password,  */ objectId } = require('./custom.validation');

const createUpdateProfile = {
  body: Joi.object().keys({
    profile: Joi.string(),
    tags: Joi.array().items(Joi.string()).max(3),
  }),
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
};

const getProfile = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

// const deleteSchedule = {
//   body: Joi.object().keys({
//     date: Joi.date().required(),
//   }),
//   params: Joi.object().keys({
//     userId: Joi.string().required().custom(objectId),
//   }),
// };

module.exports = {
  createUpdateProfile,
  // deleteSchedule,
  getProfile,
};
