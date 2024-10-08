const mongoose = require('mongoose');

const connection = () => {
    console.log("Connecting to Mongo Url: ",process.env.MONGO_URL);
    mongoose.connect(process.env.MONGO_URL, {dbName: 'IGTechso_Chat_App'})
    .then(() => console.log("Database Connected"))
    .catch((e) => console.log("Error connecting to database",e));
}

module.exports = connection;