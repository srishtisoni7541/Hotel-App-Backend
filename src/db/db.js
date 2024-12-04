const mongoose = require("mongoose");

 connect = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Database connected.");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports=connect;