const mysql = require("mysql");

const sql = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Alekozila101!",
  database: "TELEBID_PROJECT"
});

sql.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL!");
});

module.exports = sql;