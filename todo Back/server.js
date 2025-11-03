const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const Mongodb_url = "mongodb+srv://rh_week8:Rhweek@8@cluster0.jzgmqwi.mongodb.net/?appName=Cluster0";
const mongoclient = new MongoClient(Mongodb_url);

const app = express();

const PORT = "1313";

app.use(cors());
app.use(express.json());

//http://localhost:1313/getdata
app.get("/getdata", async (req, res) => {
  await mongoclient.connect();
  const db = mongoclient.db("rtodo_data");
  const collection = db.collection("rdata");
  const data = await collection.find().toArray();
  // console.log(data);

  res.json({
    status: true,
    data: data,
  });
});

//http://localhost:1313/postdata
app.post("/postdata", async (req, res) => {
  const ldata = req.body;
  await mongoclient.connect();
  const db = mongoclient.db("rtodo_data");
  const collection = db.collection("rdata");
  const sdata = await collection.insertOne(ldata);

  res.json({
    status: true,
    message: "Data Sended",
  });
});

//http://localhost:1313/update
app.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const {message} = req.body;
   if (!message || message.trim() === "") {
     return;
   }
  await mongoclient.connect();
  const db = mongoclient.db("rtodo_data");
  const collection = db.collection("rdata");
  collection.updateOne({ _id: new ObjectId(id) }, { $set: { message: message } });

  res.json({ status: true, message: "Todo updated successfully" });
});
//http://localhost:1313/remove
app.delete("/remove/:id", async (req, res) => {
  const id = req.params.id;
  await mongoclient.connect();
  const db = mongoclient.db("rtodo_data");
  const collection = db.collection("rdata");
  const data = await collection.deleteOne({ _id: new ObjectId(id) });

  res.send({
    status: true,
    message: "Deleted ",
  });
});

//http://localhost:1313
app.listen(PORT, () => {
  console.log("just Started");
});
