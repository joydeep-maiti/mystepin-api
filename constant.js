const monthObj = {
  monthName: "",
  year: "",
  monthNumber: "",
  numberOfDays: "",
  bookingArray: []
};

const dataBaseName = "hotel-booking";

const collections = {
  room: "room",
  booking: "booking",
  pos: "pos",
  advancetab: "advancetab",
  billing: "billing",
  customer: "customer",
  season: "season",
  roomcategory: "roomcategory",
  tax: "tax",
  rate:"rate",
  idproof:"idproof",
  reporttype:"reporttype",
  propertyDetails:"propertyDetails",
  sequence:"sequence",
  user:"user",
  foodInventory:"foodInventory",
  laundaryInventory:"laundaryInventory",
  houseKeepingInventory:"houseKeepingInventory",
  access:"access",
  kot : "kot",
  userlog:"userlog"
};

const mongoUrl = process.env.MONGODB_URL;

module.exports = { monthObj, dataBaseName, collections, mongoUrl };
