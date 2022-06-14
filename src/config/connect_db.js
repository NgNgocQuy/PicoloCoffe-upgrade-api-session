const mongoose = require("mongoose");

async function connect() {
  
  try {
    console.log("Try connect to mongodb:");
    await mongoose.connect("mongodb+srv://quys:0k1m3HaKOIjIU1X9@cluster0.uwau6.mongodb.net/coffee?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("success!!!");
  } catch (error) {
    console.log(error);
  }
}

module.exports = { connect };

