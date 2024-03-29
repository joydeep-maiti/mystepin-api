const express = require("express");
const cors = require("cors");

const router = new express.Router();
const dataBaseConnection = require("./dataBaseConnection");
const collections = require("../constant").collections;
const { findAll, insertOne, updateOne, deleteOne,  } = require("./data");
const { ObjectID } = require("mongodb");
dataBaseConnection().then(dbs => {
  router.get("/foodInventory", cors(), async (req, res) => {
    console.log("GET /foodInventory")
    try {
     await findAll(dbs, collections.foodInventory).then(result => res.status(200).send(result));
    } catch (error) {
      console.log(error);
    }
  });

  //Post
 router.post("/foodInventory", cors(), async (req, res) => {
    console.log("POST /foodInventory", req.body)
    const food = req.body;
    try {
       await insertOne(dbs,collections.foodInventory,food)
         .then((response)=>{
         console.log("200")
         res.sendStatus(200);
        })
        .catch((err)=>{
          console.log("Err",err)
          res.sendStatus(500)
        })
    } catch (error) {
      console.log(error);
      res.sendStatus(500)
    }
  });

  //Patch
  router.patch("/foodInventory", cors(), async (req, res) => {
    const {_id, ...body} = req.body
    console.log("PATCH /foodInventory", body)
    try {
      updateOne(dbs, collections.foodInventory, {_id:new ObjectID(_id)}, {$set:body}).then(result => res.sendStatus(200));
    } catch (error) {
      console.log(error);
    }
  });


  // Delete

  router.delete("/foodInventory/:id",cors(),async (req,res)=>{
    console.log("Delete id",req.params.id);
    try{
      deleteOne(dbs,collections.foodInventory, {_id:new ObjectID(req.params.id)})
      .then(result => res.sendStatus(200));
    }
    catch (error) {
      console.log(error);
    }
  })

  //***************************************Laundry --laundaryInventory ************************************************
  router.get("/laundaryInventory", cors(), async (req, res) => {
    console.log("GET /laundaryInventory")
    try {
     await findAll(dbs, collections.laundaryInventory).then(result => res.status(200).send(result));
    } catch (error) {
      console.log(error);
    }
  });

  //Post
 router.post("/laundaryInventory", cors(), async (req, res) => {
    console.log("POST /laundaryInventory", req.body)
    const food = req.body;
    try {
       await insertOne(dbs,collections.laundaryInventory,food)
         .then((response)=>{
         console.log("200")
         res.sendStatus(200);
        })
        .catch((err)=>{
          console.log("Err",err)
          res.sendStatus(500)
        })
    } catch (error) {
      console.log(error);
      res.sendStatus(500)
    }
  });

  //Patch
  router.patch("/laundaryInventory", cors(), async (req, res) => {
    const {_id, ...body} = req.body
    console.log("PATCH /laundaryInventory", body)
    try {
      updateOne(dbs, collections.laundaryInventory, {_id:new ObjectID(_id)}, {$set:body}).then(result => res.sendStatus(200));
    } catch (error) {
      console.log(error);
    }
  });


  // Delete

  router.delete("/laundaryInventory/:id",cors(),async (req,res)=>{
    console.log("Delete id",req.params.id);
    try{
      deleteOne(dbs,collections.laundaryInventory, {_id:new ObjectID(req.params.id)})
      .then(result => res.sendStatus(200));
    }
    catch (error) {
      console.log(error);
    }
  })

//******************************************House keeping ********** */
router.get("/houseKeepingInventory", cors(), async (req, res) => {
  console.log("GET /houseKeepingInventory")
  try {
   await findAll(dbs, collections.houseKeepingInventory).then(result => res.status(200).send(result));
  } catch (error) {
    console.log(error);
  }
});

//Post
router.post("/houseKeepingInventory", cors(), async (req, res) => {
  console.log("POST /houseKeepingInventory", req.body)
  const food = req.body;
  try {
     await insertOne(dbs,collections.houseKeepingInventory,food)
       .then((response)=>{
       console.log("200")
       res.sendStatus(200);
      })
      .catch((err)=>{
        console.log("Err",err)
        res.sendStatus(500)
      })
  } catch (error) {
    console.log(error);
    res.sendStatus(500)
  }
});

//Patch
router.patch("/houseKeepingInventory", cors(), async (req, res) => {
  const {_id, ...body} = req.body
  console.log("PATCH /houseKeepingInventory", body)
  try {
    updateOne(dbs, collections.houseKeepingInventory, {_id:new ObjectID(_id)}, {$set:body}).then(result => res.sendStatus(200));
  } catch (error) {
    console.log(error);
  }
});
// Delete
router.delete("/houseKeepingInventory/:id",cors(),async (req,res)=>{
  console.log("Delete id",req.params.id);
  try{
    deleteOne(dbs,collections.houseKeepingInventory, {_id:new ObjectID(req.params.id)})
    .then(result => res.sendStatus(200));
  }
  catch (error) {
    console.log(error);
  }
})

});





module.exports = router;
