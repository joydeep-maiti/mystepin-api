const express = require("express");
const cors = require("cors");

const router = new express.Router();
const dataBaseConnection = require("./dataBaseConnection");
const collections = require("../constant").collections;
const { findAll } = require("./data");

dataBaseConnection().then(dbs => {
    router.get("/weekview", cors(), async (req, res) => {
      console.log("GET/weekview", req.body)
      let  weekviewdates=req.query.weekviewdates;
      var weekbookings=[];
      let dates = daysBetweenDates(req.query.fromDate, req.query.toDate)
      try {
        findAll(dbs, collections.booking)
        .then(result =>result.forEach(element => { 
            weekbookings.push(element.booking)
        })
            )
        console.log(weekbookings)

      }
      catch (error){
        console.log(error);
      }
    });
    });

module.exports = router;
