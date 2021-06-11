const express = require("express");
const cors = require("cors");

const router = new express.Router();
const dataBaseConnection = require("./dataBaseConnection");
const collections = require("../constant").collections;
const ObjectID = require("mongodb").ObjectID;
const moment = require("moment");
const momentTimeZone = require("moment-timezone");

const {
  findAll,
  findOne,
  findByObj,
  insertOne,
  updateOne,
  upSert,
  correctMonthAndYear
} = require("./data");

dataBaseConnection().then(dbs => {
  router.get("/kot", cors(), async (req, res) => {
    try {
     // findAll(dbs, collections.kot).then(result => res.status(200).send(result));
     findAll(dbs,collections.kot).then(result => res.status(200).send(result));
     //console.log("sam",result)
    } catch (error) {
      console.log(error);
    }
  });

  router.get("/kot/:id", cors(), async (req, res) => {
    console.log("Get",req.params.id)
    try {
      findOne(dbs, collections.kot, {bookingId:new ObjectID(req.params.id)}).then(result => res.status(200).send(result));
    } catch (error) {
      console.log(error);
    }
  });

  router.post("/kot", cors(), async (req, res) => {
    //console.log("POST /kot", req.body)
    let x = [];
    findOne(dbs, collections.kot,{bookingId: new ObjectID(req.body.bookingId)})
    .then(result => {
      if(result){
       // console.log(result)
       res.status(400).json({msg:"kot already exist!"})
      
      }else{
        return findOne(dbs, collections.sequence,{name:"kot"}) 
      }
    })
    .then(result => {
      if(result){
        x=getBody(req.body,result)
        //console.log("x",x)
          return insertOne(dbs, collections.kot,{...x[0], bookingId: new ObjectID(x[0].bookingId)})
      }else{
        res.status(401).send()
      }
    })
    .then(result => {
      if(result){
        console.log("entered")
        return updateOne(dbs, collections.sequence, {name:"kot"}, {$inc:{seq:1}})
      }else{
        res.status(401).send()
      }
    })
    .then(result => {
      if(result){
        console.log("KOTID",x[0].kot[0].kotId)
        res.status(200).json({"kotId":x[0].kot[0].kotId})
      }else{
        res.status(401).send()
      }
    })
    .catch((error)=>{
      console.log(error);
      res.status(500).send()
    })
  });
  router.patch("/kot", cors(), async (req, res) => {
    const {bookingId, ...body} = req.body
    let x = [];
console.log("PATCH /kot", req.body,body)
   findOne(dbs, collections.sequence,{name:"kot"})   
    .then(result => {
      if(result){
         x=getPatchBody(body,result)
          return updateOne(dbs, collections.kot,{bookingId: new ObjectID(req.body.bookingId)},{$push: { kot: x[0]}})
      }else{
        res.status(401).send()
      }
    })
    .then(result => {
      if(result){
        return updateOne(dbs, collections.sequence, {name:"kot"}, {$inc:{seq:1}})
      }else{
        res.status(401).send()
      }
    })
    .then(result => {
      if(result){
        console.log("Kotid",x[0].kotId)
        res.status(200).json({"kotId":x[0].kotId})
      }else{
        res.status(401).send()
      }
    })
    .catch((error)=>{
      console.log(error);
      res.status(500).send()
    })
  });

})

function getPatchBody(kotbody,seq)
{
  var body=[]
  body.push({
    kotId: "KOT"+(1000000+Number(seq.seq)),
    kotArray : kotbody.kotArray
  })
  return body
}


function getBody(kotbody,seq){
  var body=[]
  body.push({
    bookingId: kotbody.bookingId,
    kot :  getKot(kotbody.kotArray,seq),
  })
  return body

}

function getKot(sam,seq){
  var kot=[]
  console.log("kotArray",sam)
  // for(const i in sam){
    kot.push({
      kotId: "KOT"+(1000+Number(seq.seq)),
      kotArray: sam

    })
  //}
  //console.log("kot",kot)
return kot

}
module.exports = router;