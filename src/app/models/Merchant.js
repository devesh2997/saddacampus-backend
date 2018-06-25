var db = require('../lib/sadda-db');
var db_tables = db.tables;
var error_messages = require('../config/error_messages');
var db_utils = require('../lib/db-utils');
var uniqid = require('uniqid');
var Log = require('../lib/log');
var validator = require('../utility/validator');
var bcrypt = require('bcrypt');
var MobileNumber = require('../models/mobile_number');
var constants = require('./config/constants');

//checking for duplicate entries
//check for duplicate email, mobile number
var hasDuplicate = function(args, callback){
    var query = "SELECT * from " + db_tables.merchants.name + " WHERE email = '"+args.email+"' OR (country_code = '" + args.country_code + "' AND number = '"+ args.number + "')";
    db.get().query(query, function(err, result){
        if (err) {
            Log.e(err.toString());
            return callback(new Error(error_messages.UNKNOWN_ERROR));
        }
        if(result.length){
            return callback(null ,true);
        }
        else return callback(null, false);
    });
}

/**
 * Validates name, email, password, country_code, number, alternate_country_code, alternate_number
 * @param {Object} args
 * @param {String} args.name
 * @param {String} args.email
 * @param {String} args.password
 * @param {String} args.country_code
 * @param {String} args.number
 * @param {String} args.alternate_country_code
 * @param {String} args.alternate_number
 */
var validateArgs = function(args, callback){
	//validate name
	//length of name should be >5 and <100
	if(!validator.nameIsValid(args.name))
		return callback(new Error(error_messages.INVALID_NAME));

	//validate email
	if(!validator.emailIsValid(args.email))
		return callback(new Error(error_messages.INVALID_EMAIL));

	//validate password
	if(!validator.passwordIsValid(args.password))
		return callback(new Error(error_messages.INVALID_PASSWORD));

	//validate mobile number
	var mobileNumber = new MobileNumber({
		country_code: args.country_code,
		number: args.number
	});
	if(!mobileNumber.isValid())
		return callback(new Error(mobileNumber.validationMessage()));

	//validate alternate mobile number
	var alternateMobileNumber = new MobileNumber({
		country_code: args.alternate_country_code,
		number: args.alternate_number
	});
	if(!alternateMobileNumber.isValid())
		return callback(new Error(alternateMobileNumber.validationMessage()));

	hasDuplicate(args, function(err, hasDuplicate){
		if(err)
			return callback(err);
		else if(hasDuplicate)
			return callback(new Error(error_messages.DUPLICATE_MERCHANT));
		else
			return callback(null);
	});

}

/**
 * create a new merchant-
 * it validates all the arguments provided and returns appropriate error in case any validation fails.
 * returns Merchant{merchant_id,name, email, country_code, number, alternate_country_code, alternate_number, status} Object
 * @param {Object} args
 * @param {String} args.name
 * @param {String} args.email
 * @param {String} args.password - Atleast 6 characters long
 * @param {String} args.country_code
 * @param {String} args.number
 * @param {String} args.alternate_country_code
 * @param {String} args.alternate_number
 */
exports.create = function(args, callback){
	validateArgs(args, function(err){
		if(err)
			callback(err);
		else{
			var saltRounds = 10;
            args.merchant_id =  uniqid(args.email.substr(0,4)); //create unique merchant_id
            bcrypt.hash(args.password, saltRounds, function(err, hash) { // generated encrypted_password to be stored in DB
                args.encrypted_password = hash;
                args.table_name = db_tables.merchants.name;
                args.fields = db_tables.merchants.fields;
                args.values = [args.merchant_id, args.name, args.email, args.encrypted_password, args.country_code, args.number, args.alternate_country_code, args.alternate_number, constants.MERCHANT.status.active];
                var query = db_utils.query_creator.insert(args);
                db.get().query(query, args.values, function(err){
                    if (err){
                        Log.e(err.toString());
                        callback(new Error(error_messages.UNKNOWN_ERROR));
                    }else{
                        callback(null, {
                            Merchant: {
                                merchant_id: args.merchant_id,
                                name: args.name,
                                email: args.email,
								country_code: args.country_code,
								number: args.number,
								alternate_country_code: args.alternate_country_code,
								alternate_number: args.alternate_number,
								status: constants.MERCHANT.status.active
                            }
                        });
                    }

                });
            });
		}
	});
}

/**
 * find merchant by email
 * @param {Object} args
 * @param {String} args.email
 */
exports.findByEmail = function(args,callback){
	if(!validator.emailIsValid(args.email))
		callback(new Error(error_messages.INVALID_EMAIL));
	else{
		var query = "SELECT * FROM "+db_tables.merchants.name+" WHERE email = '"+args.email+"'";
        db.get().query(query, function(err,result){
            if(err){
                Log.e(err);
                callback(new Error(error_messages.UNKNOWN_ERROR));
            }else{
                callback(null, {
                    Merchant: result[0]
                });
            }
        });
	}
}
