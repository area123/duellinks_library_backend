import winston from 'winston';
import 'winston-daily-rotate-file';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'log/%DATE%-error.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
    }),
    new winston.transports.DailyRotateFile({
      filename: 'log/%DATE%-system.log',
      datePattern: 'YYYY-MM-DD',
      format: winston.format.printf(
        info => `${getFormatDate(new Date())} [${info.level.toUpperCase()}] - ${info.message}`,
      ),
    }),
  ],
});

export default logger;

function getFormatDate(date: Date): string {
  const hour = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours();
  const minute = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes();
  const second = date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds();
  return `${hour}-${minute}-${second}`;
}
