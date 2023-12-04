const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config()
const db_url = process.env.DB_URL
mongoose.connect(db_url, {useNewUrlParser:true, useUnifiedTopology:true})
        .then(() => {
            console.log("Connected to the Database");
        })
        .catch((err) => {
            console.log(err);
        })


module.exports = mongoose;