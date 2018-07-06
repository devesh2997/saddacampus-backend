var db = require('../../../app/lib/sadda-db');
var db_tables = db.tables;
var Log = require('./../../../app/lib/log');
var error_messages = require("./../../../app/config/error_messages");

var Users = function(){
   
    //Count and return the no of users 
    this.get_user_count = function(next){
        var query = "SELECT * from " + db_tables.users.name ;
        db.get().query(query, function(err, result){
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