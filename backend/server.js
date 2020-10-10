import express from 'express';
import mongoose from 'mongoose';
import Messages from './collections/dbMessages.js';
import Pusher from 'pusher';

const app = express();
app.use(express.json())
app.use((req,res, next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "*")
    next();
});

const port = process.env.PORT || 9000;
const connection_url = "mongodb+srv://admin:7kf48wPpLvHIeDh7@cluster0.donhr.mongodb.net/whastappmerndb?retryWrites=true&w=majority";

mongoose.connect(connection_url,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const pusher = new Pusher({
    appId: '1088141',
    key: '4af0d494c585654912b2',
    secret: '35a1bd016f3669bc0116',
    cluster: 'us2',
    encrypted: true
});

const db = mongoose.connection;

db.once('open', ()=>{
    console.log('DB Connected')
    const msgCollection = db.collection('messagecontents')
    const changeStream = msgCollection.watch()

    changeStream.on('change', (change)=>{
        console.log("A change occurred")
        if(change.operationType === "insert"){
            const messageDetails = change.fullDocument
            pusher.trigger("messages", "inserted", {
                name: messageDetails.name,
                message: messageDetails.message
            });
        }else{
            console.log("Error triggering pusher")
        }
    });
});

app.get('/', (req, res)=>{
    res.status(200).send('hello world')
});

app.get('/api/messages/sync', (req,res) =>{
    Messages.find((err, data)=>{
        if(err)
            res.status(500).send(err)
        else
            res.status(200).send(data)
    });
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