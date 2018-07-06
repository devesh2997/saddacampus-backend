var db = require('../../../app/lib/sadda-db');
var db_tables = db.tables;
var Log = require('./../../../app/lib/log');
var error_messages = require("./../../../app/config/error_messages");

var Users = function(){

    //Count and return the no of users
    this.getUserCount = function(next){
        var query = "SELECT COUNT(*) as userCount from " + db_tables.users.name ;
        db.get().query(query, function(err, result){
            if (err) {
                Log.e(err.toString());
                return next(new Error(error_messages.UNKNOWN_ERROR));
            }else {
                next(null , result[0]);
            }
        });
    }
}
exports.getUserCount = new Users().getUserCount;
