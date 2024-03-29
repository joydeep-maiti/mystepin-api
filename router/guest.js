const express = require("express");
const cors = require("cors");
const moment = require("moment")

const router = new express.Router();
const dataBaseConnection = require("./dataBaseConnection");
const collections = require("../constant").collections;
const { findAll, findOne, findByObj, findByObj1 } = require("./data");
const { ObjectID } = require("mongodb");

dataBaseConnection().then(dbs => {
  router.get("/guestReport", cors(), async (req, res) => {
    console.log("GET /guestReport", req.query);
    let bookingids = []
    let report = []
    let reportType = req.query.reportType;
    let roomnumber = req.query.roomnumber;


    date = req.query.fromDate + "T00:00:00.000Z"
    date1 = req.query.toDate + "T23:59:59.999Z"

    console.log("dates are:", date, date1);

    try {
      if (reportType == "Domicillary Guest") {
        findByObj1(dbs, collections.booking,
          { checkIn: { $gte: date, $lte: date1 }, 'status.checkedIn': true, nationality: 'Indian' }, { checkIn: 1 })
          .then(result => {
            var report = getGuestReport(result, reportType);
            res.send(report)
            // console.log(report , report.length); 

          })
      } else if (reportType == "Foreign Guest") {
        findByObj1(dbs, collections.booking,

          {
            checkIn: { $gte: date, $lte: date1 }, 'status.checkedIn': true, $or: [
              { nationality: "UAE" }, { nationality: "Japan" }, { nationality: "British" }, { nationality: "American" }, { nationality: "Australian" }, { nationality: "Saudi Arab" }, { nationality: "Africa" }, { nationality: "French" }
            ]
          }, { checkIn: 1 })
          .then(result => {
            var report = getGuestReport(result, reportType);
            res.send(report)
            console.log(report, report.length);

          })

      }
      else if (reportType == "Consolidated Guest") {
        findByObj1(dbs, collections.booking,

          { checkIn: { $gte: date, $lte: date1 }, 'status.checkedIn': true }, { checkIn: 1 })
          .then(result => {
            var report = getGuestReport(result, reportType);
            res.send(report)
            console.log(report, report.length);

          })

      }
      else if (reportType == "Room Wise") {
        findByObj1(dbs, collections.booking,
          { checkIn: { $gte: date, $lte: date1 }, 'status.checkedIn': true, 'rooms.roomNumber': roomnumber }, { checkIn: 1 })
          .then(result => {
            console.log(result, result.length)
            var report = getGuestReport(result, reportType);
            res.send(report)
            console.log(report, report.length);

          })

      }
      else if (reportType == "Additional Guests") {
        dbs.collection('booking').aggregate([
          {
            '$lookup': {
              'from': 'customer',
              'localField': '_id',
              'foreignField': 'bookingId',
              'as': '_guests'
            }
          }, {
            '$addFields': {
              'guests': '$_guests.guests'
            }
          }, {
            '$match': {
              checkIn: { $gte: date, $lte: date1 },
              'status.checkedIn': true
            }
          }
        ]).toArray(function (err, result) {
          // console.log("result", result)
          if (result){
            var report = getGuestReport(result , reportType);
            res.status(200).send(report)
          }
          console.log(err)
          res.status(500).send()
        })
        // findByObj1(dbs, collections.booking , 

        //   {checkIn:{$gte:date, $lte:date1},'status.checkedIn':true},{checkIn:1})
        // .then(result =>{
        //   console.log(result , result.length)
        //   var report = getGuestReport(result , reportType);
        //   res.send(report)
        // console.log(report , report.length); 

        // })

      }



    } catch (error) {
      console.log(error)

    }
  })
})

