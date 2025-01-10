const express=require('express');
const app=express();
const mongoose=require('mongoose');
const fetchData=require('./tasks/fetchData');
const cleanupData = require('./tasks/cleanupData'); 

require('dotenv').config();
const dbURI=process.env.dbURI;
mongoose.connect(dbURI)
.then(()=>console.log("database connected"));

// Database
app.use('/deleteCoin',require('./tasks/deleteData'))
app.use('/api', require('./routes/api'));
app.use(express.json());

// Start the background job
fetchData();

// Cleanup data on server start
cleanupData();

// Server
app.listen(5010,()=>{
    console.log(`server is running on port 5010`)
});
app.get('/',(req,res)=>{
    res.send('hello to the crypto page')
})
