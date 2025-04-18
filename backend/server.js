const express = require('express');
const cors = require('cors');
require('dotenv').config()

const mongoose = require('mongoose');
const verifyFirebaseToken = require('./middlewares/verifyFirebaseToken');
const { SubjectsModel } = require('./db');
const { messaging } = require('firebase-admin');

// Define routes (you will create detailed routes next)


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI,  {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
    .then(() => { // A promise fires when complete
      
    })
    .catch((error) => {  // catch error and log it in console
        console.log(error)
    })
    
// Simple test route to insert subjects
app.post('/subjects',verifyFirebaseToken, async (req, res) => {
  //firebase-admin is to verify the idtoken sent by itself
  try {
    
    // Consider using "hourDuration" if that's what your schema expects
    const { name, attended, absent, hourDuration, note } = req.body;

    const insertedSubjects = await SubjectsModel.create([{
      name,
      attended,
      absent,
      hourDuration,
      note,

      createdBy: req.user.uid
    }]);

    res.status(201).json(insertedSubjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/subjects",verifyFirebaseToken,async(req,res)=>{
  try{
    const subjects = await SubjectsModel.find({ createdBy: req.user.uid });
    res.json(subjects);
  }catch(error){
    res.status(500).json({ message: 'server error' });
  }
});





app.listen(process.env.PORT, () => {
  console.log ('Listening on port', process.env.PORT)
})
