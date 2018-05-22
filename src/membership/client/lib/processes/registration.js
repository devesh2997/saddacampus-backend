var NewUser = require('../models/new_user');

/**
 * Processes membership application (creates new user.)
 * @param {Object} args
 * @param {string} args.country_code
 * @param {string} args.number
 * @param {string} args.username 
 * @param {Object} args.profile_pic
 */

var Registration = function(args, next){

    this.callback = next;

    this.new_user = new NewUser(args);

    /**validate the arguments*/
    if(!this.new_user.isValid()){
        this.callback(new Error(this.mobile_number.validationMessage));
    }

    //check for existing mobile or username -> return failure if mobile, username exists
    //create uid
    //store user in database
    //return success or failure

};

module.exports = Registration;