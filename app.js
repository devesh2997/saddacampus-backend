var express = require('express');
var chalk = require('chalk');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'devdas23',
    database : 'my_db'
  });
var app = express();

var port = process.env.PORT ||  3000;

var userRouter = express.Router();

userRouter.route('/Users')
    .get(function(req,res){
        var responseJson = {hello: "This is my api"};
        res.json(responseJson);
    });

app.use('/api', userRouter);

app.get('/', function(req,res){
    res.send("Welcome to my api");
});

app.listen(port, function(){
    console.log(chalk.green('Running on PORT: '+port));
});