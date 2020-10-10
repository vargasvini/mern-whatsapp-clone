import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';

const app = express();
const port = process.env.PORT || 9000;
const connection_url = "mongodb+srv://admin:7kf48wPpLvHIeDh7@cluster0.donhr.mongodb.net/whastappmerndb?retryWrites=true&w=majority";

mongoose.connect(connection_url,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.get('/', (req, res)=>{
    res.status(200).send('hello world')
});

app.post('/api/messages/new', (req,res) =>{
    const dbMessage = req.body;
    Messages.create(dbMessage, (err, data)=>{
        if(err)
            res.status(500).send(err)
        else
            res.status(201).send(data)
    });
});

app.listen(port, ()=>{
    console.log(`Listening on localhost:${port}`)
});