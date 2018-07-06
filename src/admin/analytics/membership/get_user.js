var db = require('../../../app/lib/sadda-db');
var db_tables = db.tables;
var Log = require('./../../../app/lib/log');
var error_messages = require("./../../../app/config/error_messages");

//change the name of this file to UserAnalytics.
//dont export User object.
//export individual functions. This way you wont have to initialise everytime using new keyword.

var Users = function(){

    //Count and return the no of users
    this.get_user_count = function(next){//user camel-case for naming this function.
        var query = "SELECT * from " + db_tables.users.name ;
        db.get().query(query, function(err, result){//use count query for getting the number of users.
            if (err) {
                Log.e(err.toString());
                return next(new Error(error_messages.UNKNOWN_ERROR));
            }else {
                var user_length = {
                    length : result.length
                }
                next(null , user_length)
            }
        });
    }
}

module.exports = Users;
