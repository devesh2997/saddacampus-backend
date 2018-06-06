exports.res = () =>{
	var res = {
		statusCode: "",
		status: (status) => {
			this.statusCode = status;
			return this;
		},
		send : (response) => {
			return response;
		}
	};
	return res;
};

