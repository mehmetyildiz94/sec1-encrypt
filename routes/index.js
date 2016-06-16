var express = require('express');
// var passport = require('passport');
var router = express.Router();
// var user;
var message;
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index2');
});

// router.post('/login', passport.authenticate('local-login', {
// 		successRedirect : '/dashboard', // redirect to the secure profile section
// 		failureRedirect : '/', // redirect back to the signup page if there is an error
// 		failureFlash : true // allow flash messages
// }));

// /* GET register page. */
// router.get('/register', function(req, res, next){
//     res.render('register', {title: "TEST TITLE", message: req.flash('registerMessage') });
// });

// router.post('/register', passport.authenticate('local-register', {
//     succesRedirect: '/dashboard',
//     failureRedirect: '/register',
//     failureFlash: true
// }));

/* GET dashboard page. */
// router.get('/dashboard', function(req, res){
//   //alle messages ophalen met userid
//   //alle messages decrypten met wachtwoord van user
//   //messages meegeven
//   res.render('dashboard');
// });

router.post('/encrypt', function(req, res){
  var encryptedPass = req.body.username + '' + req.body.password;
  var encryptedMessage = encrypt(req.body.message, encryptedPass);

  var msg = new message({message: encryptedMessage});
  
  msg.save(function(err, savedMessage){
    if (err) {
      return handleError(req, res, 500, err);
    } else {
        res.render('index2');
    }
  });
});

router.post('/decrypt', function(req, res){
  var encryptedPass = req.body.username + '' + req.body.password;

  message.findOne({message: req.body.message}, function(err, foundMessage){
    if (err) {
      console.log("ERR: " + err);
    }else if(foundMessage != null){
      var decryptedMessage = decrypt(foundMessage.message, encryptedPass);
      res.render('index2', {message: decryptedMessage});
    }else{
      console.log("message does not exist.");
      res.render('index2');
    } 
  });
  
});

router.get('/logout', function(req, res, next){
    req.logout();
    res.redirect('/');
});

function encrypt(text, password){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text, password){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

module.exports = function(mongoose){
    console.log('Initializing index routing module');
    message = mongoose.model('message');
    return router;
};
