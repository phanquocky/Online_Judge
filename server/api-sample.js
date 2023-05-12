module.exports = function (app, MongoClient, uri, dbName) {
    
    app.post('/api-add-sample', (req, res) => { // add a sample
        var newDoc = req.body;
        var ObjectId = require("mongodb").ObjectId;
        MongoClient.connect(uri, function(err, db) {
            if (err) {
                res.send('0');
                return;
            }
            var dbo = db.db(dbName);
            dbo.collection("sample").insertOne(newDoc, function(err, suc) {
                if (err) {
                    res.send('0');
                    return;
                }
                res.send('1');
                db.close();
            });
        });
    });
    
    app.post("/api-update-sample", (req, res) => { // update a sample
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
            dbo.collection("sample").updateOne(query, newVal, function(err, obj) {
                if (err) throw err;
                res.send(obj);
                db.close();
            });
        });
    });
    
    function isHex(str) {
        var regex = /[0-9A-Fa-f]{6}/g;
        return str.match(regex);
    }
    
    app.get("/api-delete-sample/:id", (req, res) => {
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
            dbo.collection("sample").deleteOne(query, function(err, obj) {
                if (err) throw err;
                res.send('1');
                db.close();
            });
        });
    });
    
    app.get("/api-judgle-sample-by-problem-id/:id", (req, res) => {
        var id = req.params.id;
        if (id.length != 24 || !isHex(id)) {
            res.json([]);
            return;
        }
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            var query = { id_problem: id, is_eg: "false" };
            var proj = { projection: {input: 1, output: 1}};
            dbo.collection("sample").find(query, proj).toArray(function (err, result) {
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
    
    app.get("/api-sample-by-problem-id/:id", (req, res) => {
        var id = req.params.id;
        if (id.length != 24 || !isHex(id)) {
            res.json([]);
            return;
        }
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            var query = { id_problem: id, is_eg: "true" };
            var proj = { projection: {input: 1, output: 1}};
            dbo.collection("sample").find(query, proj).toArray(function (err, result) {
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
    
    app.get('/api-all-tests', (req, res) => {
        var id_prob = req.query.id_problem;
        if (!id_prob) {
            return res.send("id_problem not found")
        }
        if (id_prob.length != 24 || !isHex(id_prob)) {
            res.send('0');
            return;
        }
        var ObjectId = require("mongodb").ObjectId;
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            var query = { id_problem: id_prob };
            dbo.collection("sample").find(query).toArray(function (err, result) {
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
}