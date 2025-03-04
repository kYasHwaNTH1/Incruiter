const express =  require('express')
const mongoose = require('mongoose')
const router = require('./routes')
const cors = require('cors')
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(router)
async function main(){
   app.listen(process.env.port || 3000,()=>{
    console.log(`listening on ${process.env.port}`);
   });
  await mongoose.connect(process.env.mongodbUrl).then(()=>{
    console.log('Connected to MongoDB');
   })

}

main();