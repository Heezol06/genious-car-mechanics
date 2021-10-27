const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;


const app = express()
const port = 5000


// middleware 
app.use(cors())
app.use(express.json())

//user: genius-car-machanics
//pass: IAGfu9Il2uFopjuI


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ihnag.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){

    try{
        await client.connect();
        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');


        // get api 
        app.get('/services', async( req, res ) =>{
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray();
            res.send(services)

        } )

        // get single service api 
        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;    
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id)}
            const service = await servicesCollection.findOne(query)
            res.json(service)
        })

        // post api 
        app.post('/services', async(req, res) =>{
            const services = req.body
            console.log('hit the post api', services);

            const result  = await servicesCollection.insertOne(services)
            console.log(result);
            res.json(result)
        })

        // delete api
        app.delete('/service/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result =  await servicesCollection.deleteOne(query)
            req.json(result);
        })
    }
    finally{
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Running Generous Server ')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})