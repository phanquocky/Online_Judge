const route = require("express").Router()
const contestController = require("../controllers/contestController");

route.get("/", contestController.getAllContest);
route.get("/get-contest-by-name/:contest_name", contestController.getContestBasedOnName )
route.get("/contest-problems/:id", contestController.getProblemsContest);    
route.get("/:id", contestController.getInfoContest)
route.get("/my-contests/:id_user", contestController.getContestOfUser);
route.post("/", contestController.addContest);
route.post("/contest-problems", contestController.addProblemContest);
route.put("/:id", contestController.updateContest);
route.delete("/contest-problems/:id_contest/:id_problem", contestController.removeProblemContest);
route.delete("/:id", contestController.removeContest);


module.exports = route;