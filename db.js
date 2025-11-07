const mongoose = require ('mongoose')
const mongoURI = "mongodb+srv://karanaritra19_db_user:SXETzHnwlv1anxvR@cluster1.ja3dbhe.mongodb.net/notebook"

const connectToMongo = async ()=>{
    // try{
        await mongoose.connect(mongoURI)
        console.log('connect to mongo')
    // }
    // catch(error){
    //     console.log(error);
    //     process.exit(1)
    // }
}
module.exports = connectToMongo;