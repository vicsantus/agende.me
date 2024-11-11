const httpStatus = require('http-status');
const { Op, Sequelize } = require('sequelize');
const { User, Profile } = require('../models');
const ApiError = require('../utils/ApiError');

const isEmailTaken = async (email, userId) => {
  const user = await User.findOne({ where: { email, id: { [Op.ne]: userId } } });
  return !!user;
};
/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ where: { email } });
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await getUserByEmail(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const user = await User.create(userBody);
  await createProfile({user: user.id, profile: ' ', tags: '[]'});
  return user;
};

const paginateUsers = async (filter, options, conditions) => {
  const users = await User.findAll({ ...filter, ...options, where: conditions });
  return users;
};
/**
 * Query for users
 * @param {Object} filter - Sequelize filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: ['field1','ASC'],['field2','DESC']
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options, conditions) => {
  const users = await paginateUsers(filter, options, conditions);
  return users;
};

/**
 * Get user by id
 * @param {UUID} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findByPk(id);
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await User.destroy({ where: { id: userId } });
  return user;
};

/**
 * Create user profile
 * @param {Object} profileData
 * @param {String} profileData.profile
 * @param {UUID} profileData.user
 * @param {String} profileData.tags
 * @returns {Promise<Profile>}
 */
const createProfile = async (profileData) => {
  const profile = await Profile.create(profileData);
  return profile;
};

/**
 * Get user profile by id
 * @param {UUID} id
 * @returns {Promise<Profile> | Error}
 */
const getProfileById = async (id) => {
  const profile = await Profile.findByPk(id);
  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }
  return profile;
};

/**
 * Get user profile by user id
 * @param {UUID} id
 * @returns {Promise<Profile> | Promise<Error>}
 */
const getProfileByUserId = async (id) => {
  const profile = await Profile.findOne({where: {user: id}});
  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }
  return profile;
};

/**
 * Get user profile by id
 * @param {UUID} id
 * @returns {Promise<Profile> | Error}
 */
const getUserByProfile = async (query) => {
  const profile = await Profile.findAll({
    where: {
      [Op.or]: [{ profile: { [Op.like]: `%${query}%` } }, { tags: { [Op.like]: `%${query}%` } }],
    },
    include: [
      {
        model: User,
        as: 'userProfile',
        attributes: ['id', 'firstName', 'lastName', 'email'],
        where: {
          [Op.or]: [
            { firstName: { [Op.like]: `%${query}%` } },
            { lastName: { [Op.like]: `%${query}%` } },
            { email: { [Op.like]: `%${query}%` } },
          ],
        },
      },
    ],
    order: [
      [Sequelize.literal(`CASE WHEN "userDetails"."firstName" LIKE '%${query}%' THEN 1 ELSE 0 END`), 'DESC'],
      [Sequelize.literal(`CASE WHEN "Profile"."tags" LIKE '%${query}%' THEN 1 ELSE 0 END`), 'DESC'],
      [Sequelize.literal(`CASE WHEN "Profile"."profile" LIKE '%${query}%' THEN 1 ELSE 0 END`), 'DESC'],
    ],
  });
  if (!profile || profile.length <= 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }
  return profile;
};

/**
 * Update user profile by user id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<Profile>}
 */
const updateProfileByUserId = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  try {
    const profile = await getProfileByUserId(userId);
    Object.assign(profile, updateBody);
    await profile.save();
    return profile;
  } catch (error) {
    const profile = await createProfile({...updateBody, user: userId})
    return profile;
  }
};

/**
 * Delete user profile by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteProfileByUserId = async (userId) => {
  const profile = await getProfileByUserId(userId);
  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }
  await Profile.destroy({ where: { id: userId } });
  return profile;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  createProfile,
  getProfileById,
  getUserByProfile,
  updateProfileByUserId,
  getProfileByUserId,
  deleteProfileByUserId,
};
