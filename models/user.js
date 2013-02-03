var db = require('../db');

var user = function(data) {
    return this.constructor(data);
};

user.prototype = {
    table: 'users',

    id: null,
    username: null,
    email: null,
    password: null,

    constructor: function(data) {
        this.username = data.username == undefined ? null : data.username;
        this.email = data.email == undefined ? null : data.email;
        this.password = data.password == undefined ? null : data.password;
        return this;
    },

    save: function(callback) {
        var self = this;
        db.connect(function(err) {
                if(err != undefined){throw err;}
                db.add(self.table, {username: self.username, email: self.email, password: self.password}, callback);
            });
    },

    update: function() {
        if(this.id == null){return false;}
        db.update(this.table, {username: this.username, email: this.email, password: this.password});
        return true;
    },

    delete: function() {
        if(this.id == null){return false;}
        db.delete(this.table, {id: this.id});
        return true;
    },

    authenticate: function(username, password, callback) {
        var self = this;
        db.connect(function (err) {
                var q = db.query({'key':'username', equals:username}).and({'key':'password', equals:password});
                db.get('users','*',q,function(err, rows) {
                        if(err != undefined){callback(err,0);}
                        else if(rows.length == 1) {
                            self.username = username;
                            self.password = password;
                            callback(null,1);
                        }
                        else if(rows.length == 0) {
                            callback('incorrect credentials for '+username,0);
                        }
                    });
            });
        return null;
    }
};

exports.model = user;