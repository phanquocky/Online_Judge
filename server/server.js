const express = require("express");
const dotenv = require("dotenv")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const cors = require("cors")

dotenv.config()
const PORT = process.env.PORT || 3001;

const app = express();
app.use(morgan("dev"))

app.use(cors())

// For parsing application/json
app.use(express.json());
  
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const uri = "mongodb+srv://group01:group01@cluster-online-judgle.h2nfj9f.mongodb.net/?retryWrites=true&w=majority"

var MongoClient = require("mongodb").MongoClient;

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

require("./api-problem")(app, MongoClient, uri, "online-judgle");
require("./api-sample")(app, MongoClient, uri, "online-judgle");
require("./api-tag")(app, MongoClient, uri, "online-judgle");
require("./api-user")(app, MongoClient, uri, "online-judgle");
require("./api-submit")(app, MongoClient, uri, "online-judgle");

app.use("/submissions", require("./routes/routeSubmission"));
app.use("/contests", require("./routes/routeContest"));

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});


