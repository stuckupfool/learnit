var db = require('../db.js');

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

    save: function() {
        db.insert(this.table, {username: this.username, email: this.email, password: this.password});
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

    //db.get(this.table, db.query({key: 'username', equals: this.username}).and({key: 'age', greaterThan:18});
    

    authenticate: function(username, password) {
        //var res = db.get(this.table, {username: username, util.hash(password)});
        res=null;
        if(res != null) {
            this.id = res[0].id;
            this.username = res[0].username;
            this.email = res[0].email;
            return this;
        }
        return null;
    }
};

exports.model = user;