const chalk = require('chalk');

const { deleteOldSchedule } = require('../../services/schedule.service');

module.exports = {
  name: 'deleteExpiredSchedules',
  cron: '*/1 * * * *', // 0 * * * * para cada uma hora / */1 * * * * * para a cada segundo
  process: async () => {
    console.log(chalk.green('RODANDO CRON PARA APAGAR AGENDAMENTOS EXPIRADOS'));

    try {
      const scheduleDeleted = await deleteOldSchedule();

      if (scheduleDeleted) {
        console.log(chalk.hex('#2de0c2')('Agendas antigas deletadas'));
      } else {
        console.log(chalk.hex('#2de0c2')('Não existem agendas antigas'));
      }
    } catch (error) {
      console.error(chalk.red('Erro ao deletar schedules expirados:'), error);
    } finally {
      console.log(chalk.yellowBright('CRON deleteExpiredSchedules FINALIZADO!'));
    }
  },
};
