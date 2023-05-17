import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import db from './db-config.js';
import authRouter from './controllers/auth.js';
import router from './routes/pages.js';

dotenv.config();
const PORT = process.env.DB_PORT;

const app = express();

app.use('/js', express.static(new URL('./public/js', import.meta.url).pathname));
app.use('/css', express.static(new URL('./public/css', import.meta.url).pathname));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(cookieParser());
app.use(express.json());

db.connect((err) => {
  if (err) throw err;
  console.log('Database Connected');
});

app.use('/', router);
app.use('/api', authRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
