var db = require('../../../app/lib/sadda-db');
var db_tables = db.tables;
var Log = require('./../../../app/lib/log');
var error_messages = require("./../../../app/config/error_messages");

    //Count and return the no of users
exports.getUserCount = function(callback){
    var query = "SELECT COUNT(*) as userCount from " + db_tables.users.name ;
    db.get().query(query, function(err, result){
        if (err) {
            Log.e(err.toString());
            return callback(new Error(error_messages.UNKNOWN_ERROR));
        }else {
            var response = {
                success : true,
                message : "Total User Count",
                result : result
            }
            callback(null , response);
        }
    });
}


