/**
 * Utility for building queries
 * Dont forget to call build at the end of each use.
 */
var queryBuilder = {
	query : "",
	selectAll: function(){
		this.query = this.query + "SELECT * ";
		return this;
	},
	/**
	 * update table query
	 * @param {String} table_name
	 */
	update: function(table_name){
		this.query+= "UPDATE "+table_name+" ";
		return this;
	},
	/**
	 * set columns fields
	 * @param {Object} args
	 * @param {String} args.column Set the value of 'column' to this
	 */
	set: function(args){
		this.query+="SET ";
		var count = 0; //counter to check if 'AND' should be added to query or not
		for(var column in args){
			if(count++){
				this.query+=", "; //'AND' will not be added for only the first iteration of the for loop
			}
			if(args.hasOwnProperty(column)){
				this.query+=column+" = '"+args[column]+"'";
			}
		}
		this.query+=" ";
		return this;
	},
	/**
	 * insert into table query
	 * @param {String} table_name
	 */
	insertInto: function(table_name){
		this.query+="INSERT INTO "+table_name+" ";
		return this;
	},
	/**
	 * add columns to insert table query
	 * @param {Array} columns
	 */
	columns: function(columns){
		this.query+="(";
		for(var i=0;i<columns.length;i++){
			this.query+= columns[i];
			if(i === columns.length-1)
				this.query+=") ";
			else
				this.query+=", "
		}
		return this;
	},
	/**
	 * insert values place holder e.g-(?,?)
	 * send values to database as separate entity and not as part of query
	 */
	numOfValues: function(number_of_values){
		this.query+="VALUES ("
		while(number_of_values--){
			this.query+="?";
			if(number_of_values == 0)
				this.query+=") ";
			else
				this.query+=", ";
		}
		return this;
	},
	/**
	 * insert from tables into query
	 * @param {Array} tables
	 */
	from: function(tables){
		this.query+="FROM ";
		for(var i=0;i<tables.length;i++){
			this.query+= tables[i];
			if(i === tables.length-1)
				this.query+=" ";
			else
				this.query+=", "
		}
		return this;
	},
	/**
	 * Add where clause to check against multiple column values
	 * All should be equal (i.e - different conditions are separated by AND)
	 * @param {Object} args
	 * @param {String} args.column Value of column to check against
	 */
	whereAllEqual: function(args){
		this.query+="WHERE (";
		var count = 0; //counter to check if 'AND' should be added to query or not
		for(var column in args){
			if(count++){
				this.query+=" AND "; //'AND' will not be added for only the first iteration of the for loop
			}
			if(args.hasOwnProperty(column)){
				this.query+=column+" = '"+args[column]+"'";
			}
		}
		this.query+=") ";
		return this;
	},
	/**
	 * Add where clause to check against multiple column values
	 * Either one should be equal (i.e - different conditions are separated by OR)
	 * @param {Object} args
	 * @param {String} args.column Value of column to check against
	 */
	whereEitherEqual: function(args){
		this.query+="WHERE (";
		var count = 0; //counter to check if 'AND' should be added to query or not
		for(var column in args){
			if(count++){
				this.query+=" OR "; //'AND' will not be added for only the first iteration of the for loop
			}
			if(args.hasOwnProperty(column)){
				this.query+=column+" = '"+args[column]+"'";
			}
		}
		this.query+=") ";
		return this;
	},
	build: function(){
		var final_query = this.query;
		this.query = "";
		return final_query;
	}
}

module.exports = queryBuilder;
