const express = require("express");
const UssdMenu = require("ussd-builder");

const mongoose = require("mongoose");
const cache = require("memory-cache");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const axios = require("axios");
const Souls = require("./model");
const moment = require("moment");
const dotenv = require("dotenv");
dotenv.config();
const apiErrorHander = require("./errors/errorHandler");
const soulRouter = require("./routes/souls");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(cors());
app.use(helmet());
// UssdMenu.

let menu = new UssdMenu({ provider: "arkesel" });
// Define Session Config & States normally
let session = {};
menu.sessionConfig({
  start: (sessionId, callback) => {
    // initialize current session if it doesn't exist
    // this is called by menu.run()
    if (!(sessionId in session)) session[sessionId] = {};
    callback();
  },
  end: (sessionId, callback) => {
    // clear current session
    // this is called by menu.end()
    delete session[sessionId];
    callback();
  },
  set: (sessionId, key, value, callback) => {
    // store key-value pair in current session
    session[sessionId][key] = value;
    callback();
  },
  get: (sessionId, key, callback) => {
    // retrieve value by key in current session
    let value = session[sessionId][key];
    callback(null, value);
  },
});

menu.startState({
  run: () => {
    // use menu.con() to send response without terminating session
    menu.con(
      "Welcome to the convert registration portal for Global Crusade with Kumuyi." +
        "\nEnter the name of the individual:"
    );
  },
  // next object links to next state based on user input
  next: {
    "*[a-zA-Z]+": "gender",
  },
});

menu.state("gender", {
  run: function () {
    let name = menu.val;
    menu.session.set("name", name);
    menu.con("Choose the gender:" + "\n1. Male" + "\n2. Female");
  },
  next: {
    "1": "gender.age",
    "2": "gender.age",
  },
});

menu.state("gender.age", {
  run: function () {
    let gender = menu.val;
    if (gender == "1") {
      menu.session.set("gender", "Male");
    } else if (gender == "2") {
      menu.session.set("gender", "Female");
    }

    menu.con(
      "Choose the age group of the individual:" +
        "\n1. Adult" + "\n2. Youth" + "\n3. Child"
    );
  },
  next: {
    "1": "ageGroup.contact",
    "2": "ageGroup.contact",
    "3": "ageGroup.contact",
  }
})

menu.state("ageGroup.contact", {
  run: function () {
    let ageGroup = menu.val;
    if (ageGroup == "1") {
      menu.session.set("ageGroup", "Adult");
    } else if (ageGroup == "2") {
      menu.session.set("ageGroup", "Youth");
    } else {
      menu.session.set("ageGroup", "Child");
    }

    menu.con("Enter the phone number0:");
  },
  next: {
    "*^0\\d{9}$": "contact.town",
  },
});

menu.state("contact.town", {
  run: function () {
    let contact = menu.val;
    menu.session.set("contact", contact);
    menu.con("Enter the location of the individual:");
  },
  next: {
    "*[a-zA-Z]+": "town.finish",
  },
});

menu.state("town.finish", {
  run: async () => {
    let town = menu.val;
    let dataToSave = {};
    dataToSave.town = town;
    menu.session.set("town", town);

    menu.session.get("name", (err, value) => {
      dataToSave.name = value;
    });
    menu.session.get("gender", (err, value) => {
      dataToSave.gender = value;
    });
    menu.session.get("contact", (err, value) => {
      dataToSave.contact = value;
    });
    menu.session.get("ageGroup", (err, value) => {
      dataToSave.ageGroup = value;
    })

    const data = new Souls({
      name: dataToSave.name,
      gender: dataToSave.gender,
      ageGroup: dataToSave.ageGroup,
      contact: dataToSave.contact,
      town: dataToSave.town,
      district: "",
      date: Date.now(),
    });

    const savedData = await data.save();

    menu.end("Successfuly registered the individual.\nThank you!");
  },
});

menu.end;

app.post("/ussd", (req, res) => {
  menu.run(req.body, (resMsg) => {
    // resMsg would return an object like:
    // { "continueSession": "true", "message": "Some Response",  }
    res.json(resMsg);
  });
});

app.use("/souls", soulRouter);

app.use(apiErrorHander);

app.listen(3000, () => {
  const mongoString = "mongodb+srv://deeper:deeper@cluster0.by7qmqe.mongodb.net/?retryWrites=true&w=majority";
  mongoose.connect(mongoString);
  const database = mongoose.connection;
  database.on("error", (error) => {
    console.log(error);
  });
  database.once("connected", () => {
    console.log("Database connected...");
  });
  console.log(`Server is running on port `);
});
