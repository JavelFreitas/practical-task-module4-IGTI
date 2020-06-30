import express from 'express';
import { bankRouter } from './routes/bankRouter.js';
import mongoose from 'mongoose';


const app = express();

app.use(express.json());
app.use(bankRouter);

app.listen(3000, async () => {
    console.log('antes');

    try {
        console.log('antes de conectar');

        await mongoose.connect(
            'mongodb+srv://javel:1234@cluster0.04je1.mongodb.net/bank?retryWrites=true&w=majority',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            }
        );
        console.log('depois de conectar');

    } catch (error) {
        console.log('Error while connecting to mongo: ' + error);
    }
    console.log('depois');

});