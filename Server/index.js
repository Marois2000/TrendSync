const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const path = "localhost/";

//MIDDLEWARE
app.use(cors());
app.use(express.json());


// Get a User
app.get(path+'trendsync/login:5000', (req, res) => {
    const {email, password} = req;
    const query = pool.query("SELECT * FROM users WHERE email=$1 AND password=$2;", [email, password]);

    res = query.rows;
});







app.listen(5000, () => {
    console.log("Server has started on port: 5000")
});