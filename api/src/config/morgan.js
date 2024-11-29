const morgan = require('morgan');
const config = require('./config');
const logger = require('./logger');
const chalk = require('chalk');

morgan.token('message', (req, res) => res.locals.errorMessage || '');
morgan.token('date', (req, res) => chalk.magenta(new Date().toISOString()));

morgan.token("method", (req, _) => {
  const method = req.method;
  const color =
    method === "POST"
      ? "red"
      : method === "GET"
        ? "green"
        : method === "OPTIONS"
          ? "yellow"
          : "bgRed"

  return chalk[color](method.toString());
});

morgan.token("status", (_, res) => {
  const status = res.statusCode;
  const color =
    status >= 500
      ? "red"
      : status >= 400
        ? "yellow"
        : status >= 300
          ? "cyan"
          : status >= 200
            ? "green"
            : "bold";

  return chalk[color](status.toString());
});

morgan.token("url", (req, _) => chalk.magenta(req.url));

const getIpFormat = () => (config.env === 'production' ? ':remote-addr - ' : '');
const successResponseFormat = `:date - ${getIpFormat()}:method - :url :status - :response-time ms`;
const errorResponseFormat = `:date - ${getIpFormat()}:method - :url :status - :response-time ms - message: :message`;

const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) },
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) },
});

module.exports = {
  successHandler,
  errorHandler,
};
