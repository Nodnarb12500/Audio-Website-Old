const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const db = require("./db/database");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/resources", express.static("resources"));
app.set("/resources", express.static("resources"));

app.get("/", (req, res) => {
  // send file instead of static?
  // make static a resources folder instead and manually send HTMl files?
});

app.post("/db/create", async (req, res) => {
  console.log(req.body);
  const results = await db.createRow(req.body);
  res.status(201).json({id: results[0]});

});

app.post("/db/modify/:id", async (req, res) => {
  console.log(req.body);
  const results = await db.modifyRow(req.params.id, req.body);
  res.status(200).json({results});

});

/* You might want to leave this commented out */
app.get("/db/rm/:id", async (req, res) => {
  // mark stuff for delete and hide instead?
  await db.deleteRow(req.params.id);
  res.status(200).json({success: true});
});

app.get("/db/get/:id", async (req, res) => {
  /* Get id and send back the JSON */
  const results = await db.getRow(req.params.id);
  res.status(200).json({results});

});

app.listen(3000, () => console.log("server is listening on port 3000"));
