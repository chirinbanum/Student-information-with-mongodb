const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const app = express();
const port = 3002;

app.use(bodyParser.urlencoded({ extended: true }));

const mongoUrl = "mongodb://localhost:27017";
const dbName = "myweb";
let db;

MongoClient.connect(mongoUrl)
    .then((client) => {
        db = client.db(dbName);
        console.log(`Connected to MongoDB: ${dbName}`);
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

const loginRoutes = require('./insertRouter');
const updateRoutes = require('./updateRouter');
const deleteRoutes = require('./deleteRouter');

app.use(express.static(__dirname));
app.use('/', loginRoutes);
app.use('/', updateRoutes);
app.use('/', deleteRoutes);

app.post("/insert", async (req, res) => {
    const { name, age, mobile, mailid } = req.body;
    console.log("Received data for insertion:", name, age, mobile, mailid);
    if (!db) {
        res.status(500).send("Database not initialized");
        return;
    }
    try {
        const result = await db.collection("items").insertOne({ name, age, mobile, mailid });
        console.log("Number of documents inserted:", result.insertedCount);
        res.redirect("/insert");
    } catch (err) {
        console.error("Error inserting data:", err);
        res.status(500).send("Failed to insert data");
    }
});

app.post("/update", async (req, res) => {
    const { name, age, mobile, mailid } = req.body;
    if (!db) {
        res.status(500).send("Database not initialized");
        return;
    }
    try {
        const result = await db.collection("items").updateOne(
            { name: name },
            { $set: { age, mobile, mailid } }
        );
        if (result.modifiedCount === 1) {
            console.log("Document updated successfully");
            res.redirect("/report");
        } else {
            console.log("Document not found for update");
            res.status(404).send("Document not found for update");
        }
    } catch (err) {
        console.error("Error updating data:", err);
        res.status(500).send("Failed to update data");
    }
});

app.post("/delete", async (req, res) => {
    const { name } = req.body;
    if (!db) {
        res.status(500).send("Database not initialized");
        return;
    }
    try {
        const result = await db.collection("items").deleteMany({ name: name });
        if (result.deletedCount > 0) {
            console.log("Document(s) deleted successfully");
            res.redirect("/report");
        } else {
            console.log("Document not found for deletion");
            res.status(404).send("Document not found for deletion");
        }
    } catch (err) {
        console.error("Error deleting data:", err);
        res.status(500).send("Failed to delete data");
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
