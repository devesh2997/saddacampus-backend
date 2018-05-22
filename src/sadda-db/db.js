var mysql = require('mysql')
  , async = require('async')
  , db_config = require('./db_config')
  , db_tables = require('./db_tables');
  

var PRODUCTION_DB = db_config.PROD_DATABASE
  , TEST_DB = db_config.TEST_DATABASE;

exports.MODE_TEST = 'mode_test';
exports.MODE_PRODUCTION = 'mode_production';

var state = {
  pool: null,
  mode: null,
}

exports.connect = function(mode, done) {
  state.pool = mysql.createPool({
    host: db_config.HOST,
    user: db_config.USER,
    password: db_config.PASSWORD,
    database: mode === exports.MODE_PRODUCTION ? PRODUCTION_DB : TEST_DB
  });

  state.mode = mode;
  done();
}

exports.get = function() {
  return state.pool;
}

exports.fixtures = function(data) {
  var pool = state.pool;
  if (!pool) return done(new Error('Missing database connection.'));

  var names = Object.keys(data.tables);
  async.each(names, function(name, cb) {
    async.each(data.tables[name], function(row, cb) {
      var keys = Object.keys(row)
        , values = keys.map(function(key) { return "'" + row[key] + "'" });

      pool.query('INSERT INTO ' + name + ' (' + keys.join(',') + ') VALUES (' + values.join(',') + ')', cb);
    }, cb);
  }, done);
}

exports.drop = function(tables, done) {
  var pool = state.pool;
  if (!pool) return done(new Error('Missing database connection.'));

  async.each(tables, function(name, cb) {
    pool.query('DELETE FROM ' + name, cb);
  }, done);
}

exports.dropTable = function(table, done){
  var pool = state.pool;
  pool.query('DELETE FROM '+table, function(error){
    if(error)
      console.log(error);
  });
}

exports.tables = db_tables;