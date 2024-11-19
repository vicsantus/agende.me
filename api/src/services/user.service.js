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
  await createProfile({user: user.id});
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
 * @returns {Promise<{user: User, profile: Profile}>}
 */
const getUserById = async (id) => {
  const user = await User.findByPk(id);
  const profile = await getProfileByUserId(id);
  return { user, profile }
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
 * @param {String} query
 * @param {Object} options
 * @returns {Promise<User> | Error}
 */
const getUserByProfile = async (query, options) => {
  const limit = options.limit ? options.limit : undefined;
  const offset = options.page && options.limit ? (options.page - 1) * options.limit : undefined;

  // Converte o query para minúsculas
  const searchQuery = query.toLowerCase();

  // Primeira busca: pesquisa nos campos de User
  const usersFromUserSearch = await User.findAll({
    where: {
      [Op.or]: [
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('firstName')), Op.like, `%${searchQuery}%`),
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('lastName')), Op.like, `%${searchQuery}%`),
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('email')), Op.like, `%${searchQuery}%`)
      ],
      role: options.role || 'admin',
    },
    attributes: ['id'],
  });

  // Segunda busca: pesquisa nos campos de Profile
  const usersFromProfileSearch = await Profile.findAll({
    where: {
      [Op.or]: [
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('profile')), Op.like, `%${searchQuery}%`),
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('tags')), Op.like, `%${searchQuery}%`)
      ],
    },
    attributes: ['user'],
  });

  // Extrai IDs de usuários encontrados em ambas as buscas
  const userIdsFromUserSearch = usersFromUserSearch.map(user => user.id);
  const userIdsFromProfileSearch = usersFromProfileSearch.map(profile => profile.user);

  // Combina os IDs sem duplicatas
  const combinedUserIds = [...new Set([...userIdsFromUserSearch, ...userIdsFromProfileSearch])];

  // Busca final, trazendo os dados completos dos usuários com os IDs combinados
  const users = await User.findAll({
    where: {
      id: combinedUserIds
    },
    include: [
      {
        model: Profile,
        as: 'profileUser',
        attributes: ['id', 'profile', 'tags'],
      },
    ],
    order: [
      [Sequelize.literal(`CASE WHEN LOWER(User.firstName) LIKE '%${searchQuery}%' THEN 1 ELSE 0 END`), 'DESC'],
      [Sequelize.literal(`CASE WHEN LOWER(User.lastName) LIKE '%${searchQuery}%' THEN 1 ELSE 0 END`), 'DESC'],
      [Sequelize.literal(`CASE WHEN LOWER(User.email) LIKE '%${searchQuery}%' THEN 1 ELSE 0 END`), 'DESC'],
      [Sequelize.literal(`CASE WHEN LOWER(profileUser.tags) LIKE '%${searchQuery}%' THEN 1 ELSE 0 END`), 'DESC'],
      [Sequelize.literal(`CASE WHEN LOWER(profileUser.profile) LIKE '%${searchQuery}%' THEN 1 ELSE 0 END`), 'DESC'],
    ],
    ...(limit && { limit }),
    ...(offset && { offset }),
  });

  if (users.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  return users;
};

// const getUserByProfile = async (query, options) => {
//   const limit = options.limit ? options.limit : undefined;
//   const offset = options.page && options.limit ? (options.page - 1) * options.limit : undefined;

//   const user = await User.findAll({
//     where: {
//       [Op.or]: [
//         Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('firstName')), Op.like, `%${query.toLowerCase()}%`),
//         Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('lastName')), Op.like, `%${query.toLowerCase()}%`),
//         Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('email')), Op.like, `%${query.toLowerCase()}%`)
//       ],
//       role: options.role || 'admin',
//     },
//     include: [
//       {
//         model: Profile,
//         as: 'profileUser',
//         attributes: ['id', 'profile', 'tags'],
//         where: {
//           [Op.or]: [
//             Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('profileUser.profile')), Op.like, `%${query.toLowerCase()}%`),
//             Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('profileUser.tags')), Op.like, `%${query.toLowerCase()}%`)
//           ],
//         },
//       },
//     ],
//     order: [
//       [Sequelize.literal(`CASE WHEN LOWER(User.firstName) LIKE '%${query.toLowerCase()}%' THEN 1 ELSE 0 END`), 'DESC'],
//       [Sequelize.literal(`CASE WHEN LOWER(User.lastName) LIKE '%${query.toLowerCase()}%' THEN 1 ELSE 0 END`), 'DESC'],
//       [Sequelize.literal(`CASE WHEN LOWER(User.email) LIKE '%${query.toLowerCase()}%' THEN 1 ELSE 0 END`), 'DESC'],
//       [Sequelize.literal(`CASE WHEN LOWER(profileUser.tags) LIKE '%${query.toLowerCase()}%' THEN 1 ELSE 0 END`), 'DESC'],
//       [Sequelize.literal(`CASE WHEN LOWER(profileUser.profile) LIKE '%${query.toLowerCase()}%' THEN 1 ELSE 0 END`), 'DESC'],
//     ],
//     ...(limit && { limit }),
//     ...(offset && { offset })
//   });
  

//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   return user;
// };

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
