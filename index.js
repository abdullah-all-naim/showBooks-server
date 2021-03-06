const express = require('express')
const app = express()
const port = 5000
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));


const uri = `mongodb+srv://naim:${process.env.DB_PASS}@cluster0.u5omi.mongodb.net/${process.env.DB_PASS}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    // root
    app.get('/', (req, res) => {
        res.send('Hello World!')
    })
    const user = client.db("book").collection("user");
    const whoClicked = client.db("book").collection("click");
    app.post("/user", (req, res) => {
        const userAcc = req.body;
        user.insertOne(userAcc)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.post("/whoclicked", (req, res) => {
        const user = req.body;
        whoClicked.insertOne(user)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    app.get('/userinfo', (req, res) => {
        user.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    app.get('/userinfos', (req, res) => {
        user.find({token : req.query.token})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    app.get('/info', (req, res) => {
        whoClicked.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
});

app.listen(process.env.PORT || port)