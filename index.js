const express = require('express');
const app = express();
const cors  = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pjcsd3j.mongodb.net/?retryWrites=true&w=majority`;
//console.log(uri)
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

  const serviceCollection = client.db('library_management').collection('service');
  const bookCollection = client.db('library_management').collection('book');
  const userAddToCart = client.db('library_management').collection('cart');
  const userDate = client.db('library_management').collection('date');


  //service
  app.get('/service',async(req,res) =>{
    const cursor = serviceCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  })
 //book category
  app.get('/book',async(req,res) =>{
    const cursor = bookCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  })

  app.get('/book/:id',async(req,res) =>{
    const id = req.params.id;
    console.log(id);
    const query = {_id: new ObjectId(id)}
    const user = await bookCollection.findOne(query);
    res.send(user);
  })

  // app.get('/book/:category_name',async(req,res) =>{
  //   const catego = req.params.id;
  //   console.log(category_n);
  //   const query = {category_name: new ObjectId(category_name)}
  //   const user = await bookCollection.findOne(query);
  //   res.send(user);
  // })
  
  app.post('/book' , async(req,res) =>{
    const user = req.body;
    console.log('new user : ' , user);
    const result = await bookCollection.insertOne(user);
    res.send(result);
  })


  app.put('/book/:id' , async(req,res) =>{
    const id = req.params.id;
    const user = req.body;
    console.log(id , user);
  
    const filter = {_id: new ObjectId(id)}
    const options = {upsert:true} 
    const updatedUser = {
      $set:{
       
        name:user.name,
        author:user.author,
        category_name:user.category_name,
        ratings:user.ratings,
        image:user.image 
        
      }
    }
    const result = await bookCollection.updateOne(filter , updatedUser ,options);
    res.send(result);
  })


  //add to cart
  app.get('/cart',async(req,res) =>{
    console.log(req.query.email);
    let query = {};
    if(req.query?.email){
      query = {email : req.query.email}
    }
    const cursor = userAddToCart.find(query);
    const result = await cursor.toArray();
    res.send(result);
  })
  
  app.get('/cart/:id',async(req,res) =>{
    const id = req.params.id;
    console.log(id);
    
    const query = {_id: new ObjectId(id)}
    const user = await userAddToCart.findOne(query);
    res.send(user);
  })

  
  
  app.post('/cart' , async(req,res) =>{
    const cart = req.body;
    console.log('new user : ' , cart);
    const result = await userAddToCart.insertOne(cart);
    res.send(result);
  })
  
  app.delete('/cart/:id' , async(req,res) =>{
    const id = req.params.id;
    console.log('Delete' , id);
    const query = {_id: new ObjectId(id)}
    const result = await userAddToCart.deleteOne(query);
    res.send(result);
  })
  
  //date
  app.post('/date' , async(req,res) =>{
    const date = req.body;
    console.log('new user : ' , date);
    const result = await userDate.insertOne(date);
    res.send(result);
  })
  



  
    //await client.connect();
    //await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//XFYUEicu17uh3w35
//library_management 