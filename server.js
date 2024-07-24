/********************************************************************************
*  WEB322 – Assignment 02
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Khushi Singh
*  Student ID: 173680216
*  Date: 
*
********************************************************************************/

// console.log("Current directory:", __dirname);
// console.log("File path:", path.join(__dirname, "/public/data/setData.json"));

const legoData = require("./modules/legoSets");
const path = require("path");
const express = require('express');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));


// Serve home.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "/views/home.html"));
});

// Serve about.html
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});




// Handle requests for Lego sets
app.get("/lego/sets", async (req, res) => {
  try {
    if (req.query.theme) {
      let sets = await legoData.getSetsByTheme(req.query.theme);
      res.send(sets);
    } else {
      let sets = await legoData.getAllSets();
      res.send(sets);
    }
  } catch (err) {
    res.status(404).send(err);
  }
});

// Handle requests for a specific Lego set
app.get("/lego/sets/:num", async (req, res) => {
  try {
    let set = await legoData.getSetByNum(req.params.num);
    res.send(set);
  } catch (err) {
    res.status(404).send(err);
  }
});

// Middleware to handle 404 errors
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
});

// Initialize lego data and start server
legoData.initialize().then(() => {
  app.listen(HTTP_PORT, () => { 
    console.log(`Server listening on: ${HTTP_PORT}`); 
    console.log(`http://localhost:${HTTP_PORT}`);
  });
}).catch(err => {
  console.error("Failed to initialize lego data:", err);
});
