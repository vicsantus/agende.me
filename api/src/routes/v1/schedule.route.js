const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const scheduleController = require('../../controllers/schedule.controller');
const { scheduleValidation } = require('../../validations');

const router = express.Router();

router
  .route('/:userId')
  .get(auth(), validate(scheduleValidation.getSchedule), scheduleController.getSchedule)
  .post(auth(), validate(scheduleValidation.createSchedule), scheduleController.createSchedule)
  .delete(auth(), validate(scheduleValidation.deleteSchedule), scheduleController.deleteSchedule);

module.exports = router;
