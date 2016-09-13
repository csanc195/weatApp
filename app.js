var express = require("express");
var bodyParser = require("body-parser");
var app = express();


//parse incomming requests.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

//serve the static files if any
app.use(express.static(__dirname + "/public"));

//require the template engine
//define and set the template engine
////set the views engine
var handlebars = require("express-handlebars")
						.create({ defaultLayout: "main"});
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

// Include and use routes.
var routes = require("./routes/index");
app.use("/", routes);


//set the server app port
app.set("port", process.env.PORT || 3000);

//error handlers
//404
app.use(function(req,res,next){
	var error = new Error("resource not found");
	error.status = 404;
	next(error);
});

//fallthrough error handler
app.use(function(err, req, res, next){
	res.status(err.status || 500);
	res.send("error " + err.message +
		      " status " + err.status);
});

//Server listener
app.listen(app.get("port"), function(){
	console.log("Express server started and is running on http://localhost:" + app.get("port"));
});