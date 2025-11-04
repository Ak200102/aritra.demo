
const mongoose = require('mongoose');
const { Schema } = mongoose;
const notesSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    tag:{
        type:String,
        default:"Genarel"
    }


});
module.exports = mongoose.model("notes",notesSchema);