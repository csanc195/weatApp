var express = require("express");
var router = express.Router();
<<<<<<< HEAD
var rubiera = require("../util/weatherReport.js");
=======
var rubiera = require("./weatherReport.js");
>>>>>>> refs/remotes/origin/master

//parse localhost and serve the home page
router.get("/", function(req,res,next){
	return res.render("home", {title: "Weather report|Home"});
});

router.post("/weatherReq", function(req,res,next){
	//get the zipcode param from the request
	var zip = req.body.zipcode;
	rubiera.get(zip, function(data){
		return res.send(data);
	});
});

module.exports  = router;