const express = require("express");
const UssdMenu = require("ussd-builder")
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const mongoose = require("mongoose");
const cache = require('memory-cache');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const Souls  =  require('./model')
const moment =  require('moment')
// UssdMenu.

let menu = new UssdMenu({ provider: 'arkesel' });
// Define Session Config & States normally
let session = {};
menu.sessionConfig({
    start: (sessionId, callback) =>{
        // initialize current session if it doesn't exist
        // this is called by menu.run()
        if(!(sessionId in session)) session[sessionId] = {};
        callback();
    },
    end: (sessionId, callback) =>{
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
    get: (sessionId, key, callback) =>{
        // retrieve value by key in current session
        let value = session[sessionId][key];
        callback(null, value);
    }
});



menu.startState({
    run: () => {
        // use menu.con() to send response without terminating session      
        menu.con('Welcome to Global Crusade Soul Registration App'  +
        '\n Enter the  Name of the Soul');
    },
   // next object links to next state based on user input
    next: {
        '*[a-zA-Z]+': 'gender',
    
   }
    
});


menu.state('gender', {
    run: function(){
        let name = menu.val;
       menu.session.set('name', name);
        menu.con('Choosethe Gender of the Soul' +
        '\n1. Male' +
        '\n2. Female' 
        );
    },
    next: {
        '1': 'gender.contact',
        '2': 'gender.contact'
    }
});


menu.state('gender.contact', {
    run: function(){
        let gender = menu.val;
        if(gender =='1'){
        menu.session.set('gender', "Male");
        }
        else{
            menu.session.set('gender', 'Female');
        }

        menu.con('Enter the  contact of the Soul');
    },
    next: {
        '*[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}': 'contact.town'
    }
});


menu.state('contact.town', {
    run: function(){
        let contact = menu.val;
       menu.session.set('contact', contact);
        menu.con('Enter the  town of the Soul');
    },
    next: {
        '*[a-zA-Z]+': 'town.finish'
    }
});


menu.state('town.finish', {
    run: async () =>{
        let town = menu.val;
        let dataToSave = {}
        dataToSave.town = town
        menu.session.set('town', town);
       
        menu.session.get('name',(err, value)=>{
          dataToSave.name = value;
       })
      menu.session.get('gender',  (err, value)=>{
        dataToSave.gender = value;
     })
    menu.session.get('contact', (err, value)=>{
        dataToSave.contact = value;
     })


     

       console.log(moment().format("MMM Do YY"));
     const data = new Souls({
        name: dataToSave.name,
        gender: dataToSave.gender,
        contact: dataToSave.contact,
        town: dataToSave.town,
        date: moment().format("MMM Do YY")
        });

       const savedData =  await data.save() ;
    
        menu.end('Registeration Succefull');
    },
   
});

menu.end

app.post('/ussd', (req, res) => {
    menu.run(req.body, resMsg => {
        // resMsg would return an object like:
        // { "continueSession": "true", "message": "Some Response",  }
        res.json(resMsg);
    });
})


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





