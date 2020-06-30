import mongoose from 'mongoose';

const transactionSchema = mongoose.Schema({
    agencia: {
        type: Number,
        required: true
    },
    conta: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) {
                throw new Error("Negative value not permitted");
            }
        }
    }
})


const transactionModel = mongoose.model('transactions', transactionSchema);

export {transactionModel}