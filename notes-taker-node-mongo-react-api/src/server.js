import express from "express"
import cors from "cors"
import "dotenv/config"

import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';



// config

const app = express()

const port = process.env.PORT || 5000


// middleWare

app.use(cors())

app.use(express.json())



// mongodb connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fwejy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//     // const collection = client.db("test").collection("devices");
//     const notesTakerNodeUsersCollection = client.db("notes-taker-node").collection("users");
//     console.log("db connected")
//     // perform actions on the collection object
//     // client.close();
// });


const run = async () => {
    try {
        await client.connect();
        console.log("db connected1");

        const notesTakerNodeCollection = client.db("notestakernode").collection("notes");



        // get api to read all users

        app.get('/notes', async (req, res) => {
            // console.log(req);

            const query = req.query
            console.log(query);

            const cursor = notesTakerNodeCollection.find(query)

            const results = await cursor.toArray()

            res.send(results)

        })

        //create notesTaker
        app.post('/notes', async (req, res) => {
            const data = req.body
            console.log(data);

            const result = await notesTakerNodeCollection.insertOne(data)

            res.send(result)
        })


        // update notes

        app.put('/notes/:id', async (req, res) => {

            const id = req.params.id


            // const query = { _id: ObjectId(id) };

            const filter = { _id: ObjectId(id) }
            const data = req.body

            console.log("from update", data)

            const options = { upsert: true };

            const updateNotes = {
                $set: {
                    // plot: `A harvest of random numbers, such as: ${Math.random()}`
                    userName: data.userName,
                    testData: data.testData,
                },
            };

            console.log("from put", id)

            const result = await notesTakerNodeCollection.updateOne(filter, updateNotes, options);

            res.send(result)

        })


        // delete notes

        app.delete('/notes/:id', async (req, res) => {

            const id = req.params.id

            const data = req.body
            const query = { _id: ObjectId(id) };



            console.log("from delete", data)

            // const options = { upsert: true };

            const result = await notesTakerNodeCollection.deleteOne(query);

            if (result.deletedCount === 1) {
                console.log("Successfully deleted one document.");
                res.send(result)
            } else {
                console.log("No documents matched the query. Deleted 0 documents.");
                res.send(result)
            }

        })



    }


    finally {
        // await client.close();
    }

}
run().catch(console.dir);





// server config

app.get("/", (req, res) => {
    res.send(` running my notestaker server`)

});


app.listen(port, () => {
    console.log("Listening to port", port)
})
