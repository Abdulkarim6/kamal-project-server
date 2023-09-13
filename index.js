const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const DB_USER = 'KamalDB'
const DB_PASSWORD = 'SRBLejEdBvcCxe0N'

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.rlbdud2.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true, }
});

async function run() {
    try {
        const photosCollection = client.db("kamalPortfolio").collection("photos");

        //post photos data to DB from client code
        app.post("/photo", async (req, res) => {
            const photo = req.body;
            const result = await photosCollection.insertOne(photo);
            res.send(result);
        });

        app.get('/photos', async (req, res) => {
            const query = {};
            const result = await photosCollection.find(query).toArray();
            res.send(result);
        });

        //deleta a photo from DB action to client code
        app.delete('/photo/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await photosCollection.deleteOne(query);
            res.send(result)
        });

        /* Photo info update  */
        app.patch('/addPhotoNewInfo', async (req, res) => {
            const photoNewInfo = req.body;
            const id = photoNewInfo?.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    title: photoNewInfo?.title,
                    Description: photoNewInfo?.Description
                },
            };
            const result = await photosCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send("Hospital server code start")
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

