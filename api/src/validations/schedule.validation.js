const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createSchedule = {
  body: Joi.object().keys({
    dateStart: Joi.date().required(),
    dateEnd: Joi.date().required(),
    responsible: Joi.string().required().custom(objectId),
    comments: Joi.string().max(300),
  }),
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
};

const getSchedule = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const deleteSchedule = {
  body: Joi.object().keys({
    date: Joi.date().required(),
  }),
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  })
}

module.exports = {
  createSchedule,
  deleteSchedule,
  getSchedule,
}