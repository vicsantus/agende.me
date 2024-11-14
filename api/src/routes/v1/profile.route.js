const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { profileValidation } = require('../../validations');
const { profileController } = require('../../controllers');

const router = express.Router();

router
  .route('/:userId')
  .get(auth(), validate(profileValidation.getProfile), profileController.getProfile)
  .post(auth(), validate(profileValidation.createUpdateProfile), profileController.updateProfile);
  // .delete(auth(), validate(profileValidation.deleteSchedule), profileController.deleteSchedule);

module.exports = router;
