const express = require('express');
const cors = require('cors');
require('dotenv').config()

const mongoose = require('mongoose');
const verifyFirebaseToken = require('./middlewares/verifyFirebaseToken');
const { SubjectsModel,TableModel } = require('./db');
const admin  = require('firebase-admin');
const serviceAccount = require('./attendeese-app-firebase-adminsdk-fbsvc-618a164ca6.json');

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

app.delete("/subjects/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const deleted = await SubjectsModel.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.uid
    });

    if (!deleted) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// in server.js (or routes/subjects.js)
app.put('/subjects/:id/attendance', verifyFirebaseToken, async (req, res) => {
  const { id }   = req.params;
  const { type } = req.body;           // 'present'|'undoPresent'|'absent'|'undoAbsent'

  // Map the incoming “type” to a $inc operation
  let incOp;
  switch (type) {
    case 'present':     incOp = { attended:  1 }; break;
    case 'undoPresent': incOp = { attended: -1 }; break;
    case 'absent':      incOp = { absent:    1 }; break;
    case 'undoAbsent':  incOp = { absent:   -1 }; break;
    default:
      return res.status(400).json({ error: 'Invalid type' });
  }

  try {
    const updated = await SubjectsModel.findOneAndUpdate(
      { _id: id, createdBy: req.user.uid },
      { $inc: incOp },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Subject not found' });
    res.json(updated);
  } catch (err) {
    console.error('Attendance update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/timetable', verifyFirebaseToken, async (req, res) => {
  try {
    const { days } = req.body;
    if (!days || typeof days !== 'object') {
      return res.status(400).json({ message: 'Invalid payload: days object required' });
    }

    // Upsert the timetable document for this user
    const table = await TableModel.findOneAndUpdate(
      { createdBy: req.user.uid },
      { $set: { days } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Return only the days object, if that's all the client needs
    return res.json(table.days);
  } catch (err) {
    console.error('Error saving timetable:', err);
    return res.status(500).json({ message: 'Could not save timetable', error: err.message });
  }
});

app.get('/timetable', verifyFirebaseToken, async (req, res) => {
  try {
    let date = req.query.date || new Date().toISOString();
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    const table = await TableModel.findOne({ createdBy: req.user.uid });
    const entries = table?.days?.[dayName] || [];
    return res.json(table.days);
  } catch (err) {
    console.error('Timetable fetch error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});


app.listen(process.env.PORT, () => {
  console.log ('Listening on port', process.env.PORT)
});
