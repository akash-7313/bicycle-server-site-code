const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// my db
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fltdt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("cycleStore");
    const productsInfo = database.collection("products");
    const orderCollection = database.collection("orders");
    const reviewCollection = database.collection("reviews");
    const adminDetails = database.collection("admin");

    //   make admin
    app.post("/admin", async (req, res) => {
      const newAdmin = req.body;
      const result = await adminDetails.insertOne(newAdmin);
      res.json(result);

      // console.log("got new admin", req.body);
      // console.log("added admin", result);
    });

    //   get admin
    app.get("/admin", async (req, res) => {
      const cursor = adminDetails.find({});
      const result = await cursor.toArray();
      res.send(result);

      // console.log(result);
    });

    // GET All product API
    app.get("/allProducts", async (req, res) => {
      const cursor = productsInfo.find({});
      const result = await cursor.toArray();
      res.send(result);

      // console.log(result);
    });

    // Get a specific products
    app.get("/allProducts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productsInfo.findOne(query);
      res.send(product);

    //   console.log("get query", query);
    //   console.log("load product with id: ", id);
    });

    // POST API
    app.post("/addNewProduct", async (req, res) => {
      const newProduct = req.body;
      const result = await productsInfo.insertOne(newProduct);
      res.json(result);

      // console.log("got new product", req.body);
      // console.log("added product", result);
    });

    // Review POST API
    app.post("/addReview", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.json(result);

      // console.log(review);
      // console.log(result);
    });

    //   get all review 
    app.get("/review", async (req, res) => {
      const cursor = reviewCollection.find({});
      const result = await cursor.toArray();
      res.send(result);

      // console.log(result);
    });


    // Order POST API
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.json(result);

      // console.log(order);
      // console.log(result);
    });

    // get all order
    app.get("/allOrders", async (req, res) => {
      const cursor = orderCollection.find({});
      const result = await cursor.toArray();
      res.send(result);

      // console.log(result);
    });


    // get order by specific email address
    app.get("/myOrders/:email", async (req, res) => {
      const query = { email: req.params.email };
      const result = await orderCollection.find(query).toArray();
      res.send(result);

      // console.log(req.params);
      // console.log(result);
    });

    // product DELETE API
    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsInfo.deleteOne(query);
      res.json(result);

      // console.log("deleting order with id ", result);
    });

    // order DELETE API
    app.delete("/myOrders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);

      // console.log("deleting order with id ", result);
    });

    // Update pending status
    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const updatedStatus = req.body;
      // console.log('body', req.body);
      // console.log('id', id);
      const filter = { _id: ObjectId(id) };

      const updateOrderStatus = {
        $set: {
          status: updatedStatus.status,
        },
      };
      const result = await orderCollection.updateOne(filter, updateOrderStatus);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("my bi-cycle server is running");
});

app.listen(port, () => {
  console.log("Server running at port", port);
});
