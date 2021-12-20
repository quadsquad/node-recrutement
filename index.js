const express = require('express');
const cors = require('cors');
require("dotenv").config();
const PORT = process.env.PORT || 8097;
const app = express();
const Verifier = require("email-verifier");
let verifier = new Verifier("at_fbYHeD2J55059T4krj83uGu7XN7ul");
const urlExists = require("url-exists");
const axios = require('axios');

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use(express.json());
app.use(cors());

app.listen(PORT, () => console.log(`Listening on PORT ${ PORT }`));

app.get('/verify-email', async (req, res) => {
  try {
        verifier.verify(req.query.email, (err, data) => {
            if (err) console.log(err);
                if (data.smtpCheck === "false") {
                    return res.status(400).json({msg: "Email Not Valid!"});
                }
                return res.status(200).json({msg: "Email valid!"});
          });
    } catch (err) {
        res.status(500).json(err.message);
    }
});

const urlExistsPromise = url => new Promise((resolve, reject) =>
    urlExists(url, (err, exists) => err ? reject(err) : resolve(exists)));

app.get('/verify-url', async (req, res) => {
    try {
        urlExistsPromise(req.query.businessWebsite).then(exists => {
           if (exists === true || req.query.businessWebsite === "http://esprit.tn" || req.query.businessWebsite === "https://esprit.tn") {
                 return res.status(200).json({msg: "URL YOU ENTERED IS VALID"});
           }
           if (exists === false && req.query.businessWebsite !== "http://esprit.tn" && req.query.businessWebsite !== "https://esprit.tn") {
               return res.status(400).json({msg: "URL YOU ENTERED IS INVALID"});
           }
        });
    } catch (err) {
        res.status(500).json(err.message);
    }
});