const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

const TableSchema = new Schema({

    createdBy: { type: String, required: true },

    days:{
        Monday:    { type: [String], default: [] },
        Tuesday:   { type: [String], default: [] },
        Wednesday: { type: [String], default: [] },
        Thursday:  { type: [String], default: [] },
        Friday:    { type: [String], default: [] },
        Saturday:  { type: [String], default: [] },
    },
    
})

const Subjects = new Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    attended:{
        type: Number,
        default: 0
    },
    absent:{
        type: Number,
        default: 0
    },
    hourDuration:{
        type: Number,
        default: 1
    },
    note:{
        type: String,
        trim: true,
        default: ''
    },
    createdBy:{
        type:String,
        required: true,
    }
},
{
    timestamps: true,
});

Subjects.virtual('total').get(function () {
    return this.attended + this.absent;
});

Subjects.virtual('attendancePercentage').get(function () {
    const totalClasses = this.attended + this.absent;
    if (totalClasses === 0) return 0;
    const totalAttendedHours = this.attended * this.hourDuration;
    const totalClassesHours = totalClasses * this.hourDuration;
    return ((totalAttendedHours / totalClassesHours) * 100).toFixed(2);
});



const SubjectsModel = mongoose.model('subjects',Subjects);
const TableModel = mongoose.model('tableschema',TableSchema);


module.exports = {
    SubjectsModel,
    TableModel
}