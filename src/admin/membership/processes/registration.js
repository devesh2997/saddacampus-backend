var Admin = require('../../../app/models/Admin');

/**
 * creating a new admin user
 * @param {Object} args
 * @param {String} args.username
 * @param {String} args.email
 * @param {String} args.password
 * @param {String} args.role
 */
var Registration = function(args){
    //creates new admin
    this.register = function(callback){
        Admin.create(args, function(err, result){
            var response = {};
            if(err){
                response.success = false;
                response.message = err.message;
            }
            else{
                response.success = true;
                response.Admin = result.Admin;
            }
            callback(null, response);
        });
    }
}

module.exports = Registration;
