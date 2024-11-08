// const { Schedule } = require('../models'); // Ajuste para o caminho do seu modelo Sequelize
// const Sequelize = require('sequelize');

module.exports = {
  name: 'deleteExpiredSchedules',
  cron: '0 * * * *',  // 0 * * * * para cada uma hora / */1 * * * * * para a cada segundo
  process: async () => {
    const currentDate = new Date();
    console.log(currentDate, "currentDate");
    

    try {
      // const deletedSchedules = await Schedule.destroy({
      //   where: {
      //     dateEnd: {
      //       [Sequelize.Op.lt]: currentDate,
      //     },
      //   },
      // });

      // console.log(`${deletedSchedules} schedules deletados!`);
    } catch (error) {
      console.error('Erro ao deletar schedules expirados:', error);
    }
  }
};