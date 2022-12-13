import express from 'express';
import mapsRouter from './api/routes/maps';

const app = express();
const port = 3000;

app.use('/api/maps', mapsRouter)

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});