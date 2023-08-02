const mongoose = require("mongoose");
async function  connectToMongo(req,res,next){
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test');
        console.log("Connected to mongo")
      } catch (error) {
        handleError(error);
      }
      next()
}

module.exports= connectToMongo