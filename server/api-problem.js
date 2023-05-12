module.exports = function (app, MongoClient, uri, dbName) {

    app.get("/api-all-problems", (req, res) => {
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            var query = {
                public: true
            };
            var proj = {
                projection: {
                    name: 1,
                    difficulty: 1,
                    solved: 1
                }
            };
            dbo.collection("problem").find(query, proj).toArray(function (err, result) {
                if (err) throw err;
                res.json(result);
                db.close();
            });
        });
    });
    
    app.get("/api-my-problem/:user_id", async(req, res) => {
        let id = req.params.user_id;
       
        await MongoClient.connect(process.env.MONGODB_URL, function (err, db) {
            if (err) return res.send("0");
            const dbo = db.db(process.env.DB_NAME)
            
            let query
            query = { id_author: id };
            

            dbo.collection("problem").find(query).toArray(function (err, result) {
                if (err) return res.send("-1");
               
                res.json(result);
                db.close();
            });
            
        });
    } )

    app.get("/api-problem-by-id/:id", (req, res) => {
        var id = req.params.id;
        if (id.length != 24 || !isHex(id)) {
            res.json([]);
            return;
        }
        var ObjectId = require("mongodb").ObjectId;
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            var query = { _id: ObjectId(id) };
            dbo.collection("problem").find(query).toArray(function (err, result) {
                if (err) throw err;
                if (result != null) {
                    res.json(result);
                } else {
                    res.json([]);
                }
                db.close();
            });
        });
    });

    

    app.get("/api-search-problem", (req, res) => {
        var qName = req.query["name"];
        if (typeof qName == 'undefined') {
            qName = "";
        }
        var qAuthorName = req.query["author"];
        if (typeof qAuthorName == 'undefined') {
            qAuthorName = "";
        }
        var qDiff = req.query["diff"];
        if (typeof qDiff != 'undefined') {
            qDiff = parseInt(qDiff);
        } else {
            qDiff = 999999;
        }
        var qTag = req.query["tag"];
        if (typeof qTag == 'undefined') {
            qTag = "";
        }
        getProblemByName(qName, function (problemByName) {
            var data = [];
            addUniqueJSON(data, problemByName);
            getIdAuthor(qAuthorName, function (idAuthor) {
                getProblemByIdAuthor(idAuthor, function (problemByAuthor) {
                    addUniqueJSON(data, problemByAuthor);
                    getProblemByDifficulty(qDiff, function (problemByDiff) {
                        addUniqueJSON(data, problemByDiff);
                        getIdTag(qTag, function (idTag) {
                            getProblemByIdTag(idTag, function (problemByTag) {
                                addUniqueJSON(data, problemByTag);
                                res.json(data);
                            });
                        });
                    });
                });
            });
        });
    });

    // app.get("/get-name-problem/:id", async(req, res) => {
    //     let id = req.params.id;
    //     let ObjectId = require("mongodb").ObjectId;
        
    //     try{
    //         id = ObjectId(id)
    //     }catch{
    //         res.send("0")
    //     }

    //     await MongoClient.connect(process.env.MONGODB_URL, function (err, db) {
    //         if (err) return res.send("0");
    //         const dbo = db.db(process.env.DB_NAME)
            
    //         let query
    //         query = { _id: id };
            

    //         dbo.collection("problem").find(query).toArray(function (err, result) {
    //             if (err) return res.send("-1");
               
    //             res.json(result[0].name);
    //             db.close();
    //         });
            
    //     });
    // })
    
    
    
    function isHex(str) {
        var regex = /[0-9A-Fa-f]{6}/g;
        return str.match(regex);
    }

    function getProblemByName(qName, callback) {
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            var query = { name: qName };
            dbo.collection("problem").find(query).toArray(function (err, result) {
                if (err) throw err;
                db.close();
                callback(result);
            });
        });
    }

    function getIdAuthor(qAuthorName, callback) {
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            var query = { user_name: qAuthorName };
            var project = { projection: { _id: 1 } };
            dbo.collection("user").findOne(query, project, function (err, result) {
                db.close();
                if (result == null) {
                    callback(null);
                    return;
                }
                callback(result["_id"].toString());
            });
        });
    }

    function getIdTag(qTag, callback) {
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            var query = { name: qTag };
            var project = { projection: { _id: 1 } };
            dbo.collection("tag").findOne(query, project, function (err, result) {
                db.close();
                if (result == null) {
                    callback(null);
                    return;
                }
                callback(result["_id"]);
            });
        });
    }

    function getProblemByIdAuthor(idAuthor, callback) {
        if (idAuthor == null) {
            callback(null);
            return;
        }
        var ObjectId = require("mongodb").ObjectId;
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            var query = { id_author: idAuthor };
            dbo.collection("problem").find(query).toArray(function (err, result) {
                if (err) throw err;
                db.close();
                callback(result);
            });
        });
    }

    function getProblemByDifficulty(diff, callback) {
        var ObjectId = require("mongodb").ObjectId;
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            var query = { difficulty: { $gte: diff } };
            dbo.collection("problem").find(query).toArray(function (err, result) {
                if (err) throw err;
                db.close();
                callback(result);
            });
        });
    }

    function addUniqueJSON(arr, newArr) {
        if (newArr == null) {
            return;
        }
        for (const jsonNew of newArr) {
            var temp = JSON.stringify(jsonNew);
            var exist = false;
            for (const jsonOld of arr) {
                if (temp == JSON.stringify(jsonOld)) {
                    exist = true;
                    break;
                }
            }
            if (!exist) {
                arr.push(jsonNew);
            }
        }
    }

    function getProblemByIdTag(idTag, callback) {
        if (idTag == null) {
            callback(null);
            return;
        }
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            dbo.collection("problem_tag").aggregate([
                {
                    $lookup: {
                        from: "problem",
                        localField: 'id_problem',
                        foreignField: '_id',
                        as: 'details'
                    }
                },
                {
                    $unwind: "$details"
                }
            ]).toArray(function (err, result) {
                if (err) throw err;
                db.close();
                var ret = [];
                if (result != null) {
                    for (const json of result) {
                        ret.push(json["details"]);
                        callback(ret);
                        return;
                    }
                }
                callback(null);
            });
        });
    }

    app.post("/post-problem/:id_author", async (req, res) =>{
        var id = req.params.id_author;
        if (id.length != 24 || !isHex(id)) {
            res.json([]);
            return;
        }
        var ObjectId = require("mongodb").ObjectId;
        MongoClient.connect(uri, function(err, db){
            if (err) throw err;
            var dbo = db.db(dbName);
            var data = req.body;
            data.id_author = ObjectId(id);
            dbo.collection("problem").insertOne(data,  function (err, result) {
                if (err) throw err;
                res.json(result);
                db.close();
            });
        });
    });
    
    app.get("/api-delete-problem/:id", (req, res) => {
        var id = req.params.id;
        if (id.length != 24 || !isHex(id)) {
            res.send('0');
            return;
        }
        var ObjectId = require("mongodb").ObjectId;
        MongoClient.connect(uri, function(err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            var query = { _id: ObjectId(id) };
            dbo.collection("problem").deleteOne(query, function(err, obj) {
                if (err) throw err;
                res.send('1');
                db.close();
            });
        });
    });
    
    app.post("/api-update-problem", (req, res) => { // update a problem
        var newDoc = req.body;
        var id = req.query.id;
        if(!id) {
            return res.send("_id not found")
        }
        if (id.length != 24 || !isHex(id)) {
            res.send('0');
            return;
        }
        var ObjectId = require("mongodb").ObjectId;
        MongoClient.connect(uri, function(err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            var query = { _id: ObjectId(id) };
            var newVal = {$set: newDoc};
            dbo.collection("problem").updateOne(query, newVal, function(err, obj) {
                if (err) throw err;
                res.send(obj);
                db.close();
            });
        });
    });
}