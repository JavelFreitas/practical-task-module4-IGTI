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
        const { agencia, conta, name, balance } = request.body;
        const transactionFind = await transactionModel.find({ agencia, conta, name, balance });

        if (transactionFind.length === 0) {
            const transaction = new transactionModel({ agencia, conta, name, balance });
            await transaction.save();
            response.send(transaction);

        } else {
            throw 'Account already exists';
        }
    } catch (error) {
        response.status(500).send(error);
    }
});

bankRouter.delete('/transactions/delete/:id', async (request, response) => {
    try {
        const transactionDeleted = await transactionModel.findOneAndDelete({ '_id': request.params.id });
        if (!transactionDeleted) {
            response.status(404).send('Document not found');
        }
        response.status(200).send(transactionDeleted);
    } catch (error) {
        response.status(500).send({ error });
    }
});

bankRouter.patch('/transactions/update/:id', async (request, response) => {
    try {
        const transactionUpdated = await transactionModel.findOneAndUpdate(
            { '_id': request.params.id },
            request.body,
            { new: true });
        response.send(transactionUpdated);
    } catch (error) {
        response.status(500).send({ error });
    }
});

bankRouter.patch('/transactions/deposit', async (request, response) => {
    try {
        if (request.body.deposito <= 0) {
            throw 'Invalid amount'
        }
        const { agencia, conta, deposito } = request.body;
        const transactionFind = await transactionModel.find({ agencia, conta });
        if (transactionFind.length === 0) {
            throw 'Accound not found';
        }

        const transactionDeposited = await transactionModel.findOneAndUpdate(
            { agencia, conta },
            { $inc: { balance: deposito } },
            { new: true }
        );
        response.send(transactionDeposited);
    } catch (error) {
        response.status(500).send({ error });
    }
});

export { bankRouter };