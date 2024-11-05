const mongoose = require("mongoose");

const signupSchema = new mongoose.Schema({
    name: { required: true, type: String },
    email: { required: true, type: String, unique: true },
    mobile: { required: true, type: String },
    password: { required: true, type: String },
    quizzesParticipated: { type: Number, default: 0 },  // New field for tracking quizzes participated
    averageMarks: { type: Number, default: 0 },         // New field for tracking average marks
    attempts: {                                           // New field for tracking attempts by domain
        sports: { type: Number, default: 0 },
        coding: { type: Number, default: 0 },
        history: { type: Number, default: 0 },
        gk: { type: Number, default: 0 },
        politics: { type: Number, default: 0 },
        cinemas: { type: Number, default: 0 },
    }
});

let signupModel = mongoose.model("Signupdetails", signupSchema);
module.exports = signupModel;
