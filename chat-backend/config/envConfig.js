const dotenv = require("dotenv");
const path = require('path')



module.exports = function () {
    try {
        const envFilePath = path.resolve(__dirname, '.env');
        dotenv.config({path: envFilePath});
        console.log(process.env.PORT);
    }
    catch(err) {
        console.log("Env Config Error:", err);
    }
}