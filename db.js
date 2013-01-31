var mysql = require('mysql');

var connection;

exports.connect = function(data,callback) {
    connection = mysql.createConnection(data);
    connection.connect(callback);
};

exports.get = function(table, query, callback, columns) {
    if(columns == undefined){columns = '*';}
    return connection.query('SELECT columns FROM ' + table + 'WHERE' + query, callback);
}

exports.insert = function(table, data) {
    
};

exports.update = function(table, data) {
    
};

exports.delete = function(table, query, callback) {
    return connection.query('DELETE FROM' + table + 'WHERE' + query, callback);
};

exports.query = function(data) {
    var self = this;
    this.str = '';
  
    var parse = function(data, delim) {
        self.str += delim + ' ';

        if(data.key != undefined){self.str += data.key + ' ';}
        else{throw new Exception("No key specified.");}

        if(data.equals != undefined){self.str += '= \'' + data.equals + '\'';}
        else if(data.greaterThan != undefined){self.str += '> \'' + data.greaterThan + '\'';}
        else if(data.lessThan != undefined){self.str += '< \'' + data.lessThan + '\'';}
        else if(data.greaterThanOrEqual != undefined){self.str += '>= \'' + data.greaterThanOrEqualTo + '\'';}
        else if(data.lessThanOrEqual != undefined){self.str += '<= \'' + data.lessThanOrEqualTo + '\'';}
        else if(data.like != undefined){self.str += ' LIKE \'' + data.like + '\'';}
    };
    
    this.and = function(data) {
        parse(data,' AND');
        return self;
    };

    this.or = function(data) {
        parse(data,' OR');
        return self;
    }

    this.orderBy = function(data) {
        self.str += ""
        return self;
    }

    parse(data,'');

    return this;
};