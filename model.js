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
    ageGroup: {
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
    district: {
        required: false,
        type: String
    },
    date: {
        required: false,
        type: Date
    },


});
const Souls = mongoose.model("souls", dataSchema);

module.exports = Souls;