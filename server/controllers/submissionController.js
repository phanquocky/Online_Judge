const MongoClient = require("mongodb").MongoClient;

const submissionController = {
    findAllSubmission: async (req, res) => {

        await MongoClient.connect(process.env.MONGODB_URL, function (err, db) {
            if (err) return res.send("0");
            const dbo = db.db(process.env.DB_NAME)
            const query = {};
            dbo.collection("submissions").find(query).toArray(function (err, result) {
                if (err) return res.send("-1");
                res.send(result);
                db.close();
            });
        });
    },

    findOneSubmission:async (req, res) => {
        const id = req.params.id;
        let ObjectId = require("mongodb").ObjectId;
        await MongoClient.connect(process.env.MONGODB_URL, function (err, db) {
            if (err) return res.send("0");
            const dbo = db.db(process.env.DB_NAME)
            
            let query
            try{
                query = { _id: ObjectId(id) };
            }catch{
                return res.send("-1")
            }

            dbo.collection("submissions").find(query).toArray(function (err, result) {
                if (err) return res.send("-1");
                res.json(result[0]);
                db.close();
            });
            
        });
    },

    addOneSubmission: async (req, res) => {
        const client = new MongoClient(process.env.MONGODB_URL)

        await client.connect()
        const db = client.db(process.env.DB_NAME)
        const collection = db.collection("submissions")

        collection.insertOne(req.body).then((result , err)=> {
            if (err) return res.send("-1")
            res.json(req.body)
        })
    },

    findSubmissionOfUser: async(req, res) => {
        const id = req.params.id;
        await MongoClient.connect(process.env.MONGODB_URL, function (err, db) {
            if (err) return res.send("0");
            const dbo = db.db(process.env.DB_NAME)
            
            let query
            try{
                query = { id_user: id };
            }catch{
                return res.send("-1")
            }

            dbo.collection("submissions").find(query).toArray(function (err, result) {
                if (err) return res.send("-1");
                res.json(result);
                db.close();
            });
            
        });
    }

}

module.exports = submissionController;