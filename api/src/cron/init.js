const path = require('path');
const fs = require('fs');

const loadTasks = () => {
  const tasksDirectory = path.join(__dirname, 'tasks');
  const taskFiles = fs.readdirSync(tasksDirectory);
  const tasks = [];

  taskFiles.forEach((file) => {
    const task = require(path.join(tasksDirectory, file));
    tasks.push(task);
  });

  return tasks;
};

module.exports = loadTasks();
