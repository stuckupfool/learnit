var mysql = require('mysql');

var connection;

var credentials = {host: 'localhost', user: 'root', password: '', database: 'learnit'};

exports.connect = function(callback) {
    connection = mysql.createConnection(credentials);
    connection.connect(callback);
};

exports.add = function(table, data, callback) {
    return connection.query('INSERT INTO ' + table + ' SET ?',data,callback);
};

exports.remove = function(table, query, callback) {
    return connection.query('DELETE FROM ' + table + ' WHERE ' + query.str, callback);
};

exports.get = function(table, columns, query, callback) {
    return connection.query('SELECT ' + columns + ' FROM ' + table + ' WHERE' + query.str, callback);
};

exports.set = function(table, data, where, callback) {
    if(data.length == 0) {
        callback('No fields were specified to be updated');
        return;
    }

    var str = 'UPDATE ' + table + ' SET ';
    for(field in data) {
        str += field + ' = \'' + data[field] + '\', ';
    }
    str = str.slice(0,-2);

    //Need to check if they supplied a where.
    str += ' WHERE ' + where.str;

    return connection.query(str,callback);
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