import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();


// const config = {
//   host: "localhost",
//   user: "root",         // default XAMPP user
//   password: "",         // default is no password
//   database: "spark_ed", // your database name
//   port: 3306,           // default MySQL port
// };

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 3306,
};


const conn = mysql.createPool(config);
if (conn) console.log("Connected to database");
else console.log("Failed to connect to MySQL database");

export default conn;
