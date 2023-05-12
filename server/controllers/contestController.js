const MongoClient = require("mongodb").MongoClient;

const contestController = {
    addContest: async (req, res) => {
        const client = new MongoClient(process.env.MONGODB_URL)

        await client.connect()
        const db = client.db(process.env.DB_NAME)
        const collection = db.collection("contest")

        collection.insertOne(req.body).then((result , err)=> {
            if (err) return res.send("-1")
            res.json(req.body)
        })
    },
    addProblemContest: async (req, res) => {
        const client = new MongoClient(process.env.MONGODB_URL)

        await client.connect()
        const db = client.db(process.env.DB_NAME)
        const collection = db.collection("contest_problems")

        collection.insertOne(req.body).then((result , err)=> {
            if (err) return res.send("-1")
            res.json(req.body)
        })
    },
    getAllContest: async(req, res)=>{
        await MongoClient.connect(process.env.MONGODB_URL, function (err, db) {
            if (err) return res.send("0");
            const dbo = db.db(process.env.DB_NAME)
            const query = {public: true};
            dbo.collection("contest").find(query).toArray(function (err, result) {
                if (err) return res.send("-1");
                res.send(result);
                db.close(); 
            });
        });
    },
    getProblemsContest: async (req, res) => {
        const id = req.params.id;
        
        await MongoClient.connect(process.env.MONGODB_URL, function (err, db) {
            if (err) return res.send("0");
            const dbo = db.db(process.env.DB_NAME)
            
            let query
            query = { id_contest: id };
            

            dbo.collection("contest_problems").find(query).toArray(function (err, result) {
                if (err) return res.send("-1");
               
                res.json(result);
                db.close();
            });
            
        });
    },
    getInfoContest: async(req, res) => {
        let id = req.params.id;
        let ObjectId = require("mongodb").ObjectId;

        try{
            id = ObjectId(id)
        }catch{
            return res.send("0")
        }
        await MongoClient.connect(process.env.MONGODB_URL, function (err, db) {
            if (err) return res.send("0");
            const dbo = db.db(process.env.DB_NAME)
            
            let query
            query = { _id: id };
            

            dbo.collection("contest").find(query).toArray(function (err, result) {
                if (err) return res.send("-1");
               
                res.json(result);
                db.close();
            });
            
        });
    },

    getContestOfUser: async(req, res)=>{
        const id = req.params.id_user;
        await MongoClient.connect(process.env.MONGODB_URL, function (err, db) {
            if (err) return res.send("0");
            const dbo = db.db(process.env.DB_NAME)
            
            let query
            query = { id_author: id };
            

            dbo.collection("contest").find(query).toArray(function (err, result) {
                if (err) return res.send("-1");
               
                res.json(result);
                db.close();
            });
            
        });
    },

    updateContest: async(req, res)=>{
        let id = req.params.id;
        let ObjectId = require("mongodb").ObjectId;
        try{
            id  =  ObjectId(id);
        }catch{
            return res.send("-1")
        }
        
        await MongoClient.connect(process.env.MONGODB_URL, function (err, db) {
            if (err) return res.send("0");
            const dbo = db.db(process.env.DB_NAME)
            console.log(req.body)
            dbo.collection("contest").findOneAndUpdate(
                {_id: id},
                {
                    $set: {
                        name: req.body.name,
                        date: req.body.date,
                        time: req.body.time,
                        duration: req.body.duration,
                        id_author: req.body.id_author,
                        desc: req.body.desc,
                        public: req.body.public
                    }
                },
                    {new: true},
                    (err, result)=>{
                        if(err)  return res.send("0");
                        res.json(result.ok) 
                    }
                )     
        
        });
    },

    removeProblemContest: async(req, res) => {
        const idContest = req.params.id_contest;
        let idProblem = req.params.id_problem;
        console.log(idContest, idProblem)
        
        await MongoClient.connect(process.env.MONGODB_URL, function (err, db) {
            if (err) return res.send("0");
            const dbo = db.db(process.env.DB_NAME)

            dbo.collection("contest_problems").deleteOne(
                {
                    id_contest: idContest,
                    id_problem: idProblem
                }
            )
            .then(
                 (result)=>{
                    return res.json(result.deletedCount);
                 }
            )
            .catch(
                (err) =>{
                    return res.send("0")
                }
            )
        });
    },

    removeContest: async(req, res)=> {
        const idContest = req.params.id;

        let ObjectId = require("mongodb").ObjectId;
        let idContestOb;
        try{
            idContestOb = ObjectId(idContest);
        }
        catch{
            console.log("objectID")
            return res.send("0")
        }

        await MongoClient.connect(process.env.MONGODB_URL, function (err, db) {
            if (err) return res.send("0");
            const dbo = db.db(process.env.DB_NAME)

            dbo.collection("contest").deleteOne(
                {
                   _id : idContestOb
                }
            )
            .then(
                (result)=>{
                    if(result.deletedCount == 0) return res.send("0")
                    
                    let query
                    query = { id_contest: idContest };

                    dbo.collection("contest_problems").find(query).toArray((err, result)=>{
                        if(err) return res.send("0")
                        result.map((item)=>{
                            console.log(item.id_problem)
                            dbo.collection("contest_problems").deleteOne(
                                {
                                    id_contest: idContest,
                                    id_problem: item.id_problem
                                }
                            )
                            .then()
                            .catch((err)=>{
                                if(err) return res.send("0")
                            })
                        })
                    })
                    return res.json(result.deletedCount);

                }
            )
            .catch(
                (err)=>{
                    if(err) return res.send("0")
                }
            )
        }
        )
    },

    getContestBasedOnName: async(req, res)=>{
        let name = req.params.contest_name;
        name = name.split(' ').join('').split('-').join('').split('_').join('').toLowerCase();
        console.log(name)

        await MongoClient.connect(process.env.MONGODB_URL, function (err, db) {
            if (err) return res.send("0");
            const dbo = db.db(process.env.DB_NAME)
            const query = {public: true};
            dbo.collection("contest").find(query).toArray(function (err, result) {
                if (err) return res.send("-1");
                result = result.filter((item)=>{
                    if (item.name != null) {
                        let contestName = item.name.split(' ').join('').split('-').join('').split('_').join('').toLowerCase()
                        if(contestName == name) return true;
                    }
                    return false
                })
                
                console.log(result)
                res.send(result);
                db.close(); 
            });
        });
    }

}



module.exports = contestController;