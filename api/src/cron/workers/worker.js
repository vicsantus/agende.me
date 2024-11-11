const { Queue, Worker } = require('bullmq');
const Redis = require('ioredis');
const chalk = require('chalk');
const tasks = require('../init');

const HOST = process.env.REDIS_HOST;
const PORT = process.env.REDIS_PORT;

const connection = new Redis({
  host: HOST,
  port: PORT,
  maxRetriesPerRequest: null,
});

const queue = new Queue('myQueue', {
  connection,
});

tasks.forEach((task) => {
  queue.add(task.name, {}, { repeat: { cron: task.cron } });
  console.log(
    chalk.magentaBright(`Task "${chalk.bold(task.name)}" registrada para rodar com cron: ${chalk.bold(task.cron)}`)
  );
});

tasks.forEach((task) => {
  new Worker('myQueue', task.process, { connection });
});
