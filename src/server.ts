import app from './app';
import logger from './winston';

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  logger.log({
    level: 'info',
    message: '서버가 시작되었습니다.',
  });
});
