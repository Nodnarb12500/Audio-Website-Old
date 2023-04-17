const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const db = require("./db/database");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/resources", express.static("resources"));
app.set("/resources", express.static("resources"));


/* Pages for modifying shit */
app.post("/db/create", async (req, res) => {
  console.log(req.body);
  const results = await db.createAudio(req.body);
  res.status(201).json({id: results[0]});

});

app.post("/db/modify/:id", async (req, res) => {
  console.log(req.body);
  const results = await db.modifyAudio(req.params.id, req.body);
  res.status(200).json({results});

});

/* You might want to leave this commented out */
// app.get("/db/rm/:id", async (req, res) => {
//   // mark stuff as hidden instead?
//   // this will only remove the database entrie and not the files
//   await db.deleteAudio(req.params.id);
//   res.status(200).json({success: true});
// });

app.get("/db/get/:id", async (req, res) => {
  /* Get id and send back the JSON */
  const results = await db.getAudio(req.params.id);
  res.status(200).json({results});

});

/* database queries */
app.get("/db/search/:search/:page", async (req, res) => {
  const results = await db.getTwentyFive(req.params.search, req.params.page)
  res.status(200).json({results});
});

app.get("/db/databaseSize", async (req, res) => {
  // helps figure out that maximum page for skipping to
  var results = await db.databaseSize();
  results = results[0]["count(*)"];
  res.status(200).json({results});
});

/* user interactable pages */
app.get("/", (req, res) => {
  res.sendFile('html/index.html', {root: __dirname});
});

app.get("/audio/playlist", (req, res) => {
  res.sendFile('html/playlist.html', {root: __dirname});
});

app.get("/audio/:id", (req, res) => {
  res.sendFile('html/media.html', {root: __dirname});
});

app.listen(3000, () => console.log("server is listening on port 3069"));
