var Business = require('./../../../app/models/_Business');

/**
 * Create a new business
 * @param {Object} args
 * @param {String} args.merchant_id
 * @param {String} args.business_id
 * @param {String} args.name
 * @param {String} args.address
 * @param {String} args.type
 * @param {String} args.gstin
 */
var Onboarding = function(args){
	this.startBusiness = function(callback){
		Business.create(args, function(err, result){
			var response = {};
            if(err){
                response.success = false;
                response.message = err.message;
            }
            else{
                response.success = true;
                response.Business = result.Business;
            }
            callback(null, response);
		});
	}
}

module.exports = Onboarding;
