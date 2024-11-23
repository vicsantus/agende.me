const httpStatus = require('http-status');
// const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { scheduleService } = require('../services');

const createSchedule = catchAsync(async (req, res) => {
  const bodySchedule = { ...req.body, owner: req.params.userId };
  const schedule = await scheduleService.createSchedule(bodySchedule, req.params.userId);
  res.status(httpStatus.CREATED).send(schedule);
});

// const getUsers = catchAsync(async (req, res) => {
//   const filter = pick(req.query, ['name', 'role']);
//   const options = pick(req.query, ['sortBy', 'limit', 'page']);
//   const result = await userService.queryUsers(filter, options);
//   res.send(result);
// });

const getSchedule = catchAsync(async (req, res) => {
  // const user = await userService.getUserById(req.params.userId);
  const schedule = await scheduleService.getScheduleByOwner(req.params.userId);
  if (!schedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Schedule not found');
  }
  res.send(schedule);
});

const validSchedule = catchAsync(async (req, res) => {
  const isConflicted = await scheduleService.checkDates({ dateStart: req.body.dateStart, dateEnd: req.body.dateEnd }, req.params.userId)
  return res.send(isConflicted)
})

// const updateUser = catchAsync(async (req, res) => {
//   const user = await userService.updateUserById(req.params.userId, req.body);
//   res.send(user);
// });

const deleteSchedule = catchAsync(async (req, res) => {
  await scheduleService.deleteScheduleById(req.params.userId, req.query.date);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getSchedule,
  createSchedule,
  deleteSchedule,
  validSchedule,
};
