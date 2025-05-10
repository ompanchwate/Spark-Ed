import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  user: "root",         // default XAMPP user
  password: "",         // default is no password
  database: "spark_ed", // your database name
  port: 3306,           // default MySQL port
};

const conn = mysql.createPool(config);
if(conn) console.log("Connected to MySQL database");
else console.log("Failed to connect to MySQL database");

export default conn;
