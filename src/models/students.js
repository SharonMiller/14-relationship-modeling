'use strict';

import mongoose from 'mongoose';
import Classes from './classes';

const studentSchema = mongoose.Schema({
  name: { type: String, required: true },
  gradeLevel: { type: Number, min: 1, max: 12, required: true },
  createdOn: { type: Date, default: Date.now() },
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'classes' }],
});
studentSchema.pre('findOne', function (next) {
  this.populate('classes');
  next();
});

studentSchema.pre('save', function (next) {
  let studentId = this._id;
  let classId = this.class;


  Classes.findById(classId)
    .then(className => {
      if (!className) {
        return Promise.reject('invalid request');
      }

      Classes.findByIdAndUpdate(
        { _id: classId },
        { $addToSet: { students: studentId } }
      )

        .then(Promise.resolve())
        .catch(err => Promise.reject(err));
    })
    .then(Promise.resolve())
    .catch(err => Promise.reject(err));
});

export default mongoose.model('students', studentSchema);

//you can read with just ids coming back, or with documents coming back
//use poplulate to query call populate to identify a specific child document ie ref to classes you can do poplulate classes - it will iterate through array and query the an map opject id to the object document they are referencing - this is similar to joins


