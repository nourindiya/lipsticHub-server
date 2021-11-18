const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()

const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000

// miidle aware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mcosy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('database connected');
        const database = client.db("lipsticWorld")
        const productsCollection = database.collection("products")
        const reviewsCollection = database.collection("reviews")
        const ordersCollection = database.collection("orders")



        //  Get API
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({}).sort({ _id: -1 });
            const products = await cursor.toArray();
            res.send(products)
        })


        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product)
            res.json(result)
        })

        // Reviews
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        // booking
        app.get('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await productsCollection.findOne(query)
            res.send(product);
        });



        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order)
            // console.log(result);
            res.json(result);
        });


    }
    finally {

    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Running lipstic-world')
})

app.listen(port, () => {
    console.log('Running server', port);
})