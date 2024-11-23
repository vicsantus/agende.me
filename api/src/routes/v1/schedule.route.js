const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { scheduleValidation } = require('../../validations');
const { scheduleController } = require('../../controllers');

const router = express.Router();

router
  .route('/:userId')
  .get(auth(), validate(scheduleValidation.getSchedule), scheduleController.getSchedule)
  .post(auth(), validate(scheduleValidation.createSchedule), scheduleController.createSchedule)
  .delete(auth(), /* validate(scheduleValidation.deleteSchedule),  */scheduleController.deleteSchedule);

  router.post('/validation/:userId', auth(), validate(scheduleValidation.validSchedule), scheduleController.validSchedule)

module.exports = router;
