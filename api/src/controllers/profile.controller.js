const httpStatus = require('http-status');
// const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

// const createSchedule = catchAsync(async (req, res) => {
//   const bodySchedule = { ...req.body, owner: req.params.userId };
//   const schedule = await scheduleService.createSchedule(bodySchedule, req.params.userId);
//   res.status(httpStatus.CREATED).send(schedule);
// });

const updateProfile = catchAsync(async (req, res) => {
  const bodyProfile = { ...req.body, user: req.params.userId };
  const profile = await userService.updateProfileByUserId(req.params.userId, bodyProfile);
  res.status(httpStatus.CREATED).send(profile);
});

// const getUsers = catchAsync(async (req, res) => {
//   const filter = pick(req.query, ['name', 'role']);
//   const options = pick(req.query, ['sortBy', 'limit', 'page']);
//   const result = await userService.queryUsers(filter, options);
//   res.send(result);
// });

const getProfile = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  const profile = await userService.getProfileByUserId(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }
  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }
  res.send({user, profile});
});

// const updateUser = catchAsync(async (req, res) => {
//   const user = await userService.updateUserById(req.params.userId, req.body);
//   res.send(user);
// });

// const deleteSchedule = catchAsync(async (req, res) => {
//   await scheduleService.deleteScheduleById(req.params.userId, req.body.date);
//   res.status(httpStatus.NO_CONTENT).send();
// });

module.exports = {
  getProfile,
  // createSchedule,
  // deleteSchedule,
  updateProfile,
};
