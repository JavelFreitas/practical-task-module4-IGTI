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
            throw 'Negative amount is not valid';
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

bankRouter.patch('/transactions/withdraw', async (request, response) => {
    try {
        if (request.body.saque <= 0) {
            throw 'Negative amount is not valid';
        }
        const { agencia, conta, saque } = request.body;
        const transactionFind = await transactionModel.find({ agencia, conta });
        if (transactionFind.length === 0) {
            throw 'Accound not found';
        }
        if ((transactionFind[0].balance - (saque + 1)) < 0) {
            throw 'Not enought money to withdraw';
        }

        const transactionWithdrawn = await transactionModel.findOneAndUpdate(
            { agencia, conta },
            { $inc: { balance: (saque + 1) * (-1) } },
            { new: true }
        );
        response.send(transactionWithdrawn);
    } catch (error) {
        response.status(500).send({ error });
    }
});

bankRouter.get('/transactions/getBalance', async (request, response) => {
    try {
        const { agencia, conta } = request.body;
        const transactionFind = await transactionModel.find({ agencia, conta });

        if (transactionFind.length === 0) {
            throw 'Accound not found';
        }

        const balance = transactionFind[0].balance;
        console.log(balance);

        response.status(200).send({ balance });

    } catch (error) {
        response.status(500).send({ error });
    }
});

bankRouter.delete('/transactions/deleteAccount', async (request, response) => {
    try {
        const { agencia, conta } = request.body;
        const transactionFind = await transactionModel.find({ agencia });

        if (transactionFind.length === 0) {
            throw 'Agency not found';
        }

        const transactionDeleted = await transactionModel.findOneAndDelete({ agencia, conta });
        if (!transactionDeleted) {
            response.status(404).send('Account not found');
        }

        response.status(200).send({ accountsRemaining: (transactionFind.length - 1) });
    } catch (error) {
        response.status(500).send({ error });
    }
});

bankRouter.patch('/transactions/transfer', async (request, response) => {
    try {
        const { contaOrigem, contaDestino, valor } = request.body;
        if (valor <= 0) {
            throw 'Negative value not allowed';
        }
        let withdrawOrigin = valor;

        const transferOrigin = await transactionModel.findOne(
            { conta: contaOrigem });

        if (!transferOrigin) { throw `Account ${contaOrigem} not found`; }

        const transferDestination = await transactionModel.findOne(
            { conta: contaDestino });

        if (!transferDestination) { throw `Account ${contaDestino} not found`; }

        if (transferOrigin.agencia !== transferDestination.agencia) {
            withdrawOrigin += 8;
        }

        ;
        await transactionModel.findOneAndUpdate(
            { agencia: transferOrigin.agencia, conta: transferOrigin.conta },
            { $inc: { balance: ((withdrawOrigin) * (-1)) } },
        );

        await transactionModel.findOneAndUpdate(
            { agencia: transferDestination.agencia, conta: transferDestination.conta },
            { $inc: { balance: valor } },
        );


        response.status(200).send({ balanceOrigin: (transferOrigin.balance - withdrawOrigin) });

    } catch (error) {
        response.status(500).send({ error });
    }
});

bankRouter.get('/transactions/averageBalance/:agencia', async (request, response) => {
    try {
        const { agencia } = request.params;
        let quantity = 0;

        const accounts = await transactionModel.find({ agencia });
        if (accounts.length === 0) {
            throw 'Agency not found';
        }

        const totalBalance = accounts.reduce((curr, next) => {
            quantity++;
            return curr + next.balance;
        }, 0);

        response.send({ average: (totalBalance / quantity) });
    } catch (error) {
        response.status(500).send({ error });
    }
});

bankRouter.get('/transactions/ascendingBalance/:limite', async (request, response) => {
    try {
        let { limite } = request.params;
        limite = parseInt(limite);
        const filteredAccounts = await transactionModel
            .aggregate([
                { $project: { agencia: 1, conta: 1, balance: 1 } },
                { $sort: { balance: 1 } },
                { $limit: Number(limite) }
            ]);

        response.status(200).send({ filteredAccounts });
    } catch (error) {
        response.status(500).send({ error });
    }
});

bankRouter.get('/transactions/descendingBalance/:limite', async (request, response) => {
    try {
        let { limite } = request.params;
        limite = parseInt(limite);
        const filteredAccounts = await transactionModel
            .aggregate([
                {
                    $project: {
                        agencia: 1,
                        conta: 1,
                        name: 1,
                        balance: 1
                    }
                },
                {
                    $sort: {
                        balance: -1
                    }
                },
                { $limit: Number(limite) }
            ]);

        response.status(200).send({ filteredAccounts });
    } catch (error) {
        response.status(500).send({ error });
    }
});

bankRouter.get('/transactions/transferTopClients', async (request, response) => {
    try {
        const agencias = await transactionModel.distinct("agencia", { agencia: { $ne: 99 } });


        for(const agency of agencias){
            await transactionModel.findOneAndUpdate({
                agencia: agency
            },
                { $set: { agencia: 99 } }
            ).sort({'balance': -1});
        }
        
        const privateAccounts = await transactionModel
            .find({ 'agencia': 99 })
            .sort({ 'balance': -1 });

        response.status(200).send({privateAccounts});
    } catch (error) {
        response.status(500).send({ error });
    }
});

bankRouter.delete('/transactions/deleteAll', async(request, response) =>{
    try{
        const agencias = await transactionModel.distinct("agencia");

        for(let agency of agencias){
            await transactionModel.deleteMany({agencia: agency});
        }
        response.send({message: 'Everything deleted'});
    }catch(error){
        response.status(500).send({error})
    }
});
export { bankRouter };