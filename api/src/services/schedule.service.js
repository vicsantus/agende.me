const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { /* User,  */ FreeSchedule } = require('../models');
const ApiError = require('../utils/ApiError');

// const isEmailTaken = async (email, userId) => {
//   const user = await User.findOne({ where: { email, id: { [Op.ne]: userId } } });
//   return !!user;
// };
// /**
//  * Get user by email
//  * @param {string} email
//  * @returns {Promise<User>}
//  */
// const getUserByEmail = async (email) => {
//   return User.findOne({ where: { email } });
// };

/**
 * Get user by id
 * @param {UUID} id
 * @returns {Promise<FreeSchedule>}
 */
const getScheduleByOwner = async (id) => {
  return FreeSchedule.findAll({ where: { owner: id } });
};

function isDateRangeConflict(existingRange, newRange) {
  const existingStart = new Date(existingRange.dateStart);
  const existingEnd = new Date(existingRange.dateEnd);
  const newStart = new Date(newRange.dateStart);
  const newEnd = new Date(newRange.dateEnd);

  // Verifica se há sobreposição entre os intervalos
  return newStart <= existingEnd && newEnd >= existingStart;
}

const checkDates = async (newDate, userId) => {
  const oldSchedule = await getScheduleByOwner(userId);
  for (const schedule of oldSchedule) {
    if (isDateRangeConflict(newDate, schedule)) {
      return true;
    }
  }
};

/**
 * Create a user
 * @param {Object} userBody
 * @param {String} userId
 * @returns {Promise<FreeSchedule>}
 */
const createSchedule = async (userBody, userId) => {
  if (await checkDates({ dateStart: userBody.dateStart, dateEnd: userBody.dateEnd }, userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Date already taken');
  }
  if (new Date(userBody.dateEnd) < new Date()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'End date has passed!');
  }
  const schedule = await FreeSchedule.create(userBody);
  return schedule;
};

// const paginateUsers = async (filter, options, conditions) => {
//   const users = await User.findAll({ ...filter, ...options, where: conditions });
//   return users;
// };
// /**
//  * Query for users
//  * @param {Object} filter - Sequelize filter
//  * @param {Object} options - Query options
//  * @param {string} [options.sortBy] - Sort option in the format: ['field1','ASC'],['field2','DESC']
//  * @param {number} [options.limit] - Maximum number of results per page (default = 10)
//  * @param {number} [options.page] - Current page (default = 1)
//  * @returns {Promise<QueryResult>}
//  */
// const queryUsers = async (filter, options, conditions) => {
//   const users = await paginateUsers(filter, options, conditions);
//   return users;
// };

// /**
//  * Update user by id
//  * @param {ObjectId} userId
//  * @param {Object} updateBody
//  * @returns {Promise<User>}
//  */
// const updateUserById = async (userId, updateBody) => {
//   const user = await getUserById(userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   if (updateBody.email && (await isEmailTaken(updateBody.email, userId))) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
//   }
//   Object.assign(user, updateBody);
//   await user.save();
//   return user;
// };

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @param {Date} date
 * @returns {Promise<User>}
 */
const deleteScheduleById = async (userId, date) => {
  const schedule = await FreeSchedule.findOne({
    where: {
      owner: userId,
      dateStart: { [Op.lte]: date },
      dateEnd: { [Op.gte]: date },
    },
  });
  if (!schedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Schedule not found');
  }
  await FreeSchedule.destroy({
    where: {
      owner: userId,
      dateStart: { [Op.lte]: date },
      dateEnd: { [Op.gte]: date },
    },
  });
  return schedule;
};

/**
 * Delete old schedules
 * @returns {Promise<Boolean>}
 */
const deleteOldSchedule = async () => {
  const date = new Date();
  console.log(date, 'date');

  const schedule = await FreeSchedule.findOne({
    where: {
      dateEnd: { [Op.lt]: date },
    },
  });
  if (!schedule) {
    return false;
  }
  await FreeSchedule.destroy({
    where: {
      dateEnd: { [Op.lt]: date },
    },
  });
  return true;
};

module.exports = {
  getScheduleByOwner,
  createSchedule,
  deleteScheduleById,
  deleteOldSchedule,
};
