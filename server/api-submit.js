module.exports = function (app, MongoClient, uri, dbName) {
    
    app.post('/submit-cpp', (req, res) => {
        const source = req.body['source'];
        const user = req.body['user'];
        const problem = req.body['problem'];
        const fileName = user + problem;
        const _when = new Date().toISOString();
        writeCpp(source, fileName);
        compileCpp(fileName);
        const fs = require('fs');
        getTimeLimit(problem, function(timeLimit) {
            if (fs.existsSync('./submit/' + fileName + '.exe') == false) {
                addSubmission(user, problem, _when, "cpp", 0, 0, unescape(source), 'CE', function(id_sm) {
                    return res.send(id_sm);
                });
            } else {
                compareResult(fileName, problem, timeLimit, function(result) {
                    var _ver;
                    if (result.correct == result.total) {
                        _ver = 'AC';
                    } else {
                        _ver = 'WA';
                    }
                    addSubmission(user, problem, _when, "cpp", 1024, 0, unescape(source), _ver, function(id_sm) {
                        res.send(id_sm);
                        if (_ver == 'AC') {
                            increaseSolved(user);
                        }
                    });
                });
            }
        });
    });
    
    function increaseSolved(user) {
        getSolved(user, function(s) {
            s += 1;
            var ObjectId = require("mongodb").ObjectId;
            MongoClient.connect(uri, function(err, db) {
                if (err) throw err;
                var dbo = db.db(dbName);
                var query = { _id: ObjectId(user) };
                var doc = { solved: s };
                var newVal = { $set: doc };
                dbo.collection("user").updateOne(query, newVal, function(err, obj) {
                    if (err) throw err;
                    db.close();
                });
            });
        });
    }
    
    function getSolved(user, callback) {
        var ObjectId = require("mongodb").ObjectId;
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            var query = { _id: ObjectId(user) };
            var proj = { solved: 1 };
            dbo.collection("user").findOne(query, function (err, res) {
                if (err) throw err;
                if (res != null) {
                    if (isNaN(res['solved'])) {
                        callback(0);
                    } else {
                        callback(parseInt(res['solved']));
                    }
                } else {
                    callback(0);
                }
                db.close();
            });
        });
    }
    
    function addSubmission(_user, _prob, _when, _lang, _mem, _time, _src, _ver, callback) {
        var obj = {
            id_user: _user,
            id_problem: _prob,
            when: _when,
            language: _lang,
            memory: _mem,
            time: _time,
            source: _src,
            verdict: _ver
        };
        MongoClient.connect(uri, function(err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            dbo.collection("submissions").insert(obj, function(err, res) {
                if (err) {
                    callback("");
                    return;
                }
                db.close();
                callback(res['insertedIds']['0'].toString());
            });
        });
    }
    
    function getTimeLimit(problem, callback) {
        var ObjectId = require("mongodb").ObjectId;
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            var query = { _id: ObjectId(problem) };
            var proj = { projection: {time_limit: 1} };
            dbo.collection("problem").findOne(query, proj)
                .then(function(doc) {
                    if (!doc) {
                        callback(0);
                        return;
                    }
                    callback(doc['time_limit']);
                });
        });
    }
    
    async function compareResult(fileName, problem, timeLimit, callback) {
        const cp = require('child_process');
        const exePath = 'submit\\' + fileName + '.exe';
        var child = cp.spawn(exePath, ['--from=markdown', '--to=html'], {timeout: timeLimit});
        MongoClient.connect(uri, function(err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            var query = { id_problem: problem, is_eg: "false" };
            var proj = { projection: {input: 1, output: 1} };
            dbo.collection("sample").find(query, proj).toArray(function(err, arr) {
                if (err) throw err;
                if (arr != null) {
                    var result = {
                        correct: 0,
                        total: arr.length
                    };
                    for (let i = 0; i < arr.length; i++) {
                        const answer = arr[i]['output'];
                        child.stdin.write(arr[i]['input']);
                        child.stdout.on('data', function(data) {
                            if (data == answer) { 
                                result.correct += 1;
                            }
                            child.stdin.end();
                            if (i == arr.length - 1) {
                                callback(result);
                            }
                        });
                    }
                } else {
                    var result = {
                        correct: 0,
                        total: 0
                    };
                    callback(result);
                }
            });
        });
        
    }
    
    function writeCpp(source, fileName) {
        const fs = require('fs');
        fs.writeFile('./submit/' + fileName + '.cpp', unescape(source), err => {});
    }
    
    function removeOldExe(path) {
        const fs = require('fs');
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
    }
    
    function compileCpp(fileName) {
        var exec = require('child_process').exec;
        const sourcePath = 'submit\\' + fileName + '.cpp';
        const exePath = 'submit\\' + fileName + '.exe';
        removeOldExe(exePath);
        const cmd = 'g++.exe -o ' + exePath + ' ' + sourcePath;
        exec(cmd, function(err, data) {});
    }
}