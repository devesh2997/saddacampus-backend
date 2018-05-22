var Router = require('./client/lib/router');
var db = require('../sadda-db');


var Membership = function(){

    this.router = Router;
}

module.exports = Membership;

