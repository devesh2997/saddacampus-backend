var assert = require('assert');
var QueryBuilder = require('../utils/query-builder');

describe('Query Builder', function(){
	it('SELECT * FROM table ',function(){
		var query = QueryBuilder.selectAll().from(['table']).build();
		assert.ok(query === "SELECT * FROM table ",query);
	});
	it('SELECT * FROM table1, table2 ',function(){
		var query = QueryBuilder.selectAll().from(['table1','table2']).build();
		assert.ok(query === "SELECT * FROM table1, table2 ",query);
	});
	it('UPDATE table ',function(){
		var query = QueryBuilder.update('table').build();
		assert.ok(query === "UPDATE table ",query);
	});
	it('INSERT INTO table',function(){
		var query = QueryBuilder.insertInto('table').build();
		assert.ok(query === "INSERT INTO table ",query);
	});
	it('INSERT INTO table (column1, column2) ',function(){
		var query = QueryBuilder.insertInto('table').columns(['column1','column2']).build();
		assert.ok(query === "INSERT INTO table (column1, column2) ",query);
	});
	it('INSERT INTO table (column1, column2) VALUES (?, ?, ?) ',function(){
		var query = QueryBuilder.insertInto('table').columns(['column1','column2']).numOfValues(3).build();
		assert.ok(query === "INSERT INTO table (column1, column2) VALUES (?, ?, ?) ",query);
	});
	it("INSERT INTO table (column1, column2) VALUES (?, ?) WHERE (column1 = 'value1' AND column2 = 'value2') ",function(){
		var query = QueryBuilder.insertInto('table').columns(['column1','column2']).numOfValues(2).whereAllEqual({column1:'value1',column2:'value2'}).build();
		assert.ok(query === "INSERT INTO table (column1, column2) VALUES (?, ?) WHERE (column1 = 'value1' AND column2 = 'value2') ",query);
	});
	it("UPDATE table SET column1 = 'value1', column2 = 'value2' WHERE (column1 = 'value1' AND column2 = 'value2') ",function(){
		var query = QueryBuilder.update('table').set({column1: 'value1',column2: 'value2'}).whereAllEqual({column1: 'value1',column2: 'value2'}).build();
		assert.ok(query === "UPDATE table SET column1 = 'value1', column2 = 'value2' WHERE (column1 = 'value1' AND column2 = 'value2') ",query)
	})
	it("INSERT INTO table (column1, column2) VALUES (?, ?) WHERE (column1 = 'value1' OR column2 = 'value2') ",function(){
		var query = QueryBuilder.insertInto('table').columns(['column1','column2']).numOfValues(2).whereEitherEqual({column1:'value1',column2:'value2'}).build();
		assert.ok(query === "INSERT INTO table (column1, column2) VALUES (?, ?) WHERE (column1 = 'value1' OR column2 = 'value2') ",query);
	});
});
