import express from 'express';

const bankRouter = express();


bankRouter.get('/test', () => console.log('working'));


export default bankRouter;