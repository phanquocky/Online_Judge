const { query } = require("express");

module.exports = function (app, MongoClient, uri, dbName) {
    
    app.get('/get-all-tags', (req, res) => {
        MongoClient.connect(uri, function(err, db) {
            if (err) {
                return res.json([]);
            }
            var dbo = db.db(dbName);
            dbo.collection("tag").find({}).toArray(function (err, arr) {
                if (err) {
                    return res.json([]);
                }
                res.json(arr);
                db.close();
            });
        });
    });

    app.post('/add-tag/:id', (req, res) => {
        var ObjectId = require("mongodb").ObjectId;
        var id = ObjectId(req.params.id)
        var tag_id = req.query.tag_id
        var query = {
            id_tag: tag_id,
            id_problem: id
        }
        findProblembyID(id, function(result){
            if(result.length === 0) {
                return res.json({message: "problem id not found"})
            }
            findTagbyId(ObjectId(tag_id), function(_result) {
                if(_result.length === 0) {
                    return res.json({message: "tag id not found"})
                }
                findProblemTag(query, function(prop_tag) {
                    if(prop_tag.length != 0) {
                        return res.json({message: "tag already been added to this problem"})
                    }
                    MongoClient.connect(uri, function(err, client) {
                        if(err) throw err
                        var dbo = client.db(dbName)
                        dbo.collection("problem_tag").insertOne(query,  function (error, _res) {
                            if (error) throw error;
                            res.json({message: "success", result: _res});
                            client.close();
                        });
                    })
                    
                })
            })
        })
    })

    app.delete("/remove-all-tag/:id", async (req, res) => {
        let idProblem = req.params.id;
        let ObjectId = require("mongodb").ObjectId;

        try{
            idProblem = ObjectId(idProblem)
        }catch{
            return res.send("0")
        }
        
        await MongoClient.connect(process.env.MONGODB_URL, function (err, db) {
            if (err) return res.send("0");
            const dbo = db.db(process.env.DB_NAME)

            dbo.collection("problem_tag").deleteMany(
                {
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
    })

    app.get("/get-tag/:id", async (req, res)=> {
        let id = req.params.id;
        let ObjectId = require("mongodb").ObjectId;
        let tags = []

        try{
            id = ObjectId(id)
        }catch{
            return res.send("0")
        }
        console.log(id)
        await MongoClient.connect(process.env.MONGODB_URL, function (err, db) {
            if (err) return res.send("0");
            const dbo = db.db(process.env.DB_NAME)
            
            let query
            query = { id_problem: id };    

            dbo.collection("problem_tag").find(query).toArray(function (err, result) {
                if (err) return res.send("-1");
                
                result.map((item) => {
                    tags.push(item.id_tag)
                    })
                res.json(tags)
                dbo.close;
            })

        });    
    });

    app.get("/get-name-tag/:id", async(req, res) => {
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
            

            dbo.collection("tag").find(query).toArray(function (err, result) {
                if (err) return res.send("-1");
               
                res.json(result);
                db.close();
            });
            
        });
    })

    function findProblembyID(_id, callback) {
        MongoClient.connect(uri, function(err, client) {
            if (err) throw err
            var dbo = client.db(dbName)
            var query = {_id: _id}
            dbo.collection("problem").find(query).toArray(function (error, result) {
                if(error) throw error
                client.close()
                callback(result)
            })
        })
    }

    function findTagbyId(_id, callback) {
        MongoClient.connect(uri, function(err, client) {
            if (err) throw err
            var dbo = client.db(dbName)
            var query = {_id: _id}
            dbo.collection("tag").find(query).toArray(function (error, result) {
                if(error) throw error
                client.close()
                callback(result)
            })
        })
    }

    function findProblemTag(query, callback) {
        MongoClient.connect(uri, function(err, client) {
            if (err) throw err
            var dbo = client.db(dbName)
            dbo.collection("problem_tag").find(query).toArray(function (error, result) {
                if(error) throw error
                client.close()
                callback(result)
            })
        })
    }
    
}