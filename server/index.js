const keys = require("./keys");
const cors = require("cors");
const express = require("express");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { Pool } = require("pg");
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

pgClient.on("connect", (client) => {
  client.query("CREATE TABLE IF NOT EXISTS values (number INT)").catch((err) => console.log(err));
});

app.get("/", async (req, res) => {
  res.send("hi");
});

app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * FROM values");

  res.send(values);
});

app.post("/values", async (req, res) => {
  if (!req.body.value) return res.send({ working: false });
  pgClient.query("INSERT INTO values(number) VALUES($1)", [req.body.value]);

  return res.send({ working: true });
});

app.listen(5000, (err) => {
  // console.clear();
  console.log("Listening on port 5000");
});
