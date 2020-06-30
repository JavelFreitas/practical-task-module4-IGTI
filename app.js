import express, { json } from 'express';
import bankRouter from './routes/bankRouter';

const app = express();

app.use(express.json());
app.use(bankRouter);

app.listen(3000, () => { console.log("API running");});