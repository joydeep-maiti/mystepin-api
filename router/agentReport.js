const express = require("express");
const cors = require("cors");
const moment = require("moment")

const router = new express.Router();
const dataBaseConnection = require("./dataBaseConnection");
const collections = require("../constant").collections;
const { findAll, findOne, insertOne, updateOne, deleteOne,findByObj1 } = require("./data");
const { ObjectID} = require("mongodb");
dataBaseConnection().then(dbs =>{
    router.get("/agentreport",cors(),async(req,res)=>{
        let bookingids =[]
        var report =[]
        let reportType = req.query.reportType;
        let agent = req.query.agent;
       
    
        date= req.query.fromDate+"T00:00:00.000Z"
        date1=req.query.toDate+"T23:59:59.999Z"
        try{
          if(reportType == "Agent Collection"){
            dbs.collection('billing').aggregate([
              {
                $lookup:
                {
                  from: "booking",
                  localField: "bookingId",
                  foreignField: "_id",
                  as: "details"
                }
        
              }
              ,
              {
                $match: {'details.checkOut': {$gte:date,$lte:date1},"details.bookedBy":"Agent"}
            }

             
            ]).toArray(function (err, result) {
             console.log(result)
              //var report = getagentReport(reportType, result)
              var agentreport = [];
              for(const i in result){
                agentreport.push({
                  billNo : result[i].billingId || "",
                 // name : result[i].guestName || "",
                  billingDate : result[i].checkOut || "",
                  guestName : result[i].guestName|| "",
                  bookingId : result[i].bookingId ||"",
                  roomrate : parseFloat(result[i].roomCharges) || "",
                  bookedBy : getbookingdetails(result[i].details) || "",
                  refnumber : getrefnymber(result[i].details)|| "",
                  agentname : getagentname(result[i].details)|| ""
                })
              }
             


              res.send(agentreport);
            
            })
            
           
           
          }
            if(reportType == "Agent Commission" ){
              dbs.collection('billing').aggregate([
                {
                  $lookup:
                  {
                    from: "booking",
                    localField: "bookingId",
                    foreignField: "_id",
                    as: "details"
                  }
          
                }
                ,
                {
                  $match: {'details.checkOut': {$gte:date,$lte:date1},'details.agent':{$eq:agent}}
              }
  
               
              ]).toArray(function (err, result) {
               console.log(result)
                //var report = getagentReport(reportType, result)
                var agentreport = [];
                for(const i in result){
                  agentreport.push({
                    billNo : result[i].billingId || "",
                   // name : result[i].guestName || "",
                    billingDate : result[i].checkOut || "",
                    guestName : result[i].guestName|| "",
                    bookingId : result[i].bookingId ||"",
                    roomrate : parseFloat(result[i].roomCharges) || "",
                   // bookedBy : getbookingdetails(result[i].details) || "",
                    refnumber : getrefnymber(result[i].details)|| "",
                    agentname : getagentname(result[i].details)|| "",
                    commisionPercent : 15,
                    commission : parseFloat(result[i].roomCharges)*15/100
                  })
                }
               
  
  
                res.send(agentreport);
              
              })
              

            }
            if(reportType == "Due from Agent"){
              console.log("hi")
              dbs.collection('billing').aggregate([
                {
                  $lookup:
                  {
                    from: "booking",
                    localField: "bookingId",
                    foreignField: "_id",
                    as: "details"
                  }
          
                }
                ,
                {
                  $match: {'details.checkOut': {$gte:date,$lte:date1},"details.bookedBy":"Agent","paymentData.billingStatus":"Due"}
              }
  
               
              ]).toArray(function (err, result) {
                console.log(result)
                 //var report = getagentReport(reportType, result)
                 var agentreport = [];
                 for(const i in result){
                   agentreport.push({
                     billNo : result[i].billingId || "",
                    // name : result[i].guestName || "",
                     billingDate : result[i].checkOut || "",
                     guestName : result[i].guestName|| "",
                     //bookingId : result[i].bookingId ||"",
                     roomrate : parseFloat(result[i].roomCharges) || "",
                    // bookedBy : getbookingdetails(result[i].details) || "",
                     refnumber : getrefnymber(result[i].details)|| "",
                     agentname : getagentname(result[i].details)|| "",
                     status : result[i].paymentData.billingStatus
                    //  commisionPercent : 15,
                    //  commission : parseFloat(result[i].roomCharges)*15/100
                   })
                 }
                
   
   
                 res.send(agentreport);
               
               })
               
            }
            
        }catch(errror){

        }
    })
})

function getbookingdetails(data){
  let bookedBy = [];
  for (const i in data){
    bookedBy = data[i].bookedBy;
  }
  return bookedBy;
}

function getrefnymber(data){
  let refnumber = [];
  for (const i in data){
    refnumber = data[i].referencenumber;
  }
  return refnumber;
}
function getagentname(data){
  let agentname = [];
  for (const i in data){
    agentname = data[i].agent;
  }
  return agentname;
}

module.exports = router;

              
