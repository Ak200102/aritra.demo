const mongoose = require ('mongoose')
const mongoURI = "mongodb://localhost:27017/notebook"

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