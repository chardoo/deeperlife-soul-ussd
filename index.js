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



// UssdMenu.



app.post('/ussd', (  async(req, res) => {
    
   const phoneNumber = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/
   

    console.log("somethinghe ha shakssks");
    const {
        sessionID,
        userID,
        newSession,
        msisdn,
        userData,
        network,
    } = req.body;

    if (newSession) {
        const message = "Welcome, Enter the name of the Soul to continue with registration" ;
           
        const continueSession = true;

        // Keep track of the USSD state of the user and their session
        const currentState = {
            sessionID,
            msisdn,
            userData,
            network,
            newSession,
            message,
            level: 1,
            page: 1,
        };

        let userResponseTracker = cache.get(sessionID);

        !userResponseTracker
            ? userResponseTracker = [{ ...currentState }]
            : userResponseTracker.push({ ...currentState });

        cache.put(sessionID, userResponseTracker);

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({
            userID,
            sessionID,
            message,
            continueSession,
            msisdn
        });
    }

    const userResponseTracker = cache.get(sessionID);

    if (!userResponseTracker) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({
            userID,
            sessionID,
            message: 'Error! Please dial code again!',
            continueSession: false,
            msisdn
        });
    }

    const lastResponse = userResponseTracker[userResponseTracker.length - 1];

    let message = "Bad Option";
    let continueSession = false;

    if (lastResponse.level === 1) {
         
        // let myName =  userData
        // dataToSave.name  = myName
       

        if(userData ==null ||  phoneNumber.test(userData)== true){
            message = "Sorry Enter a correct Name!, Name can't be a number or Empty";

            continueSession = true;

            const currentState = {
                sessionID,
                userID,
                level: 1,
                msisdn,
                message,
                userData,
                network,
                newSession,
                page: 1,
            };

            userResponseTracker.push({ ...currentState });
            cache.put(sessionID, userResponseTracker);
        }
         else {
            message = "Enter the gender of the Soul";

            continueSession = true;

            const currentState = {
                sessionID,
                userID,
                level: 2,
                msisdn,
                message,
                userData,
                network,
                newSession,
                page: 1,
            };

            userResponseTracker.push({ ...currentState });
            cache.put(sessionID, userResponseTracker);
        }
       

    } else if (lastResponse.level === 2) {
            
        // let mygender =  userData
        // dataToSave.gender  = mygender
            message = "Enter the contact of the person";

            continueSession = true;

            const currentState = {
                sessionID,
                userID,
                level: 3,
                msisdn,
                message,
                userData,
                network,
                newSession,
                page: 2
            };

            userResponseTracker.push({ ...currentState });
            cache.put(sessionID, userResponseTracker);

       
    }
    else if (lastResponse.level === 3) {

        // let mycontact =  userData
        // dataToSave.gender  = mycontact

        if( phoneNumber.test(userData) == false)    {
            message = "Please enter a correct phone Number";

            continueSession = true;

            const currentState = {
                sessionID,
                userID,
                level: 3,
                msisdn,
                message,
                userData,
                network,
                newSession,
                page: 2
            };

            userResponseTracker.push({ ...currentState });
            cache.put(sessionID, userResponseTracker);

        }       else{
       
        message = "Enter the town of the Soul";

        continueSession = true;

        const currentState = {
            sessionID,
            userID,
            level: 4,
            msisdn,
            message,
            userData,
            network,
            newSession,
            page: 2
        };

        userResponseTracker.push({ ...currentState });
        cache.put(sessionID, userResponseTracker);

    }
}  
     
else if (lastResponse.level === 4) {
    // let mytown =  userData
    // dataToSave.town  = mytown

    // const data = new Souls({
    //     name: dataToSave.name,
    //     gender: dataToSave.gender,
    //     contact: dataToSave.contact,
    //     town: dataToSave.town
    //     });

    //    await  data.save();
    console.log("last data")
    console.log(userData)
    message = "Soul successufully registered";

    continueSession = false;

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
        userID,
        sessionID,
        message,
        continueSession,
        msisdn
    });


}  


console.log("userimputer",    userData);
   

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
        userID,
        sessionID,
        message,
        continueSession,
        msisdn
    });
}));




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





