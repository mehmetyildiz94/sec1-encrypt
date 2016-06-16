var LocalStrategy = require('passport-local').Strategy;

function init(passport, mongoose){
    console.log("configuring authentication");
    var user = mongoose.model('user');

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        user.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {// callback with username and password from our form
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        user.findOne({ 'username' :  username }, function(err, foundUser) {
            // if there are any errors, return the error before anything else
            if (err) { return done(err); }
            
            // if no user is found, return the message
            if (!foundUser){
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            }
            
            
            // if the user is found but the password is wrong
            if (!foundUser.validPassword(password)){
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
            }
            // all is well, return successful user
            return done(null, foundUser);
        });
    }));
    
    passport.use('local-register', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, username, password, done){
        process.nextTick(function(){
            
            user.findOne({ 'username' :  username }, function(err, foundUser) {
                // if there are any errors, return the error
                if (err){ return done(err) };

                // check to see if theres already a user with that email
                if (foundUser) {
                    return done(null, false, req.flash('registerMessage', 'This username is already taken.'));
                } else {
                    var newUser = new user();

                    // set the user's local credentials
                    newUser.username = username;
                    newUser.password = newUser.generateHash(password);

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    })); 
}

module.exports = init;