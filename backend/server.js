const express = require('express');
const cors = require('cors');
require('dotenv').config()

const mongoose = require('mongoose')

const { SubjectsModel } = require('./db');

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
app.post('/subjects', async (req, res) => {
  try {
    
    // Consider using "hourDuration" if that's what your schema expects
    const { name, attended, absent, hourDuration, note } = req.body;

    const insertedSubjects = await SubjectsModel.insertMany([{
      name,
      attended,
      absent,
      hourDuration,
      note,
    }]);

    res.status(201).json(insertedSubjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




app.listen(process.env.PORT, () => {
  console.log ('Listening on port', process.env.PORT)
})
