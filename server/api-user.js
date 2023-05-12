module.exports = function(app, MongoClient, uri, dbName){
    app.get("/api-all-users", (req, res) => {
        MongoClient.connect(uri, function(err, db){
            if (err) throw err;
            var dbo = db.db(dbName);
            var query = {};
            var except = {projection: {
                password: 0
            }};
            dbo.collection("user").find(query, except).toArray(function (err, result) {
                if (err) throw err;
                res.json(result);
                db.close();
            });
        });
    });

    app.get("/api-submission-detail/:id", (req, res) => {
        var id = req.params.id;
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            var query = { id_user: id };
            dbo.collection("submissions").find(query).toArray(function (err, result) {
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

    app.get("/api-user/:id", (req, res) =>{
        var id = req.params.id;
        if (id.length != 24 || !isHex(id)) {
            res.json({message: "wrong id"});
            return;
        }
        var ObjectId = require("mongodb").ObjectId;
        id = ObjectId(id);
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            var query = { _id: id };
            var proj = {projection: {
                id_user: 1,
                user_name: 1,
                avatar_link: 1,
                about: 1
            }}
            dbo.collection("user").find(query, proj).toArray(function (err, result) {
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
    
    app.post("/signup", (req, res) => {
        var newDoc = req.body;
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            var query = { user_name: newDoc['user_name'] };
            dbo.collection("user").findOne(query, function (err, result) {
                db.close();
                if (result == null) {
                    MongoClient.connect(uri, function(err, db) {
                        if (err) throw err;
                        var dbo = db.db(dbName);
                        dbo.collection('user').insertOne(newDoc, function(err, obj) {
                            if (err) throw err;
                            db.close();
                            return res.send(obj);
                        });
                    });
                } else {
                    res.send('0');
                }
            });
        });
    });

    app.patch("/api-update-user", (req, res) => {
        var newDoc = req.body;
        var id = req.query.id
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
            dbo.collection("user").updateOne(query, newVal, function(err, obj) {
                if (err) throw err;
                res.send(obj);
                db.close();
            });
        });
    });

    function isHex(str) {
        var regex = /[0-9A-Fa-f]{6}/g;
        return str.match(regex);
    };

    app.get("/submission-filter", (req, res) =>{
        var q_prob
        var q_author
        var query = {};
        if(req.query.language != undefined) {
            query.language = req.query.language
        }
        if(req.query.verdict != undefined) {
            query.verdict = req.query.verdict
        }
        
        
        if(req.query.prob_name == undefined) {
            q_prob = {}
        }
        else {
            q_prob = {name: req.query.prob_name}
        }

        if(req.query.author_name == undefined) {
            q_author = {}
        }
        else {
            q_author = {user_name: req.query.author_name}
        }

        getIdAuthor(q_author, function(author) {
            var _author = author.toString()
            var author_id = _author.split(',')

            getIdProblem(q_prob, function(prob) {
                var _prob = prob.toString()
                var prob_id = _prob.split(',')

                if(Object.keys(q_author).length != 0) {
                    query.id_user = {$in: author_id}
                }
                if(Object.keys(q_prob).length != 0) {
                    query.id_problem = {$in: prob_id}
                }
                //console.log(query)
                MongoClient.connect(uri, function(err, db){
                    if (err) throw err;
                    var dbo = db.db(dbName);
                    dbo.collection("submissions").find(query).toArray(function(error, result) {
                        if (error) throw error
                        res.json(result)
                        db.close()
                    })
                });
            })
        })
    });

    function getIdAuthor(q_author, callback) {
        MongoClient.connect(uri, function(err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            dbo.collection("user").distinct("_id", q_author, function(error, result) {
                if (error) throw error;
                db.close();
                callback(result)
            });
        });
    };

    function getIdProblem(q_prob, callback) {   
        MongoClient.connect(uri, function(err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            dbo.collection("problem").distinct("_id", q_prob, function(error, result) {
                if(error) throw error;
                db.close();
                callback(result)
            });
        });
    }

    app.post('/signin', (req, res) => {
        var doc = req.body;
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            var query = { user_name: doc['user_name'], password: doc['password'] };
            var proj = { projection: { _id: 1} };
            dbo.collection('user').findOne(query, proj, function (err, obj) {
                db.close();
                if (obj == null) {
                    return res.json('0');
                } else {
                    return res.send(obj['_id']);
                }
            });
        });
    });
}