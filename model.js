const mongoose = require("mongoose");
const dataSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    gender: {
        required: true,
        type: String
    },
    contact: {
        required: true,
        type: String
    },
    town: {
        required: true,
        type: String
    },
    date: {
        required: false,
        type: String
    },


});
const Souls = mongoose.model("souls", dataSchema);

module.exports = Souls;
