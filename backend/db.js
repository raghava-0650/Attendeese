const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

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

module.exports = {
    SubjectsModel,
}