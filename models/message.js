function init(mongoose){
    console.log("Initializing message model...");
    
    var message = mongoose.Schema({
        message: {type: String,  required: true}
    });
    
    mongoose.model('message', message);
}

module.exports = init;