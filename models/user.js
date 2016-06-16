var bcrypt = require('bcrypt-nodejs');

function init(mongoose){
    console.log("Initializing user model...");
    
    var user = new mongoose.Schema({
        username: {type: String, required: true},
        password: {type: String, required: true},
        role: {type: String, default: "admin", required: true}
    });
    
    user.methods.generateHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    // checking if password is valid
    user.methods.validPassword = function(givenPassword) {
        return bcrypt.compareSync(givenPassword, this.password);
    };
    
    mongoose.model('user', user);
}

module.exports = init;