function getGuestReport(data, type) {
  var guestreport = []
  //console.log(data)
  for (const i in data) {
    if (type == "Domicillary Guest" && data[i].nationality === "Indian") {
      console.log("Guest Type", type);
      guestreport.push({
        checkIn: (data[i].checkIn) || "",
        checkOut: (data[i].checkOut) || "",
        guestName: (data[i].firstName + " " + data[i].lastName) || "",
        nationality: (data[i].nationality) || "",
        NoofRooms: (data[i].rooms).length || "",
        //bookedBy:data[i].bookedBy || "",
        bookedBy: getbookedby(data[i]) || "",
        referenceNumber: data[i].referencenumber || data[i].memberNumber || "",
        Amount: data[i].roomCharges || "",
        Advance: data[i].advance || "",
        // Balance:(data[i].roomCharges)-(data[i].advance),


      });

      console.log(guestreport)
    }
    var mysort = { $sort: { checkIn: -1 } }
    console.log(mysort)

    if (type == "Foreign Guest" && (data[i].nationality === "British" || data[i].nationality === "American" || data[i].nationality === "Australian" || data[i].nationality === "Japan" || data[i].nationality === "Saudi Arab" || data[i].nationality === "UAE" || data[i].nationality === "Africa" || data[i].nationality === "French")) {
      console.log("Guest Type", type);
      guestreport.push({
        checkIn: (data[i].checkIn) || "",
        checkOut: (data[i].checkOut) || "",
        checkOut: (data[i].checkOut).split('T')[0],
        guestName: (data[i].firstName + " " + data[i].lastName) || "",
        nationality: (data[i].nationality) || "",
        PassportNumber: (data[i].Idproof) || "",
        NoofRooms: (data[i].rooms).length || "",
        bookedBy: data[i].bookedBy || "",
        referenceNumber: data[i].referencenumber || data[i].memberNumber || "",
        Amount: data[i].roomCharges || "",
        Advance: data[i].advance || "",
        // Balance:(data[i].roomCharges)-(data[i].advance)

      });
    }

    if (type == "Room Wise" && (data[i].rooms[0].roomNumber)) {
      console.log("Guest Type", type);
      guestreport.push({
        checkIn: (data[i].checkIn) || "",
        checkOut: (data[i].checkOut) || "",
        checkOut: (data[i].checkOut).split('T')[0],
        guestName: (data[i].firstName + " " + data[i].lastName) || "",
        nationality: (data[i].nationality) || "",
        PassportNumber: (data[i].Idproof) || "",
        NoofRooms: (data[i].rooms).length || "",
        bookedBy: data[i].bookedBy || "",
        referenceNumber: data[i].referencenumber || data[i].memberNumber || "",
        Amount: data[i].roomCharges || "",
        Advance: data[i].advance || "",
        roomNumber: data[i].rooms[0].roomNumber
        // Balance:(data[i].roomCharges)-(data[i].advance)

      });
    }
    if (type == "Consolidated Guest") {

      console.log("Guest Type", type);
      guestreport.push({
        checkIn: (data[i].checkIn) || "",
        checkOut: (data[i].checkOut) || "",
        guestName: (data[i].firstName + " " + data[i].lastName) || "",
        nationality: (data[i].nationality) || "",
        NoofRooms: (data[i].rooms).length || "",
        //bookedBy:data[i].bookedBy || "",
        bookedBy: getbookedby(data[i]) || "",
        referenceNumber: data[i].referencenumber || data[i].memberNumber || "",
        Amount: data[i].roomCharges || "",
        Advance: data[i].advance || "",
        // Balance:(data[i].roomCharges)-(data[i].advance),


      });
    }
    if (type == "Additional Guests") {
      console.log("Guest Type", type);
      guestreport.push({
        checkIn: (data[i].checkIn) || "",
        checkOut: (data[i].checkOut) || "",
        guestName: (data[i].firstName + " " + data[i].lastName) || "",
        nationality: (data[i].nationality) || "",
        NoofRooms: (data[i].rooms).length || "",
        bookedBy: getbookedby(data[i]) || "",
        referenceNumber: data[i].referencenumber || data[i].memberNumber || "",
        Amount: data[i].roomCharges || "",
        Advance: data[i].advance || "",
        Guests: data[i].guests[0]
      });
    }

  }

  //console.log(guestreport)
  return guestreport; ``
}

function getbookedby(data) {
  if (data.bookedBy == "Agent") {
    return data.agent
  }
  return data.bookedBy
}

module.exports = router;

