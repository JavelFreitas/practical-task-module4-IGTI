import express from 'express';
import { transactionModel } from '../models/transaction.js'

const bankRouter = express();

bankRouter.get('/transactions', async (request, response) => {
    try {
        console.log('antes de find');

        const transactions = await transactionModel.find({});
        response.status(200).send({ transactions });
    } catch (error) {
        response.status(500).send(error);
    }
});

bankRouter.post('/transactions/create', async (request, response) => {
    try {

        const transaction = new transactionModel(request.body);
        await transaction.save();
        response.send(transaction);

    } catch (error) {
        response.status(500).send(error);
    }
});

bankRouter.delete('/transactions/delete/:id', async (request, response) => {
    try {
        const transactionDeleted = await transactionModel.findOneAndDelete({'_id': request.params.id});
        if (!transactionDeleted) {
            response.status(404).send('Document not found');
        }
        response.status(200).send(transactionDeleted);
    } catch (error) {
        response.status(500).send({error});
    }
})

export { bankRouter };