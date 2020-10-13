import app from './app';

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log('Listening to port 4000');
});
