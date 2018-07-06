var db = require('../../../app/lib/sadda-db');
var db_tables = db.tables;

var Users = function(){
   
    //Count and return the no of users 
    this.get_user_count = function(next){
        var query = "SELECT * from " + db_tables.users.name ;
        db.get().query(query, function(err, result){
            if (err) {
                return err;
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