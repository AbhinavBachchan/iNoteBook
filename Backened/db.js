const mongoose  = require("mongoose");
const mongooseURI = "mongodb://127.0.0.1/iNotebook";
const connectToMongo = async () => {
    try {
      mongoose.set("strictQuery", false);
      mongoose.connect(mongooseURI);
      console.log("Connected to mongoDB successfully");
    } catch (error) {
      console.log(error);
      process.exit();
    }
  };
module.exports=connectToMongo;