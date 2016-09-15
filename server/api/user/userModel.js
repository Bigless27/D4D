var mongoose = require('mongoose');
var Schema = mongoose.Schema
var bcrypt = require('bcrypt') 
var jwt = require('express-jwt');



var transactionsSchema = new Schema({
    name: {type: String},
    amount: {type: Number},
    date: {type: Date},
    status: {type: String}
})

var UserSchema = new Schema({
    email: { type: String, unique: true, required: true, index: true },
    password: { type: String},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true  },
    address: {type: String},
    zip: {type: Number},
    city: {type: String},
    state: {type: String},
    phone: {type: Number},
    dateJoined: { type: Date, default: Date.now },
    facebook: {
        id: String,
        token: String,
        email: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    transactions: [transactionsSchema]
});

UserSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next();

    this.password = this.encryptPassword(this.password);
    next()
})

UserSchema.methods = {
    //check the passwords on sigin
    authenticate: function(plainTextPword, cb) {
        return bcrypt.compare(plainTextPword, this.password, function(err, isMatch){
            if(err) return cb(err)
            cb(err, isMatch)
        })
    },

    //hash the password
    encryptPassword: function(plainTextPword) {
        if (!plainTextPword) {
            return ''
        } else {
            var salt = bcrypt.genSaltSync(10);
            return bcrypt.hashSync(plainTextPword, salt);
        }
    }, 

    toJson: function() {
        var obj = this.toObject()
        delete obj.password;
        return obj;
    }

}

module.exports =  mongoose.model('user', UserSchema);