export class Response{
	constructor(){
		this.statusCode;
		this.response;
	}
	status(status){
		this.statusCode = status;
		return this;
	}
	send(response){
		this.response =  response;
	}
}

export class Request{
	constructor(headers = {}, body = {}){
		this.headers = headers;
		this.body = body;
	}
}

