const mysql = require("mysql");
const dbConfig = mysql.createConnection({
  host: "dcsrp-db-01.cvqssef8vzgx.ap-southeast-1.rds.amazonaws.com",
  user: "dcsrp_thathsara",
  password: "i6cLWGPsFXaQkB",
  database: "dcsrp_db",
  port: 3306,
  // host: "localhost",
  // user: "root",
  // password: "admin",
  // database: "dcsrp_db",
  // port: 3306,
});

//Create connection
dbConfig.connect((err) => {
  if (err) {
    console.log(err);
    throw err;
  } else {
    console.log("Database Connected");
  }
});

module.exports = dbConfig;
