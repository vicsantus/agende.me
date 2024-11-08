const { Queue, Worker } = require('bullmq');
const Redis = require('ioredis');
const tasks = require('../init');

const HOST = process.env.REDIS_HOST
const PORT = process.env.REDIS_PORT


const connection = new Redis({
  host: HOST,
  port: PORT,
  maxRetriesPerRequest: null,
});

const queue = new Queue('myQueue', {
  connection
});

tasks.forEach((task) => {
  queue.add(task.name, {}, { repeat: { cron: task.cron } });
  console.log(`Task "${task.name}" registrada para rodar com cron: ${task.cron}`);
});

tasks.forEach((task) => {
  new Worker('myQueue', task.process, { connection });
});