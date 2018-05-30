var assert = require('assert');
var controller = require('../lib/controller');

describe('Controller', function(){
    describe('Send otp',function(){
        var request,response;
        before(function(){
            response = {
                send: function(message){
                    this.message = message;
                }
            };
        });
        it('send appropriate message',function(){
            controller.send_otp(request,response);
            assert.equal(response.message,'Not implemented: send otp');
        });
    });
});

assert.ok(true);
